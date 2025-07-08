import { Card } from "@/components/ui/card"
import { Brain, Share2, Download, Edit3, Zap, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Parsing",
      description:
        "Advanced AI extracts key concepts, relationships, and timelines from your unstructured text automatically.",
    },
    {
      icon: Edit3,
      title: "Interactive Editing",
      description:
        "Drag, drop, and edit nodes. Add colors, priorities, and customize your mind maps with intuitive tools.",
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Transform messy notes into beautiful mind maps and project plans in seconds, not hours.",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share interactive mind maps with public links or embed them directly into your websites and docs.",
    },
    {
      icon: Download,
      title: "Multiple Exports",
      description: "Export as PDF, PNG, JSON, or get shareable links. Your data, your way.",
    },
    {
      icon: Users,
      title: "Collaboration Ready",
      description: "Save your work, track versions, and collaborate with team members on shared projects.",
    },
  ]

  return (
    <section className="px-8 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Everything you need to organize your thoughts</h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          From chaotic brainstorms to structured action plans - we handle the complexity so you can focus on what
          matters.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors">
            <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-white/70">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
