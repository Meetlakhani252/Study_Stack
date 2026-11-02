"use client";

import { useState } from "react";
import { addTopics } from "@/app/actions/topics";

interface AddTopicsModalProps {
  subjectId: string;
  subjectName: string;
  onTopicsAdded: () => void;
  onClose: () => void;
}

export default function AddTopicsModal({ subjectId, subjectName, onTopicsAdded, onClose }: AddTopicsModalProps) {
  const [topicsText, setTopicsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!topicsText.trim()) {
      setError("Please enter at least one topic.");
      return;
    }

    setLoading(true);
    try {
      const topicNames = topicsText
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      if (topicNames.length === 0) {
        throw new Error("No valid topics found to add.");
      }

      await addTopics(subjectId, topicNames);

      onTopicsAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add topics to this subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white dark:bg-slate-800 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-2 text-center text-xl font-semibold text-gray-900 dark:text-white">Add Topics</h2>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Adding to <span className="font-semibold text-gray-700 dark:text-gray-200">{subjectName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Topics (one per line)
            </label>
            <textarea
              rows={5}
              required
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-transparent p-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder={`Introduction to Calculus\nLimits and Continuity\nDerivatives`}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm"
          >
            {loading ? "Adding..." : "Add Topics"}
          </button>
        </form>
      </div>
    </div>
  );
}
