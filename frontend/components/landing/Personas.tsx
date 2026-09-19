"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const PERSONAS = [
  {
    name: "Board & Competitive Exams",
    description: "For aspirants tackling massive syllabi like JEE, NEET, or UPSC who need strict topic-level tracking.",
    tags: ["High Volume", "Structured"],
  },
  {
    name: "College Students",
    description: "For those managing multiple semester courses and deadlines who want a clean bird's-eye view of their progress.",
    tags: ["Multi-Subject", "Deadlines"],
  },
  {
    name: "Self-Learners",
    description: "For the curious minds learning a new skill or language on their own terms with a self-curated syllabus.",
    tags: ["Customized", "Self-Paced"],
  },
  {
    name: "Professional Certifications",
    description: "For experts prepping for industry certifications who need to ensure every requirement is checked off.",
    tags: ["Rigorous", "Certification"],
  },
]

export function Personas({ className }: { className?: string }) {
  return (
    <section className={cn("py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">Designed for serious learners</h2>
          <p className="text-gray-600 text-lg">
            Whether you're facing a massive competitive exam or learning a hobby, Study_Stack adapts to your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PERSONAS.map((persona, i) => (
            <div key={i} className="p-8 rounded-xl border border-gray-200 bg-white flex flex-col gap-4 transition-all hover:shadow-md">
              <div className="flex flex-wrap gap-2">
                {persona.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{persona.name}</h3>
              <p className="text-gray-600 leading-relaxed">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
