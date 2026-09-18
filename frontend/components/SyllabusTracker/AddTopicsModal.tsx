"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
        .map(t => t.trim())
        .filter(t => t !== "");

      if (topicNames.length === 0) {
        throw new Error("No valid topics found to add.");
      }

      const topicsToInsert = topicNames.map(name => ({
        subject_id: subjectId,
        title: name,
        status: "Not Started"
      }));

      const { error: insertError } = await supabase.from("topics").insert(topicsToInsert);

      if (insertError) throw insertError;

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
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">Add Topics</h2>
        <p className="mb-6 text-center text-sm text-gray-500">Adding topics to {subjectName}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Topic List</label>
            <textarea
              required
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              rows={6}
              placeholder="Enter one topic per line, e.g.&#10;Chapter 1: Introduction&#10;Chapter 2: Data Structures"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Saving..." : "Save Topics"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
