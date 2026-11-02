"use server";

import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

export interface DoubtItem {
  id: string;
  subject_id: string;
  user_id: string;
  question_text: string;
  image_url: string | null;
  answer_text: string | null;
  created_at: string;
}

const DAILY_LIMIT = 20;

export async function getDoubtsBySubject(subjectId: string): Promise<DoubtItem[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const rows = await sql`
    SELECT id, subject_id, user_id, question_text, image_url, answer_text, created_at
    FROM doubts
    WHERE subject_id = ${subjectId} AND user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows.map((r: any) => ({
    ...r,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  })) as DoubtItem[];
}

export async function getUserDailyDoubtUsage(): Promise<{ used: number; limit: number }> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const countResult = await sql`
    SELECT count(*)::int as count
    FROM doubts
    WHERE user_id = ${userId} AND created_at >= CURRENT_DATE
  `;

  const used = Number(countResult[0]?.count || 0);
  return { used, limit: DAILY_LIMIT };
}

export async function createAndSolveDoubt(data: {
  subjectId: string;
  questionText: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<DoubtItem> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { used, limit } = await getUserDailyDoubtUsage();
  if (used >= limit) {
    throw new Error(`Daily AI limit reached (${limit}/${limit} doubts). Please try again tomorrow.`);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const parts: any[] = [];
  if (data.imageBase64) {
    parts.push({
      inline_data: {
        mime_type: data.mimeType || "image/jpeg",
        data: data.imageBase64,
      },
    });
  }

  const userQuery = data.questionText.trim()
    ? data.questionText
    : "Please solve and explain the question or concept shown in the image step-by-step.";

  parts.push({ text: userQuery });

  const systemInstruction = `You are an expert college tutor on StudyStack.
When solving this student's doubt:
1. Explain the underlying conceptual foundation clearly.
2. Provide a rigorous, step-by-step solution or derivation.
3. Highlight key formulas, definitions, or exam tips.
4. Conclude with a concise 'Key Takeaway' summary.
Format equations and code clearly using clean markdown.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [{ parts }],
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", errText);
    throw new Error("Failed to get solution from AI. Please try again.");
  }

  const result = await response.json();
  const answerText =
    result.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text)
      .filter(Boolean)
      .join("\n") || "No explanation could be generated.";

  const storedImageUrl = data.imageBase64
    ? `data:${data.mimeType || "image/jpeg"};base64,${data.imageBase64}`
    : null;

  const rows = await sql`
    INSERT INTO doubts (subject_id, user_id, question_text, image_url, answer_text)
    VALUES (${data.subjectId}, ${userId}, ${userQuery}, ${storedImageUrl}, ${answerText})
    RETURNING id, subject_id, user_id, question_text, image_url, answer_text, created_at
  `;

  const r = rows[0] as any;
  return {
    ...r,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  } as DoubtItem;
}

export async function deleteDoubt(doubtId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await sql`
    DELETE FROM doubts
    WHERE id = ${doubtId} AND user_id = ${userId}
  `;
}
