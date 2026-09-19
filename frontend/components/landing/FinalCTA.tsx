"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTA({ className }: { className?: string }) {
  return (
    <section className={cn("py-24", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 lg:p-16 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Start tracking your progress today
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Join a community of students who are mastering their syllabi and crushing their goals.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base gap-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all">
                Create Your Free Account <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-50 blur-3xl rounded-full" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  )
}
