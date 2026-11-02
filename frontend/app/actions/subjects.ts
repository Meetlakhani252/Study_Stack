"use server";

import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { Subject } from "@/types";

export async function getSubjects(): Promise<Subject[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const rows = await sql`
    SELECT id, user_id, name, exam_date, created_at
    FROM subjects
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows.map((r: any) => ({
    ...r,
    exam_date: r.exam_date ? (r.exam_date instanceof Date ? r.exam_date.toISOString().split("T")[0] : String(r.exam_date)) : null,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  })) as Subject[];
}

export async function getSubjectById(subjectId: string): Promise<Subject | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const rows = await sql`
    SELECT id, user_id, name, exam_date, created_at
    FROM subjects
    WHERE id = ${subjectId} AND user_id = ${userId}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  const r = rows[0] as any;
  return {
    ...r,
    exam_date: r.exam_date ? (r.exam_date instanceof Date ? r.exam_date.toISOString().split("T")[0] : String(r.exam_date)) : null,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  } as Subject;
}

export async function createSubject(data: { name: string; examDate?: string }): Promise<Subject> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const examDateVal = data.examDate ? data.examDate : null;

  const rows = await sql`
    INSERT INTO subjects (user_id, name, exam_date)
    VALUES (${userId}, ${data.name}, ${examDateVal})
    RETURNING id, user_id, name, exam_date, created_at
  `;

  const r = rows[0] as any;
  return {
    ...r,
    exam_date: r.exam_date ? (r.exam_date instanceof Date ? r.exam_date.toISOString().split("T")[0] : String(r.exam_date)) : null,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  } as Subject;
}

export async function deleteSubject(subjectId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await sql`
    DELETE FROM subjects
    WHERE id = ${subjectId} AND user_id = ${userId}
  `;
}

