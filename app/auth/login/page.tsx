"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, LogIn, ShieldCheck, Stethoscope } from "lucide-react"
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setIsLoading(true)
    setError("")
    try {
      await signIn(email, password)
      const redirectUrl = new URLSearchParams(window.location.search).get("redirect")
      router.push(redirectUrl || "/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
      <div className="grid items-center gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel overflow-hidden">
            <div className="relative h-72">
              <Image src="/carousel3.jpg" alt="Healthcare login" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
            <CardContent className="p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-700/20 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-900">
                <Stethoscope className="h-3.5 w-3.5" />
                Secure doctor and patient access
              </div>
              <p className="text-2xl font-semibold text-slate-900">Welcome back to SymptoCare</p>
              <p className="mt-2 text-slate-600">Log in to manage consultations, appointments, reports, and follow-up care.</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-cyan-800">
                <ShieldCheck className="h-4 w-4" />
                Protected access with encrypted authentication
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                <LogIn className="h-6 w-6 text-teal-700" />
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {searchParams.get("verifyEmail") === "true" ? (
                  <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    Please verify your email, then login to continue.
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/80"
                  />
                </div>

                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <AlertCircle className="mr-2 inline h-4 w-4" />
                    {error}
                  </div>
                ) : null}

                <Button type="submit" disabled={isLoading || !email.trim() || !password.trim()} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p>
                  New to SymptoCare?{" "}
                  <Link href="/auth/signup" className="font-medium text-teal-700 hover:underline">
                    Create patient account
                  </Link>
                </p>
                <p>
                  Doctor onboarding?{" "}
                  <Link href="/auth/doctor-signup" className="font-medium text-teal-700 hover:underline">
                    Register as doctor
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
