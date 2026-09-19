"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Hero({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <section className={cn("relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white", className)}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Now in Public Beta
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
            Master your syllabus, <br />
            <span className="text-blue-600">one topic at a time.</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            Stop guessing your progress. Organize subjects, track topic-level completion,
            and stay on top of exam dates with a structured system built for serious learners.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all">
                Get Started Free <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              onClick={() => router.push('/demo')}
            >
              <PlayCircle className="size-4" /> Try Demo
            </Button>
          </div>
        </div>

        <div className="mt-16 relative max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500">
          <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
            <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden aspect-[16/10] flex items-center justify-center text-gray-400">
               <div className="flex flex-col items-center gap-4 text-center p-8">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-24 rounded-lg bg-white border border-gray-200 shadow-sm animate-pulse" />
                    ))}
                  </div>
                  <p className="text-sm font-medium italic">Product Dashboard Preview</p>
               </div>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-100/50 blur-[120px] rounded-full" />
        </div>
      </div>
    </section>
  )
}
