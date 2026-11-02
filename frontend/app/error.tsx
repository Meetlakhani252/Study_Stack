"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 p-6 text-center">
      <div className="bg-red-50 dark:bg-red-950/60 p-4 rounded-2xl text-red-600 mb-4">
        <AlertTriangle size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
        An unexpected error occurred while loading this page. Please try refreshing or retrying.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
        >
          Try Again
        </button>
        <a
          href="/dashboard"
          className="rounded-lg border border-gray-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

