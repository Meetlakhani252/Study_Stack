"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Subject, Topic } from "@/types";
import TopicManager from "./TopicManager";
import AddTopicsModal from "./AddTopicsModal";

interface SubjectCardProps {
  subject: Subject;
  onRefresh: () => void;
}

export default function SubjectCard({ subject, onRefresh }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingTopics, setIsAddingTopics] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [subject.id]);

  async function fetchTopics() {
    setLoading(true);
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("subject_id", subject.id);

    if (!error && data) {
      setTopics(data);
    }
    setLoading(false);
  }

  const calculateProgress = () => {
    if (topics.length === 0) return 0;
    const doneCount = topics.filter(t => t.status === "Done").length;
    return Math.round((doneCount / topics.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div
        className="cursor-pointer p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{subject.name}</h3>
            {subject.exam_date && (
              <p className="text-xs text-gray-500">Exam: {subject.exam_date}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
              {progress}%
            </span>
            <span className="text-gray-400">{isExpanded ? "▲" : "▼"}</span>
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t bg-gray-50 p-4">
          <div className="mb-4 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingTopics(true);
              }}
              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
            >
              + Add Topics
            </button>
          </div>
          <TopicManager subjectId={subject.id} onTopicsUpdated={() => {
            fetchTopics();
            onRefresh();
          }} />
        </div>
      )}

      {isAddingTopics && (
        <AddTopicsModal
          subjectId={subject.id}
          subjectName={subject.name}
          onTopicsAdded={() => {
            fetchTopics();
            onRefresh();
          }}
          onClose={() => setIsAddingTopics(false)}
        />
      )}
    </div>
  );
}
