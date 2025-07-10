"use client"

import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Plus, History, Star, Zap, Flame, Target, TrendingUp, Award, Calendar } from "lucide-react"
import Link from "next/link"
import { getUserLevel, getXPToNextLevel } from "@/lib/supabase"

interface DashboardContentProps {
  user?: any
  userProfile?: any
}

export default function DashboardContent(props: DashboardContentProps) {
  const context = useAuth()
  const user = props.user ?? context.user
  const userProfile = props.userProfile ?? context.userProfile
  const loading = context.loading

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!userProfile || typeof userProfile.xp !== 'number' || typeof userProfile.streak !== 'number' || typeof userProfile.total_mindmaps !== 'number' || typeof userProfile.total_nodes !== 'number') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Your profile data is incomplete or malformed. Please sign out and sign in again, or contact support.</p>
          <Button onClick={() => window.location.href = '/login'} className="bg-gray-700 hover:bg-gray-800">Sign Out</Button>
        </div>
      </div>
    )
  }

  const currentLevel = getUserLevel(userProfile.xp)
  const xpToNext = getXPToNextLevel(userProfile.xp)
  const progressPercent =
    xpToNext > 0
      ? ((userProfile.xp - currentLevel.minXP) / (currentLevel.minXP + xpToNext - currentLevel.minXP)) * 100
      : 100

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">welcome back, {user?.email?.split("@")?.[0] || "mind mapper"}!</h1>
          <p className="text-gray-400">ready to transform more ideas into beautiful mind maps?</p>
        </div>

        {/* Level & XP Card */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8" style={{ color: currentLevel.color }} />
                <div>
                  <Badge
                    variant="outline"
                    className="text-lg px-3 py-1"
                    style={{ borderColor: currentLevel.color, color: currentLevel.color }}
                  >
                    {currentLevel.name}
                  </Badge>
                  <p className="text-sm text-gray-400 mt-1">level {currentLevel.level}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{userProfile.xp}</p>
                    <p className="text-xs text-gray-400">total XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold">{userProfile.streak}</p>
                    <p className="text-xs text-gray-400">day streak</p>
                  </div>
                </div>
              </div>
            </div>

            {xpToNext > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>progress to level {currentLevel.level + 1}</span>
                  <span>{xpToNext} XP needed</span>
                </div>
                <Progress value={progressPercent} className="h-3 bg-gray-800" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">{userProfile.total_mindmaps}</p>
              <p className="text-sm text-gray-400">mind maps created</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">{userProfile.total_nodes}</p>
              <p className="text-sm text-gray-400">ideas organized</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">{currentLevel.level}</p>
              <p className="text-sm text-gray-400">current level</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">{userProfile.streak}</p>
              <p className="text-sm text-gray-400">day streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                create new mind map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">transform your ideas into structured visual maps with AI assistance</p>
              <Link href="/input">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">start creating (+10 XP)</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20 hover:border-green-500/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                view your mind maps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">explore and edit your previously created mind maps</p>
              <Link href="/history">
                <Button variant="outline" className="border-green-500/50 hover:bg-green-500/10 w-full bg-transparent">
                  browse history
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Hints */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              ways to earn XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <Plus className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="font-medium">create mind map</p>
                <p className="text-sm text-gray-400">+10 XP</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="font-medium">edit nodes</p>
                <p className="text-sm text-gray-400">+5 XP per node</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="font-medium">daily streak</p>
                <p className="text-sm text-gray-400">+15 XP per day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
