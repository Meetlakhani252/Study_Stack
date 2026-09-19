"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Subject } from "@/types";
import { User } from "@supabase/supabase-js";
import CreateSubjectForm from "@/components/SyllabusTracker/CreateSubjectForm";
import SubjectCard from "@/components/SyllabusTracker/SubjectCard";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      await fetchSubjects();
      setLoading(false);
    };

    initDashboard();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function fetchSubjects() {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubjects(data);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSubjectCreated = (newSubject: Subject) => {
    setSubjects(prev => [newSubject, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm border-b border-gray-100 dark:bg-slate-800/95 dark:border-slate-700">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
          <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-sm">S</div>
          <span>Study_Stack</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-400">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">My Syllabus</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your progress across subjects</p>
          </div>
          <button
            onClick={() => setIsCreatingSubject(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
          >
            + Add Subject
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {subjects.length === 0 ? (
            <div className="col-span-full rounded-xl border-2 border-dashed border-gray-200 p-12 text-center dark:border-slate-700">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-slate-800">📚</div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">No subjects added yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start by adding your first subject to begin tracking!</p>
            </div>
          ) : (
            subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onRefresh={fetchSubjects}
              />
            ))
          )}
        </div>

        {isCreatingSubject && (
          <CreateSubjectForm
            onSubjectCreated={handleSubjectCreated}
            onClose={() => setIsCreatingSubject(false)}
          />
        )}
      </main>
    </div>
  );
}
