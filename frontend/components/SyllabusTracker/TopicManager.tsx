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

  useEffect(() => {
    fetchTopics();
  }, [subjectId]);

  async function fetchTopics() {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTopics(data);
    }
  }

  async function updateTopicStatus(topicId: string, newStatus: Topic["status"]) {
    // Optimistic Update
    const previousTopics = [...topics];
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: newStatus } : t));

    const { error } = await supabase
      .from("topics")
      .update({ status: newStatus })
      .eq("id", topicId);

    if (error) {
      setTopics(previousTopics);
    } else {
      onTopicsUpdated();
    }
  }

  return (
    <div className="mt-4 space-y-6 border-t pt-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">Topic List</h3>
        {topics.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No topics added yet.</p>
        ) : (
          <div className="space-y-2">
            {topics.map(topic => (
              <div key={topic.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2 text-sm">
                <span className="truncate pr-2 text-black">{topic.title}</span>
                <select
                  value={topic.status}
                  onChange={(e) => updateTopicStatus(topic.id, e.target.value as Topic["status"])}
                  className="rounded border border-gray-300 bg-white p-1 text-xs text-black"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
