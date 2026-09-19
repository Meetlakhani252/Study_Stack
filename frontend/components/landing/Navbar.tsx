"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export function Navbar({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Demo", href: "#demo" },
  ]

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      scrolled ? "border-b bg-white/95 backdrop-blur-md py-2" : "bg-transparent py-4",
      className
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
            <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-sm">S</div>
            <span>Study_Stack</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up Free</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "absolute top-full left-0 w-full bg-white border-b transition-all duration-300 ease-in-out md:hidden",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="flex flex-col p-4 gap-4">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-base font-medium text-gray-600 hover:text-blue-600 py-2 border-b border-gray-50"
            >
              {link.name}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/login" className="w-full">
              <Button variant="outline" size="sm" className="w-full border-gray-200">Login</Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
