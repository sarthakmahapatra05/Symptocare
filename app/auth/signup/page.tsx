"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, UserPlus } from "lucide-react"
import { signUp } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userDetails, setUserDetails] = useState({
    name: "",
    gender: "",
    age: "",
    medicalHistory: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) return
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!userDetails.name || !userDetails.gender || !userDetails.age) return

    setIsLoading(true)
    setError("")
    try {
      const authData = await signUp(email, password, userDetails)
      if (authData.session) {
        router.push("/onboarding")
      } else {
        router.push("/auth/login?verifyEmail=true")
      }
    } catch (err: any) {
      setError(err.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel overflow-hidden">
            <div className="relative h-72 bg-slate-100">
              <Image src="/doctorconsult.jpg" alt="Health journey" fill className="object-contain" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
            <CardContent className="p-6">
              <p className="text-2xl font-semibold text-slate-900">Start your care journey</p>
              <p className="mt-2 text-slate-600">Create your profile to unlock AI symptom guidance, doctor discovery, and wellness tracking.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                <UserPlus className="h-6 w-6 text-teal-700" />
                Create Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/80" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/80" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-white/80" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="bg-white/80"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select value={userDetails.gender} onValueChange={(value) => setUserDetails((prev) => ({ ...prev, gender: value }))}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={userDetails.age}
                      onChange={(e) => setUserDetails((prev) => ({ ...prev, age: e.target.value }))}
                      required
                      className="bg-white/80"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical-history">Medical History (Optional)</Label>
                  <Textarea
                    id="medical-history"
                    placeholder="Conditions, allergies, current medication..."
                    value={userDetails.medicalHistory}
                    onChange={(e) => setUserDetails((prev) => ({ ...prev, medicalHistory: e.target.value }))}
                    className="min-h-24 bg-white/80"
                  />
                </div>

                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <AlertCircle className="mr-2 inline h-4 w-4" />
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={!email.trim() || !password.trim() || !confirmPassword.trim() || !userDetails.name || !userDetails.gender || !userDetails.age || isLoading}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-4 text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-teal-700 hover:underline">
                  Login
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
