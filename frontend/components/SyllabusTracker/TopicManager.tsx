"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Topic } from "@/types";

interface TopicManagerProps {
  subjectId: string;
  onTopicsUpdated: () => void;
}

export default function TopicManager({ subjectId, onTopicsUpdated }: TopicManagerProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, [subjectId]);

  async function fetchTopics() {
    const { data, error: fetchError } = await supabase
      .from("topics")
      .select("*")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: true });

    if (!fetchError && data) {
      setTopics(data);
    }
  }

  async function updateTopicStatus(topicId: string, newStatus: Topic["status"]) {
    const previousTopics = [...topics];

    // Optimistic Update
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: newStatus } : t));
    setError(null);

    const { error: updateError } = await supabase
      .from("topics")
      .update({ status: newStatus })
      .eq("id", topicId);

    if (updateError) {
      setTopics(previousTopics);
      setError(`Failed to update status: ${updateError.message}`);
    } else {
      onTopicsUpdated();
    }
  }

  async function deleteTopic(topicId: string) {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    const previousTopics = [...topics];
    setTopics(prev => prev.filter(t => t.id !== topicId));
    setError(null);

    const { error: deleteError } = await supabase
      .from("topics")
      .delete()
      .eq("id", topicId);

    if (deleteError) {
      setTopics(previousTopics);
      setError(`Failed to delete topic: ${deleteError.message}`);
    } else {
      onTopicsUpdated();
    }
  }

  const getStatusStyles = (status: Topic["status"]) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Not Started":
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      {error && (
        <div className="rounded-md bg-red-50 p-2 text-xs text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">Topic List</h3>
        {topics.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No topics added yet.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {topics.map(topic => (
              <div
                key={topic.id}
                className="flex items-center justify-between rounded-md border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {topic.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={topic.status}
                    onChange={(e) => updateTopicStatus(topic.id, e.target.value as Topic["status"])}
                    className={`rounded-full border px-2 py-1 text-xs font-medium outline-none transition-colors ${getStatusStyles(topic.status)}`}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>

                  <button
                    onClick={() => deleteTopic(topic.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete topic"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
