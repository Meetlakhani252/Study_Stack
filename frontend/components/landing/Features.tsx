"use client"

import { LayoutDashboard, ListChecks, CalendarDays, CloudSync, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FEATURES = [
  {
    title: "Subject & Topic Management",
    description: "Break down complex subjects into manageable topics. Organize your syllabus exactly how you learn it.",
    icon: <LayoutDashboard className="size-6 text-blue-600" />,
  },
  {
    title: "Granular Status Tracking",
    description: "Mark topics as Not Started, In Progress, or Completed. Get a clear visual of where you stand.",
    icon: <ListChecks className="size-6 text-blue-600" />,
  },
  {
    title: "Exam Date Countdown",
    description: "Set your target dates and let Study_Stack keep the pressure on. Know exactly how many days are left.",
    icon: <CalendarDays className="size-6 text-blue-600" />,
  },
  {
    title: "Secure Cloud Sync",
    description: "Your data is backed by Supabase. Access your progress from any device, anywhere, securely.",
    icon: <CloudSync className="size-6 text-blue-600" />,
  },
  {
    title: "Clean Dashboard View",
    description: "A minimalist interface that shows you everything you need to know at a glance. No clutter, just progress.",
    icon: <ShieldCheck className="size-6 text-blue-600" />,
  },
]

export function Features({ className }: { className?: string }) {
  return (
    <section id="features" className={cn("py-24 bg-white", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">Everything you need to stay on track</h2>
          <p className="text-gray-600 text-lg">
            A comprehensive set of tools designed to remove the cognitive load of organizing, so you can focus on learning.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <Card key={i} className="group border-gray-200 hover:border-blue-300 transition-all bg-white">
              <CardHeader>
                <div className="mb-4 p-3 w-fit rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <CardTitle className="text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
