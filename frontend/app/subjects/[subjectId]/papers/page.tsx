"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Paper {
  id: string;
  year: string;
  type: string;
  url: string;
}

export default function PapersPage({ params }: { params: { subjectId: string } }) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for client demo
    const mockPapers = [
      { id: "1", year: "2024", type: "Final Exam", url: "#" },
      { id: "2", year: "2023", type: "Mid-Term", url: "#" },
      { id: "3", year: "2023", type: "Final Exam", url: "#" },
      { id: "4", year: "2022", type: "Final Exam", url: "#" },
    ];
    setPapers(mockPapers);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading papers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/subjects/${params.subjectId}`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Subject
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Past Papers</h1>
          <div className="flex gap-2">
            <select className="rounded-md border border-gray-300 bg-white p-1 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <option>All Years</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {papers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-slate-700">
              <p className="text-lg font-medium text-gray-900 dark:text-white">No papers available</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check back later for updates.</p>
            </div>
          ) : (
            papers.map(paper => (
              <div key={paper.id} className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    📄
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{paper.year} {paper.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF Format &bull; 1.2 MB</p>
                  </div>
                </div>
                <a
                  href={paper.url}
                  className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-blue-600 hover:text-white transition-colors dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-blue-600 dark:hover:text-white"
                >
                  View
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
