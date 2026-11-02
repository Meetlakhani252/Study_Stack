"use client";

import { useState, useEffect } from "react";
import { Subject, Topic } from "@/types";
import { getTopicsBySubject } from "@/app/actions/topics";
import TopicManager from "./TopicManager";
import AddTopicsModal from "./AddTopicsModal";
import Link from "next/link";

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
    try {
      const data = await getTopicsBySubject(subject.id);
      setTopics(data);
    } catch (err) {
      console.error("Failed to load topics:", err);
    } finally {
      setLoading(false);
    }
  }

  const calculateProgress = () => {
    if (topics.length === 0) return { percentage: 0, count: "0 of 0" };
    const doneCount = topics.filter((t) => t.status === "Done").length;
    const percentage = Math.round((doneCount / topics.length) * 100);
    return {
      percentage,
      count: `${doneCount} of ${topics.length} topics completed`,
    };
  };

  const { percentage, count } = calculateProgress();

  return (
    <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md">
      <div
        className="cursor-pointer p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{subject.name}</h3>
            {subject.exam_date && (
              <p className="text-xs text-gray-500 dark:text-gray-400">Exam: {subject.exam_date}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
              {percentage}%
            </span>
            <span className="text-gray-400">{isExpanded ? "▲" : "▼"}</span>
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right font-medium">{count}</p>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-slate-700 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href={`/subjects/${subject.id}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Go to Subject Hub &rarr;
            </Link>
            <button
              onClick={() => setIsAddingTopics(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Topics
            </button>
          </div>

          <TopicManager
            subjectId={subject.id}
            onTopicsUpdated={() => {
              fetchTopics();
              onRefresh();
            }}
          />
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
