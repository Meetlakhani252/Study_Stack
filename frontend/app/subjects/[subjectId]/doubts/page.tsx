"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  getDoubtsBySubject,
  createAndSolveDoubt,
  getUserDailyDoubtUsage,
  deleteDoubt,
  DoubtItem,
} from "@/app/actions/doubts";
import Link from "next/link";
import {
  Sparkles,
  Image as ImageIcon,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function DoubtsPage() {
  const params = useParams<{ subjectId: string }>();
  const subjectId = params.subjectId;

  const [doubts, setDoubts] = useState<DoubtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoubt, setNewDoubt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Daily quota state
  const [quota, setQuota] = useState<{ used: number; limit: number }>({ used: 0, limit: 20 });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      if (!subjectId) return;
      try {
        const [doubtsData, quotaData] = await Promise.all([
          getDoubtsBySubject(subjectId),
          getUserDailyDoubtUsage(),
        ]);
        setDoubts(doubtsData);
        setQuota(quotaData);
      } catch (err: any) {
        console.error("Failed to load doubts:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [subjectId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      setSelectedImage({
        file,
        preview: result,
        base64: base64Data,
        mimeType: file.type,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitDoubt = async () => {
    if (!newDoubt.trim() && !selectedImage) {
      setError("Please enter a question or attach an image.");
      return;
    }
    if (!subjectId) return;

    setSubmitting(true);
    setError(null);

    try {
      const created = await createAndSolveDoubt({
        subjectId,
        questionText: newDoubt.trim(),
        imageBase64: selectedImage?.base64,
        mimeType: selectedImage?.mimeType,
      });

      setDoubts((prev) => [created, ...prev]);
      setQuota((prev) => ({ ...prev, used: prev.used + 1 }));
      setNewDoubt("");
      setSelectedImage(null);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to solve doubt. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoubt = async (doubtId: string) => {
    if (!confirm("Are you sure you want to delete this doubt?")) return;
    try {
      await deleteDoubt(doubtId);
      setDoubts((prev) => prev.filter((d) => d.id !== doubtId));
    } catch (err: any) {
      console.error("Failed to delete doubt:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 className="animate-spin text-blue-600 size-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/subjects/${subjectId}`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Subject
          </Link>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                quota.used >= quota.limit
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              }`}
            >
              ⚡ AI Quota: {quota.used}/{quota.limit} today
            </span>

            <button
              onClick={() => {
                setError(null);
                setIsModalOpen(true);
              }}
              disabled={quota.used >= quota.limit}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              <Sparkles size={16} />
              Ask AI Doubt
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            AI Doubt Solver
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Submit questions via text or upload photos of handwritten notes for step-by-step AI answers.
          </p>
        </div>

        {/* Doubts List */}
        <div className="space-y-5">
          {doubts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-800 p-16 text-center bg-white dark:bg-slate-800/50">
              <div className="mb-4 rounded-full bg-blue-50 dark:bg-blue-950/60 p-4 text-blue-600">
                <HelpCircle size={36} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No doubts asked yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Stuck on a concept or homework problem? Click &quot;Ask AI Doubt&quot; to get an instant explanation.
              </p>
            </div>
          ) : (
            doubts.map((doubt) => (
              <div
                key={doubt.id}
                className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Question Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 size={13} />
                        Resolved by AI
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(doubt.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {doubt.question_text}
                    </p>

                    {/* Image Attachment Preview */}
                    {doubt.image_url && (
                      <div className="mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={doubt.image_url}
                          alt="Doubt attachment"
                          className="max-h-48 rounded-lg border border-gray-200 dark:border-slate-700 object-contain bg-gray-50 dark:bg-slate-900"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteDoubt(doubt.id)}
                    title="Delete doubt"
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-md transition hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* AI Explanation Box */}
                {doubt.answer_text ? (
                  <div className="mt-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 p-5 border border-blue-100 dark:border-blue-900/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">
                      <Sparkles size={14} />
                      Step-by-Step AI Solution
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed font-normal">
                      {doubt.answer_text}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Solution processing...
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ask Doubt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => !submitting && setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-blue-600 p-2 text-white">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ask AI Tutor</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Powered by Gemini 3.8 Flash · Instant step-by-step resolution
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Question or Concept
                </label>
                <textarea
                  value={newDoubt}
                  onChange={(e) => setNewDoubt(e.target.value)}
                  placeholder="Explain Bayes theorem, solve dy/dx = x^2, or describe what's in your photo..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Attach Photo (Optional — Handwritten / Textbook Question)
                </label>

                {selectedImage ? (
                  <div className="relative inline-block mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImage.preview}
                      alt="Selected preview"
                      className="h-28 rounded-lg border border-gray-200 dark:border-slate-700 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700 transition"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-900/50 transition text-gray-500 dark:text-gray-400"
                  >
                    <ImageIcon size={20} className="text-blue-600" />
                    <span className="text-xs font-medium">Click to upload question image (PNG, JPG)</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-xs text-red-600 dark:text-red-300">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitDoubt}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      AI Solving...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Solve with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
