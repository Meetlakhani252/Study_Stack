"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Subject } from "@/types";

interface CreateSubjectFormProps {
  onSubjectCreated: (subject: Subject) => void;
  onClose: () => void;
}

export default function CreateSubjectForm({ onSubjectCreated, onClose }: CreateSubjectFormProps) {
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error: insertError } = await supabase
        .from("subjects")
        .insert({
          name,
          exam_date: examDate || null,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) onSubjectCreated(data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create subject");
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

        <h2 className="mb-8 text-center text-xl font-semibold text-gray-900">Create New Subject</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Subject Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g. Mathematics"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Exam Date (Optional)</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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
              {loading ? "Saving..." : "Save Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
