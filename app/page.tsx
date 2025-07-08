import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { InputSection } from "@/components/input-section"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <InputSection />
        <FeaturesSection />
      </div>
    </div>
  )
}
