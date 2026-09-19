"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

const TESTIMONIALS = [
  {
    quote: "Study_Stack completely changed how I approach my finals. Seeing the topics check off one by one is incredibly satisfying.",
    author: "Sarah J.",
    role: "Medical Student",
  },
  {
    quote: "The cleanest progress tracker I've used. It doesn't get in the way; it just helps me stay organized.",
    author: "Marcus K.",
    role: "CS Undergraduate",
  },
  {
    quote: "Finally, a tool that understands that study progress isn't just a percentage, but a list of mastered concepts.",
    author: "Elena R.",
    role: "Self-Learner",
  },
]

export function SocialProof({ className }: { className?: string }) {
  return (
    <section className={cn("py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">Built for serious learners</h2>
          <p className="text-gray-600">Join students who are taking control of their academic journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="p-8 relative group transition-all border-gray-200 bg-white hover:border-blue-200 hover:shadow-md">
              <div className="text-blue-600 text-6xl font-serif absolute top-4 left-4 opacity-10 select-none">“</div>
              <p className="relative z-10 text-lg leading-relaxed mb-6 italic text-gray-700">
                {t.quote}
              </p>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{t.author}</span>
                <span className="text-sm text-gray-500">{t.role}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
