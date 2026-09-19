import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { ValueProps } from "@/components/landing/ValueProps"
import { Features } from "@/components/landing/Features"
import { Personas } from "@/components/landing/Personas"
import { LiveDemo } from "@/components/landing/LiveDemo"
import { SocialProof } from "@/components/landing/SocialProof"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100">
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <Features />
        <Personas />
        <LiveDemo />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
