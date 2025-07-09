import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* background grid pattern */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* badge */}
        <div className="inline-flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">ai-powered mind mapping</span>
        </div>

        {/* main headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          transform{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            messy notes
          </span>{" "}
          into{" "}
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            structured mind maps
          </span>
        </h1>

        {/* subtitle */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          paste or voice your chaotic thoughts and watch ai instantly create beautiful, interactive mind maps and project plans.
          no manual effort required.
        </p>

        {/* feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-2 text-gray-300">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>instant ai processing</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span>interactive editing</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>export & share</span>
          </div>
        </div>

        {/* cta buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/input">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 h-auto">
              try it now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-lg px-8 py-4 h-auto bg-transparent"
            >
              see features
            </Button>
          </Link>
        </div>

        {/* stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10x</div>
            <div className="text-gray-400">faster planning</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-gray-400">time saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">∞</div>
            <div className="text-gray-400">possibilities</div>
          </div>
        </div>
      </div>

      {/* floating elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40" />
      <div className="absolute bottom-32 left-20 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-50" />
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-pink-400 rounded-full animate-pulse opacity-30" />
    </section>
  )
}
