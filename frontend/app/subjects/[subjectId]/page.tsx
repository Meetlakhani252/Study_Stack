"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  exam_date: string | null;
}

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSubject() {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", params.subjectId)
        .single();

      if (!error && data) {
        setSubject(data);
      }
      setLoading(false);
    }
    fetchSubject();
  }, [params.subjectId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading subject...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex h-screen items-center justify-center">
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Exam Date: {subject.exam_date || "Not set"}</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{subject.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your study materials, doubts, and past papers</p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ActionCard
            title="Study Syllabus"
            description="Track topics and mark completion"
            icon="📚"
            href={`/subjects/${params.subjectId}/topics`}
            color="blue"
          />
          <ActionCard
            title="Ask Doubts"
            description="Clear your concepts with experts"
            icon="❓"
            href={`/subjects/${params.subjectId}/doubts`}
            color="purple"
          />
          <ActionCard
            title="Past Papers"
            description="Practice with previous year exams"
            icon="📄"
            href={`/subjects/${params.subjectId}/papers`}
            color="green"
          />
        </div>

        {/* Recent Activity Placeholder */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No recent activity for this subject yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Start studying to see your progress here!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, href, color }: { title: string; description: string; icon: string; href: string; color: string }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-800",
  };

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
    >
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Link>
  );
}
