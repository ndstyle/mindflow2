'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugAuthPage() {
  const [email, setEmail] = useState('niranjandeshpande09@gmail.com')
  const [password, setPassword] = useState('desh11')
  const [result, setResult] = useState('')

  const testSignUp = async () => {
    setResult('Testing sign up...')
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        setResult(`Sign up error: ${error.message}\nCode: ${error.status}\nDetails: ${JSON.stringify(error, null, 2)}`)
      } else {
        setResult(`Sign up success! User: ${data.user?.email}\nSession: ${data.session ? 'Yes' : 'No'}\nEmail confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}\nData: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    }
  }

  const testSignIn = async () => {
    setResult(`Testing sign in with:\nEmail: ${email}\nPassword: ${password}\nPassword length: ${password.length}`)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setResult(`Sign in error: ${error.message}\nCode: ${error.status}\nDetails: ${JSON.stringify(error, null, 2)}`)
      } else {
        setResult(`Sign in success! User: ${data.user?.email}\nSession: ${data.session ? 'Yes' : 'No'}\nData: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    }
  }

  const createNewUserAndTest = async () => {
    const newEmail = 'newuser123@gmail.com'
    const newPassword = 'password123'
    
    setResult(`Creating new user with current settings:\nEmail: ${newEmail}\nPassword: ${newPassword}`)
    
    try {
      // Step 1: Create the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
      })
      
      if (signUpError) {
        setResult(`Sign up error: ${signUpError.message}`)
        return
      }
      
      setResult(`✅ User created successfully!\nEmail: ${signUpData.user?.email}\nSession: ${signUpData.session ? 'Yes' : 'No'}`)
      
      // Step 2: Sign out to test the login flow
      await supabase.auth.signOut()
      setResult(`✅ User created successfully!\nEmail: ${signUpData.user?.email}\nSession: ${signUpData.session ? 'Yes' : 'No'}\n\nNow testing sign in...`)
      
      // Step 3: Try to sign in
      setTimeout(async () => {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: newEmail,
          password: newPassword,
        })
        
        if (signInError) {
          setResult(`Sign in error: ${signInError.message}`)
        } else {
          setResult(`✅ SUCCESS! User created and can sign in!\nEmail: ${signInData.user?.email}\nSession: ${signInData.session ? 'Yes' : 'No'}`)
        }
      }, 1000)
      
    } catch (err) {
      setResult(`Exception: ${err}`)
    }
  }

  const testSignUpWithConfirmation = async () => {
    const testEmail = 'testuser123@gmail.com'
    const testPassword = 'password123'
    
    setResult(`Testing sign up with confirmation bypass:\nEmail: ${testEmail}\nPassword: ${testPassword}`)
    
    try {
      // Try to sign up with email confirmation disabled
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (signUpError) {
        setResult(`Sign up error: ${signUpError.message}`)
        return
      }
      
      setResult(`Sign up successful for ${testEmail}.\nEmail confirmed: ${signUpData.user?.email_confirmed_at ? 'Yes' : 'No'}\nSession: ${signUpData.session ? 'Yes' : 'No'}`)
      
      // If we have a session, try to sign in immediately
      if (signUpData.session) {
        setResult(`✅ User created and signed in automatically! User: ${signUpData.user?.email}`)
      } else {
        setResult(`User created but no session. Email confirmation might be required.`)
      }
      
    } catch (err) {
      setResult(`Exception: ${err}`)
    }
  }

  const checkEmailConfirmation = async () => {
    setResult('Checking if email confirmation is required...')
    try {
      // Try to get the current user to see their confirmation status
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setResult(`Current user: ${user.email}\nEmail confirmed at: ${user.email_confirmed_at || 'Not confirmed'}\nUser ID: ${user.id}`)
      } else {
        setResult('No current user found - this means either:\n1. Email confirmation is required\n2. User is not signed in\n3. Session expired')
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    }
  }

  const signOut = async () => {
    setResult('Signing out...')
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setResult(`Sign out error: ${error.message}`)
      } else {
        setResult('✅ Successfully signed out!')
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    }
  }

  const checkSession = async () => {
    setResult('Checking session...')
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setResult(`Session error: ${error.message}`)
      } else {
        setResult(`Session: ${data.session ? 'Active' : 'None'}\nUser: ${data.session?.user?.email || 'None'}\nData: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Auth Debug</h1>
      
      <div className="space-y-4 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded"
        />
        
        <div className="flex gap-2 flex-wrap">
          <button onClick={testSignUp} className="bg-green-600 px-4 py-2 rounded">
            Test Sign Up
          </button>
          <button onClick={testSignIn} className="bg-blue-600 px-4 py-2 rounded">
            Test Sign In
          </button>
          <button onClick={createNewUserAndTest} className="bg-teal-600 px-4 py-2 rounded">
            Create New User + Test Login
          </button>
          <button onClick={testSignUpWithConfirmation} className="bg-yellow-600 px-4 py-2 rounded">
            Test Sign Up + Auto Sign In
          </button>
          <button onClick={checkEmailConfirmation} className="bg-orange-600 px-4 py-2 rounded">
            Check Email Status
          </button>
          <button onClick={signOut} className="bg-red-600 px-4 py-2 rounded">
            Sign Out
          </button>
          <button onClick={checkSession} className="bg-purple-600 px-4 py-2 rounded">
            Check Session
          </button>
        </div>
      </div>
      
      {result && (
        <div className="bg-gray-800 p-4 rounded">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
} 