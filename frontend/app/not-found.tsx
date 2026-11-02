import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 p-6 text-center">
      <div className="bg-blue-50 dark:bg-blue-950/60 p-4 rounded-2xl text-blue-600 mb-4">
        <BookOpen size={48} />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Page Not Found</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        The study page, subject, or resource you were looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

