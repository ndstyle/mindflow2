"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Brain, AlertCircle, Sparkles } from "lucide-react"
import { XP_REWARDS } from "@/lib/supabase"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUp, isDemoMode, addXP } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(email, password)
      if (result.error) {
        setError(result.error)
      } else {
        // Award XP for completing onboarding
        await addXP(XP_REWARDS.COMPLETE_ONBOARDING, "completing onboarding")
        router.push("/dashboard")
      }
    } catch (err) {
      setError("an unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">mindflow</h1>
          </div>
          <p className="text-gray-400">start your mind mapping journey today</p>
        </div>

        {isDemoMode && (
          <Alert className="mb-6 bg-blue-500/10 border-blue-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>demo mode active - any email/password will work for testing</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              join mindflow
            </CardTitle>
            <CardDescription>
              create your account and earn +{XP_REWARDS.COMPLETE_ONBOARDING} XP to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="create a secure password"
                  required
                  disabled={isLoading}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="confirm your password"
                  required
                  disabled={isLoading}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    creating account...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    create account & earn {XP_REWARDS.COMPLETE_ONBOARDING} XP
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
                  sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
