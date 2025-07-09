import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import InputSection from "@/components/input-section"
import Navbar from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <InputSection />
    </div>
  )
}
