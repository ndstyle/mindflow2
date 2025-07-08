"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Calendar, Share2 } from "lucide-react"

export function DashboardContent() {
  const recentMaps = [
    {
      id: 1,
      title: "Marketing Campaign Q2",
      createdAt: "2 hours ago",
      nodes: 12,
      type: "Mind Map",
    },
    {
      id: 2,
      title: "Product Launch Strategy",
      createdAt: "1 day ago",
      nodes: 8,
      type: "Project Plan",
    },
    {
      id: 3,
      title: "Team Meeting Notes",
      createdAt: "3 days ago",
      nodes: 15,
      type: "Mind Map",
    },
  ]

  return (
    <div className="px-8 py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-white/70">Manage your mind maps and project plans</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Plus className="mr-2 w-4 h-4" />
          Create New Map
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-white/60 text-sm">Total Maps</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-white/60 text-sm">This Week</p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-white/60 text-sm">Shared</p>
            </div>
            <Share2 className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-white/60 text-sm">Total Nodes</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Mind Maps</h2>
        <div className="space-y-4">
          {recentMaps.map((map) => (
            <Card
              key={map.id}
              className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{map.title}</h3>
                    <p className="text-white/60 text-sm">
                      {map.nodes} nodes • {map.type} • Created {map.createdAt}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  Open
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
