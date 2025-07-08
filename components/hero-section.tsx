import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="px-8 py-20 text-center max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-white/80">AI-Powered Mind Mapping</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          transform messy notes into{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            structured mind maps
          </span>
        </h1>

        <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
          Turn chaotic thoughts and unstructured ideas into beautiful, interactive mind maps and project plans. Our AI
          instantly organizes your notes, saving you time and cognitive load.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8">
            Start Creating
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            View Examples
          </Button>
        </div>
      </div>
    </section>
  )
}
