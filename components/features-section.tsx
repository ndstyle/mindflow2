import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Edit3, Share2, Download, Palette, GitBranch, Clock, Shield, Smartphone } from "lucide-react"
import Link from "next/link"

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "ai-powered analysis",
      description:
        "advanced nlp algorithms extract key concepts, relationships, and hierarchies from your unstructured text.",
      color: "text-blue-400",
    },
    {
      icon: Zap,
      title: "instant generation",
      description: "transform messy notes into structured mind maps in seconds, not hours of manual work.",
      color: "text-yellow-400",
    },
    {
      icon: Edit3,
      title: "interactive editing",
      description: "drag, drop, and edit nodes. add colors, priorities, and connections with intuitive tools.",
      color: "text-green-400",
    },
    {
      icon: Share2,
      title: "easy sharing",
      description: "generate public links, embed codes, or collaborate in real-time with your team.",
      color: "text-purple-400",
    },
    {
      icon: Download,
      title: "multiple exports",
      description: "export as pdf, png, svg, or json. perfect for presentations, documentation, or backup.",
      color: "text-pink-400",
    },
    {
      icon: Palette,
      title: "beautiful styling",
      description: "professional themes, custom colors, and clean layouts that make your ideas shine.",
      color: "text-orange-400",
    },
    {
      icon: GitBranch,
      title: "project planning",
      description: "automatically generate task lists, timelines, and project structures from your ideas.",
      color: "text-cyan-400",
    },
    {
      icon: Clock,
      title: "version history",
      description: "track changes, revert to previous versions, and see how your ideas evolved over time.",
      color: "text-indigo-400",
    },
    {
      icon: Shield,
      title: "secure & private",
      description: "your data is encrypted and secure. choose between private maps or public sharing.",
      color: "text-red-400",
    },
    {
      icon: Smartphone,
      title: "mobile friendly",
      description: "create and edit mind maps on any device. responsive design works everywhere.",
      color: "text-teal-400",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              organize your thoughts
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            powerful ai meets intuitive design to give you the ultimate mind mapping experience.
          </p>
        </div>

        {/* features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg bg-gray-700/50 group-hover:bg-gray-700 transition-colors`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-100">{feature.title}</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* cta section */}
        <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-12 border border-gray-600">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">ready to transform your ideas?</h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            join thousands of users who have already streamlined their thinking process with ai-powered mind mapping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/input">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 h-auto">
                start creating now
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white text-lg px-8 py-4 h-auto bg-transparent"
              >
                sign up free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
