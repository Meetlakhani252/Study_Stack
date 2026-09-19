"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-gray-200 py-12 bg-white", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
              <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-sm">S</div>
              <span>Study_Stack</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              The modern standard for study progress tracking. Built for students, by students.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Product</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
              <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors">Demo</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Company</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <Link href="https://github.com" className="text-gray-600 hover:text-blue-600 transition-colors">GitHub</Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Legal</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Study_Stack. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-900 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
