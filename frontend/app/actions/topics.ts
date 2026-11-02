"use server";

import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { Topic } from "@/types";

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Ensure subject belongs to user
  const subjectCheck = await sql`
    SELECT id FROM subjects WHERE id = ${subjectId} AND user_id = ${userId}
  `;
  if (subjectCheck.length === 0) {
    throw new Error("Subject not found or unauthorized");
  }

  const rows = await sql`
    SELECT id, subject_id, title, status, is_weak, created_at
    FROM topics
    WHERE subject_id = ${subjectId}
    ORDER BY created_at ASC
  `;

  return rows as unknown as Topic[];
}

export async function addTopics(subjectId: string, titles: string[]): Promise<Topic[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subjectCheck = await sql`
    SELECT id FROM subjects WHERE id = ${subjectId} AND user_id = ${userId}
  `;
  if (subjectCheck.length === 0) {
    throw new Error("Subject not found or unauthorized");
  }

  const insertedTopics: Topic[] = [];

  for (const title of titles) {
    const rows = await sql`
      INSERT INTO topics (subject_id, title, status, is_weak)
      VALUES (${subjectId}, ${title}, 'Not Started', false)
      RETURNING id, subject_id, title, status, is_weak, created_at
    `;
    insertedTopics.push(rows[0] as unknown as Topic);
  }

  return insertedTopics;
}

export async function updateTopicStatus(topicId: string, status: Topic["status"]): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await sql`
    UPDATE topics
    SET status = ${status}
    WHERE id = ${topicId}
      AND subject_id IN (SELECT id FROM subjects WHERE user_id = ${userId})
  `;
}

export async function toggleTopicWeak(topicId: string, isWeak: boolean): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await sql`
    UPDATE topics
    SET is_weak = ${isWeak}
    WHERE id = ${topicId}
      AND subject_id IN (SELECT id FROM subjects WHERE user_id = ${userId})
  `;
}

export async function deleteTopic(topicId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await sql`
    DELETE FROM topics
    WHERE id = ${topicId}
      AND subject_id IN (SELECT id FROM subjects WHERE user_id = ${userId})
  `;
}

