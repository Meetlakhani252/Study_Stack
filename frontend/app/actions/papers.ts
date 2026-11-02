"use server";

import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

export interface PaperItem {
  id: string;
  subject_id: string;
  year: number;
  file_url: string;
  uploaded_at: string;
  question_count?: number;
}

export interface TopicFrequency {
  topic: string;
  frequency: number;
  years: number[];
  probability: number;
  priority: "High" | "Medium" | "Low";
  sampleQuestions: string[];
}

export interface PaperAnalysisResult {
  totalPapers: number;
  totalQuestions: number;
  topicFrequencies: TopicFrequency[];
}

export async function getPapersBySubject(subjectId: string): Promise<PaperItem[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const subCheck = await sql`SELECT id FROM subjects WHERE id = ${subjectId} AND user_id = ${userId}`;
  if (subCheck.length === 0) throw new Error("Subject not found or unauthorized");

  const rows = await sql`
    SELECT 
      p.id, 
      p.subject_id, 
      p.year, 
      p.file_url, 
      p.uploaded_at,
      COUNT(pq.id)::int as question_count
    FROM papers p
    LEFT JOIN paper_questions pq ON p.id = pq.paper_id
    WHERE p.subject_id = ${subjectId}
    GROUP BY p.id
    ORDER BY p.year DESC, p.uploaded_at DESC
  `;

  return rows.map((r: any) => ({
    id: r.id,
    subject_id: r.subject_id,
    year: Number(r.year),
    file_url: r.file_url,
    uploaded_at: r.uploaded_at instanceof Date ? r.uploaded_at.toISOString() : String(r.uploaded_at),
    question_count: Number(r.question_count || 0),
  }));
}

export async function getSubjectPaperAnalysis(subjectId: string): Promise<PaperAnalysisResult> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const subCheck = await sql`SELECT id FROM subjects WHERE id = ${subjectId} AND user_id = ${userId}`;
  if (subCheck.length === 0) throw new Error("Subject not found or unauthorized");

  const paperCountResult = await sql`
    SELECT COUNT(*)::int as count FROM papers WHERE subject_id = ${subjectId}
  `;
  const totalPapers = Number(paperCountResult[0]?.count || 0);

  if (totalPapers === 0) {
    return {
      totalPapers: 0,
      totalQuestions: 0,
      topicFrequencies: [],
    };
  }

  const rows = await sql`
    SELECT 
      COALESCE(t.title, pq.raw_topic_label, 'General / Miscellaneous') as topic_name,
      p.year,
      pq.question_text
    FROM paper_questions pq
    JOIN papers p ON pq.paper_id = p.id
    LEFT JOIN topics t ON pq.matched_topic_id = t.id
    WHERE p.subject_id = ${subjectId}
  `;

  const totalQuestions = rows.length;
  const map: Record<string, { years: Set<number>; count: number; questions: string[] }> = {};

  for (const r of rows) {
    const topic = r.topic_name || "General / Miscellaneous";
    if (!map[topic]) {
      map[topic] = { years: new Set(), count: 0, questions: [] };
    }
    map[topic].count += 1;
    if (r.year) map[topic].years.add(Number(r.year));
    if (r.question_text && map[topic].questions.length < 3) {
      map[topic].questions.push(r.question_text);
    }
  }

  const topicFrequencies: TopicFrequency[] = Object.entries(map).map(([topic, data]) => {
    const yearsArr = Array.from(data.years).sort((a, b) => b - a);
    const probability = Math.min(100, Math.round((yearsArr.length / Math.max(1, totalPapers)) * 100));
    let priority: "High" | "Medium" | "Low" = "Low";
    if (probability >= 60) priority = "High";
    else if (probability >= 30) priority = "Medium";

    return {
      topic,
      frequency: data.count,
      years: yearsArr,
      probability,
      priority,
      sampleQuestions: data.questions,
    };
  });

  topicFrequencies.sort((a, b) => b.probability - a.probability || b.frequency - a.frequency);

  return {
    totalPapers,
    totalQuestions,
    topicFrequencies,
  };
}

export async function uploadAndAnalyzePaper(data: {
  subjectId: string;
  year: number;
  paperType: string;
  pdfBase64?: string;
  sampleQuestionsText?: string;
  fileName?: string;
}): Promise<PaperItem> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const subCheck = await sql`SELECT id FROM subjects WHERE id = ${data.subjectId} AND user_id = ${userId}`;
  if (subCheck.length === 0) throw new Error("Subject not found or unauthorized");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const existingTopics = await sql`
    SELECT id, title FROM topics WHERE subject_id = ${data.subjectId}
  `;
  const topicsList = existingTopics.map((t: any) => ({ id: t.id, title: t.title }));

  const prompt = `You are an examination paper analyzer. 
Analyze the provided past paper for the subject.
Syllabus topics for this subject: ${JSON.stringify(topicsList.map(t => t.title))}

Extract all individual questions from the examination paper.
For each question, classify which syllabus topic it belongs to. If it matches one of the syllabus topics, use that exact topic title. If it does not match, provide a concise topic name.

Respond ONLY with a valid JSON array of objects with keys:
- "question_text": string
- "topic": string`;

  const contents: any[] = [];
  const parts: any[] = [];

  if (data.pdfBase64) {
    parts.push({
      inline_data: {
        mime_type: "application/pdf",
        data: data.pdfBase64,
      },
    });
  }

  if (data.sampleQuestionsText) {
    parts.push({ text: `Exam Questions:\n${data.sampleQuestionsText}` });
  }

  parts.push({ text: prompt });
  contents.push({ parts });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { responseMimeType: "application/json" },
        contents,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini paper analysis error:", err);
    throw new Error("AI Paper Analysis failed. Please verify the uploaded PDF.");
  }

  const result = await response.json();
  const rawJson = result.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  let extractedQuestions: Array<{ question_text: string; topic: string }> = [];

  try {
    extractedQuestions = JSON.parse(rawJson);
  } catch {
    console.warn("Failed to parse Gemini JSON:", rawJson);
    extractedQuestions = [];
  }

  const fileLabel = `${data.paperType || "Exam Paper"} (${data.year}) - ${data.fileName || "paper.pdf"}`;
  const paperRows = await sql`
    INSERT INTO papers (subject_id, year, file_url)
    VALUES (${data.subjectId}, ${data.year}, ${fileLabel})
    RETURNING id, subject_id, year, file_url, uploaded_at
  `;
  const paper = paperRows[0] as any;

  for (const q of extractedQuestions) {
    if (!q.question_text) continue;
    
    const matched = topicsList.find(
      t => t.title.toLowerCase().trim() === (q.topic || "").toLowerCase().trim()
    );

    await sql`
      INSERT INTO paper_questions (paper_id, question_text, matched_topic_id, raw_topic_label)
      VALUES (${paper.id}, ${q.question_text}, ${matched ? matched.id : null}, ${q.topic || "General"})
    `;
  }

  return {
    id: paper.id,
    subject_id: paper.subject_id,
    year: Number(paper.year),
    file_url: paper.file_url,
    uploaded_at: paper.uploaded_at instanceof Date ? paper.uploaded_at.toISOString() : String(paper.uploaded_at),
    question_count: extractedQuestions.length,
  };
}

export async function deletePaper(paperId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await sql`
    DELETE FROM papers
    WHERE id = ${paperId}
      AND subject_id IN (SELECT id FROM subjects WHERE user_id = ${userId})
  `;
}
