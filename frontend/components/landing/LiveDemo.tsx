"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export function LiveDemo({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <section id="demo" className={cn("py-24", className)}>
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 text-white p-8 lg:p-16 text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Try it before you sign up
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Experience the flow of Study_Stack with sample data. No account, no emails, just a quick look at how it works.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base gap-2 font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-all"
              onClick={() => router.push('/demo')}
            >
              Launch Guest Demo <ExternalLink className="size-4" />
            </Button>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  )
}
