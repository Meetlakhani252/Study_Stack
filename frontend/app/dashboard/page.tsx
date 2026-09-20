"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Subject } from "@/types";
import { User } from "@supabase/supabase-js";
import CreateSubjectForm from "@/components/SyllabusTracker/CreateSubjectForm";
import SubjectCard from "@/components/SyllabusTracker/SubjectCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

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
      <div className="flex h-screen items-center justify-center bg-bg">
        <p className="text-lg font-medium text-main">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar
        userEmail={user?.email}
        onLogout={handleLogout}
        activeRoute="/dashboard"
      />

      <div className="flex-1 flex flex-col lg:ml-56 transition-all duration-300">
        <Header title="My Syllabus" />

        <main className="p-8 max-w-[1200px] w-full mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-main">My Syllabus</h2>
              <p className="text-sm text-muted">Track your progress across subjects</p>
            </div>
            <Button
              onClick={() => setIsCreatingSubject(true)}
              className="rounded-md"
            >
              + Add Subject
            </Button>
          </div>

          {subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-border bg-surface text-center max-w-2xl mx-auto">
              <div className="mb-4 p-4 rounded-full bg-selected text-primary">
                <BookOpen size={48} />
              </div>
              <h3 className="text-xl font-semibold text-main mb-2">Create your first subject</h3>
              <p className="text-muted mb-6 px-6">
                Add a subject and its topics to start tracking your progress.
              </p>
              <Button
                onClick={() => setIsCreatingSubject(true)}
                variant="default"
              >
                Add Subject
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onRefresh={fetchSubjects}
                />
              ))}
            </div>
          )}

          {isCreatingSubject && (
            <CreateSubjectForm
              onSubjectCreated={handleSubjectCreated}
              onClose={() => setIsCreatingSubject(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
