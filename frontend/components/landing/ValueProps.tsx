"use client"

import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const VALUE_PROPS = [
  {
    title: "Stay Organized",
    description: "Centralize all your subjects and syllabi in one place. No more scattered notes or lost lists.",
    icon: <CheckCircle2 className="size-5 text-blue-600" />,
  },
  {
    title: "Track Real Progress",
    description: "Move beyond 'reading the book'. Track exactly which topics are completed, in progress, or not started.",
    icon: <CheckCircle2 className="size-5 text-blue-600" />,
  },
  {
    title: "Never Miss a Deadline",
    description: "Set exam dates for every subject and watch the countdown. Prioritize your study sessions based on urgency.",
    icon: <CheckCircle2 className="size-5 text-blue-600" />,
  },
  {
    title: "Built for Focus",
    description: "A distraction-free interface designed to let you focus on what matters: the material.",
    icon: <CheckCircle2 className="size-5 text-blue-600" />,
  },
]

export function ValueProps({ className }: { className?: string }) {
  return (
    <section id="how-it-works" className={cn("py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">Why Study_Stack?</h2>
          <p className="text-gray-600 text-lg">
            We've stripped away the fluff to give you a tool that actually helps you study smarter, not longer.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPS.map((prop, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md group">
              <div className="p-2 w-fit rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                {prop.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{prop.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
