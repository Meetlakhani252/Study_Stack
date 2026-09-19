"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function DoubtsPage({ params }: { params: { subjectId: string } }) {
  const [doubts, setDoubts] = useState<{ id: string; question: string; status: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoubt, setNewDoubt] = useState("");

  useEffect(() => {
    async function fetchDoubts() {
      const { data, error } = await supabase
        .from("doubts")
        .select("*")
        .eq("subject_id", params.subjectId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDoubts(data);
      }
      setLoading(false);
    }
    fetchDoubts();
  }, [params.subjectId]);

  const handleSubmitDoubt = async () => {
    if (!newDoubt.trim()) return;

    const { error } = await supabase
      .from("doubts")
      .insert({
        subject_id: params.subjectId,
        question: newDoubt,
        status: "Open",
      });

    if (!error) {
      setNewDoubt("");
      setIsModalOpen(false);
      // Refresh list
      const { data } = await supabase
        .from("doubts")
        .select("*")
        .eq("subject_id", params.subjectId)
        .order("created_at", { ascending: false });
      if (data) setDoubts(data);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading doubts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/subjects/${params.subjectId}`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Subject
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            + New Doubt
          </button>
        </div>

        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subject Doubts</h1>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {doubts.length} Total
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search your doubts..."
            className="w-full rounded-xl border border-gray-300 bg-white p-3 pl-10 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>

        <div className="grid gap-4">
          {doubts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-slate-700">
              <p className="text-lg font-medium text-gray-900 dark:text-white">No doubts yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Everything is clear! If not, ask a new doubt.</p>
            </div>
          ) : (
            doubts.map(doubt => (
              <div key={doubt.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-gray-900 dark:text-white">{doubt.question}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${doubt.status === "Resolved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"}`}>
                    {doubt.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {new Date(doubt.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* New Doubt Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Submit New Doubt</h3>
              <textarea
                className="w-full rounded-md border border-gray-300 p-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                rows={4}
                placeholder="What is your doubt?"
                value={newDoubt}
                onChange={(e) => setNewDoubt(e.target.value)}
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitDoubt}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
