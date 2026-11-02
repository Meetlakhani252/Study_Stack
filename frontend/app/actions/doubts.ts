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

export async function createDoubt(subjectId: string, question: string): Promise<DoubtItem> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const rows = await sql`
    INSERT INTO doubts (subject_id, user_id, question_text)
    VALUES (${subjectId}, ${userId}, ${question})
    RETURNING id, subject_id, user_id, question_text, image_url, answer_text, created_at
  `;

  const r = rows[0] as any;
  return {
    ...r,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  } as DoubtItem;
}

