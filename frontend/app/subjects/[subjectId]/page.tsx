"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSubjectById } from "@/app/actions/subjects";
import { Subject } from "@/types";
import Link from "next/link";

export default function SubjectPage() {
  const params = useParams<{ subjectId: string }>();
  const subjectId = params.subjectId;
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSubject() {
      if (!subjectId) return;
      try {
        const data = await getSubjectById(subjectId);
        setSubject(data);
      } catch (err) {
        console.error("Failed to fetch subject:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubject();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading subject...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-red-600">Subject not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Dashboard
          </button>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Exam Date: {subject.exam_date || "Not set"}
            </p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{subject.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your study materials, doubts, and past papers
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Doubts Card */}
          <Link
            href={`/subjects/${subject.id}/doubts`}
            className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                💬
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                Open &rarr;
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Doubt Solver</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Ask questions with text or photos to get step-by-step explanations.
            </p>
          </Link>

          {/* Past Papers Card */}
          <Link
            href={`/subjects/${subject.id}/papers`}
            className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                📄
              </span>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                Open &rarr;
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Papers</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload and analyze past question papers to find high-frequency exam topics.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
