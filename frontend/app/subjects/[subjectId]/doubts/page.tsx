"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDoubtsBySubject, createDoubt, DoubtItem } from "@/app/actions/doubts";
import Link from "next/link";

export default function DoubtsPage() {
  const params = useParams<{ subjectId: string }>();
  const subjectId = params.subjectId;
  const [doubts, setDoubts] = useState<DoubtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoubt, setNewDoubt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDoubts() {
      if (!subjectId) return;
      try {
        const data = await getDoubtsBySubject(subjectId);
        setDoubts(data);
      } catch (err) {
        console.error("Failed to load doubts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoubts();
  }, [subjectId]);

  const handleSubmitDoubt = async () => {
    if (!newDoubt.trim() || !subjectId) return;

    setSubmitting(true);
    try {
      const created = await createDoubt(subjectId, newDoubt);
      setDoubts((prev) => [created, ...prev]);
      setNewDoubt("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to post doubt:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading doubts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/subjects/${subjectId}`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Subject
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            + Ask a Doubt
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doubts & Questions</h1>

        {/* Doubts List */}
        <div className="space-y-4">
          {doubts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-800 p-12 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">No doubts yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Have a question? Click &quot;Ask a Doubt&quot; to submit one.
              </p>
            </div>
          ) : (
            doubts.map((doubt) => (
              <div
                key={doubt.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-white">{doubt.question_text}</p>
                    {doubt.answer_text ? (
                      <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 p-4 text-sm text-gray-800 dark:text-gray-200 border border-blue-100 dark:border-blue-900">
                        <span className="font-bold text-blue-600 dark:text-blue-400">AI Explanation: </span>
                        {doubt.answer_text}
                      </div>
                    ) : (
                      <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Pending Solution
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(doubt.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ask a Doubt</h2>
            <textarea
              value={newDoubt}
              onChange={(e) => setNewDoubt(e.target.value)}
              placeholder="Type your question or concept you are stuck on..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitDoubt}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
