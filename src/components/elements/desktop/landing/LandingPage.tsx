"use client"

import { useEffect } from "react"
import { toast } from "react-hot-toast"
import Header from "./Header"
import { HeroSection } from "./sections/HeroSection"
import { AboutSection } from "./sections/AboutSection"
import Footer from "./Footer"

interface LandingPageProps {
  count: number
  success: boolean
}

export default function LandingPage({ count, success }: LandingPageProps) {
  useEffect(() => {
    if (!success) {
      toast.error("Something went wrong")
    }
  }, [success])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <AboutSection />
      <Footer count={count} />
    </div>
  )
}
