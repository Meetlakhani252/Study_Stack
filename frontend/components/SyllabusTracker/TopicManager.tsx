"use client";

import { useState, useEffect } from "react";
import { Topic } from "@/types";
import {
  getTopicsBySubject,
  updateTopicStatus,
  toggleTopicWeak,
  deleteTopic,
} from "@/app/actions/topics";
import { cn } from "@/lib/utils";

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
    try {
      const data = await getTopicsBySubject(subjectId);
      setTopics(data);
    } catch (err: any) {
      console.error("Failed to fetch topics:", err);
    }
  }

  async function handleStatusChange(topicId: string, newStatus: Topic["status"]) {
    const previousTopics = [...topics];
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, status: newStatus } : t)));
    setError(null);

    try {
      await updateTopicStatus(topicId, newStatus);
      onTopicsUpdated();
    } catch (err: any) {
      setTopics(previousTopics);
      setError(`Failed to update status: ${err.message}`);
    }
  }

  async function handleToggleWeak(topicId: string, currentWeak: boolean) {
    const previousTopics = [...topics];
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, is_weak: !currentWeak } : t)));
    setError(null);

    try {
      await toggleTopicWeak(topicId, !currentWeak);
      onTopicsUpdated();
    } catch (err: any) {
      setTopics(previousTopics);
      setError(`Failed to update weakness flag: ${err.message}`);
    }
  }

  async function handleDelete(topicId: string) {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    const previousTopics = [...topics];
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    setError(null);

    try {
      await deleteTopic(topicId);
      onTopicsUpdated();
    } catch (err: any) {
      setTopics(previousTopics);
      setError(`Failed to delete topic: ${err.message}`);
    }
  }

  const getStatusStyles = (status: Topic["status"]) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Not Started":
      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 border-gray-200 dark:border-slate-600";
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {topics.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-500 dark:text-gray-400">
          No topics added yet. Click &quot;+ Add Topics&quot; to start.
        </p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between rounded-md border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm"
            >
              <div className="flex-1 min-w-0 pr-4 flex items-center gap-2">
                <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                  {topic.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleWeak(topic.id, topic.is_weak)}
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer",
                    topic.is_weak
                      ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-300"
                      : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400"
                  )}
                  title="Toggle weak topic flag"
                >
                  {topic.is_weak ? "Weak" : "Strong"}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={topic.status}
                  onChange={(e) => handleStatusChange(topic.id, e.target.value as Topic["status"])}
                  className={cn(
                    "rounded border px-2 py-1 text-xs font-semibold outline-none cursor-pointer",
                    getStatusStyles(topic.status)
                  )}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDelete(topic.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
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
  );
}
