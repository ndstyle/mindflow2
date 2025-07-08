import { Navbar } from "@/components/navbar"
import { DashboardContent } from "@/components/dashboard-content"
import MindMapGenerator from "@/components/MindMapGenerator"


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="relative z-10">
        <Navbar />
        <DashboardContent />
        <main className="mt-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <MindMapGenerator />
        </main>
      </div>
    </div>
  )
}
