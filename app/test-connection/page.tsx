'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export default function TestConnectionPage() {
  const { user, signIn, signUp, signOut } = useAuth()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [message, setMessage] = useState('')

  const testConnection = async () => {
    try {
      const response = await supabase.from('mindmaps').select('id, title').limit(1) as any
      if (response.error) {
        setMessage(`Connection error: ${response.error.message}`)
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setMessage('✅ Supabase connection successful!')
      } else {
        setMessage('❌ No data returned from Supabase!')
      }
    } catch (err) {
      setMessage(`❌ Connection failed: ${err}`)
    }
  }

  const testSignUp = async () => {
    try {
      const { data, error } = await signUp(email, password)
      if (error) {
        setMessage(`Sign up error: ${error.message}`)
      } else {
        setMessage('✅ Sign up successful!')
      }
    } catch (err) {
      setMessage(`❌ Sign up failed: ${err}`)
    }
  }

  const testSignIn = async () => {
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setMessage(`Sign in error: ${error.message}`)
      } else {
        setMessage('✅ Sign in successful!')
      }
    } catch (err) {
      setMessage(`❌ Sign in failed: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="relative z-10 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
            <button
              onClick={testConnection}
              className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all"
            >
              Test Database Connection
            </button>
            
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={testSignUp}
                className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-all"
              >
                Test Sign Up
              </button>
              <button
                onClick={testSignIn}
                className="flex-1 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-all"
              >
                Test Sign In
              </button>
            </div>
            
            {user && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400">✅ User is logged in: {user.email}</p>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg mt-3 font-medium transition-all"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
          
          {message && (
            <div className="mt-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl">
              <p className="text-lg">{message}</p>
            </div>
          )}
          
          <div className="mt-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Environment Variables:</h2>
            <div className="space-y-2 text-sm">
              <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
