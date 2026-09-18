"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Subject } from "@/types";
import CreateSubjectForm from "@/components/SyllabusTracker/CreateSubjectForm";
import SubjectCard from "@/components/SyllabusTracker/SubjectCard";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">StudyStack</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Syllabus</h2>
            <p className="text-sm text-gray-600">Track your progress across subjects</p>
          </div>
          <button
            onClick={() => setIsCreatingSubject(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Subject
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {subjects.length === 0 ? (
            <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500">No subjects added yet. Start by adding your first subject!</p>
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
