"use client";

import { useState, useEffect } from "react";
import { Subject, Topic } from "@/types";
import { getTopicsBySubject } from "@/app/actions/topics";
import { deleteSubject, updateSubject } from "@/app/actions/subjects";
import TopicManager from "./TopicManager";
import AddTopicsModal from "./AddTopicsModal";
import Link from "next/link";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
  onRefresh: () => void;
}

function getCountdown(examDate: string | null): { label: string; urgent: boolean } | null {
  if (!examDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  const diff = Math.round((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Exam passed", urgent: false };
  if (diff === 0) return { label: "Exam today!", urgent: true };
  if (diff === 1) return { label: "1 day left", urgent: true };
  return { label: `${diff} days left`, urgent: diff <= 7 };
}

export default function SubjectCard({ subject, onRefresh }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingTopics, setIsAddingTopics] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [editName, setEditName] = useState(subject.name);
  const [editDate, setEditDate] = useState(subject.exam_date ?? "");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, [subject.id]);

  async function fetchTopics() {
    try {
      const data = await getTopicsBySubject(subject.id);
      setTopics(data);
    } catch (err) {
      console.error("Failed to load topics:", err);
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
  const countdown = getCountdown(subject.exam_date);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete "${subject.name}"? All topics will be removed.`)) return;
    setDeleteLoading(true);
    try {
      await deleteSubject(subject.id);
      onRefresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(false);
    }
  }

  function openEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditName(subject.name);
    setEditDate(subject.exam_date ?? "");
    setIsEditing(true);
  }

  async function handleSaveEdit(e: React.MouseEvent) {
    e.stopPropagation();
    if (!editName.trim()) return;
    setEditLoading(true);
    try {
      await updateSubject(subject.id, {
        name: editName.trim(),
        examDate: editDate || undefined,
      });
      onRefresh();
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setEditLoading(false);
    }
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setIsEditing(false);
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md">
      <div
        className="cursor-pointer p-4 select-none"
        onClick={() => !isEditing && setIsExpanded(!isExpanded)}
      >
        {isEditing ? (
          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-transparent px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
              placeholder="Subject name"
            />
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-transparent px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading || !editName.trim()}
                className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Check size={13} /> {editLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {subject.name}
                </h3>

                {subject.exam_date && (
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Exam: {subject.exam_date}
                    </p>
                    {countdown && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          countdown.urgent
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        }`}
                      >
                        {countdown.label}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {percentage}%
                </span>
                <button
                  onClick={openEdit}
                  title="Edit subject"
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  title="Delete subject"
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
                <span className="text-gray-400 text-sm">{isExpanded ? "▲" : "▼"}</span>
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right font-medium">
              {count}
            </p>
          </>
        )}
      </div>

      {isExpanded && !isEditing && (
        <div className="border-t border-gray-100 dark:border-slate-700 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href={`/subjects/${subject.id}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Go to Subject Hub &rarr;
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); setIsAddingTopics(true); }}
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
