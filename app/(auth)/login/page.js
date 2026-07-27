'use client'

//-- Imports --
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'


//-- Page component --
export default function LoginPage(){
    // States

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const router = useRouter()
    const supabase = createClient()

    // Logic

    async function handleSubmit(e){
        e.preventDefault()

        setError(null)
        setLoading(true)

        const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError("Invalid email or password")
            setLoading(false)
            return
        }

        if (signInData?.user) {
            posthog.identify(signInData.user.id, { email: signInData.user.email })
            posthog.capture('user_logged_in')
        }

        setLoading(false)
        router.push('/dashboard')
    }

    return (
        <div>
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
              JobFlow
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mt-4">Login to your account</h1>
            <p className="text-slate-500 text-sm mt-2">Welcome back to Jobflow</p>
          </div>
    
          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
    
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
    
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
    
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
    
              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
    
            </form>
          </div>
    
          {/* Signup link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      )
}
