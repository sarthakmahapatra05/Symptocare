"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ClipboardCheck, ShieldCheck, Stethoscope } from "lucide-react"
import { signUpDoctor } from "@/lib/auth"

export default function DoctorSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
    experienceYears: "",
    consultationFee: "",
    location: "",
    address: "",
    qualifications: "",
    languages: [] as string[],
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [languagesInput, setLanguagesInput] = useState("")
  const router = useRouter()

  const specializations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Gynecologist",
    "Psychiatrist",
    "Oncologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Pulmonologist",
    "Urologist",
    "Ophthalmologist",
    "ENT Specialist",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (!formData.licenseNumber || !formData.specialization || !formData.location) {
      setError("Please fill in all doctor-specific fields")
      return
    }

    setIsLoading(true)

    try {
      const languages = languagesInput
        .split(",")
        .map((language) => language.trim())
        .filter((language) => language.length > 0)

      await signUpDoctor(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        experienceYears: Number.parseInt(formData.experienceYears) || 0,
        consultationFee: Number.parseFloat(formData.consultationFee) || 0,
        location: formData.location,
        address: formData.address,
        qualifications: formData.qualifications
          .split(",")
          .map((qualification) => qualification.trim())
          .filter((qualification) => qualification.length > 0),
        languages,
        bio: formData.bio,
        availability: {},
      })

      router.push("/doctor/apply?status=pending")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
      <div className="grid items-start gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel overflow-hidden">
            <div className="relative h-72">
              <Image src="/doctorsection.avif" alt="Doctor onboarding" fill className="object-cover" sizes="(max-width:768px) 100vw, 45vw" />
            </div>
            <CardContent className="p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-700/20 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-900">
                <ClipboardCheck className="h-3.5 w-3.5" />
                Verified doctor onboarding
              </div>
              <p className="text-2xl font-semibold text-slate-900">Join the SymptoCare doctor network</p>
              <p className="mt-2 text-slate-600">
                Create your professional profile, verify credentials, and connect with patients who need specialized care.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-cyan-800">
                <ShieldCheck className="h-4 w-4" />
                Credential checks are completed before account activation
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                <Stethoscope className="h-6 w-6 text-teal-700" />
                Doctor Registration
              </CardTitle>
              <p className="text-sm text-slate-600">
                Submit your details for verification. Approved doctors get access to the doctor dashboard.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <section className="space-y-4">
                  <p className="text-base font-semibold text-slate-900">Personal Information</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="bg-white/80" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="bg-white/80"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="bg-white/80" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location/City *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="bg-white/80"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea id="address" value={formData.address} onChange={(e) => updateField("address", e.target.value)} className="min-h-20 bg-white/80" required />
                  </div>
                </section>

                <section className="space-y-4 border-t border-slate-200 pt-5">
                  <p className="text-base font-semibold text-slate-900">Professional Information</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Medical License Number *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => updateField("licenseNumber", e.target.value)}
                        className="bg-white/80"
                        required
                        placeholder="e.g., MCI-12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Select value={formData.specialization} onValueChange={(value) => updateField("specialization", value)} required>
                        <SelectTrigger id="specialization" className="bg-white/80">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {specializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Years of Experience *</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        value={formData.experienceYears}
                        onChange={(e) => updateField("experienceYears", e.target.value)}
                        className="bg-white/80"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationFee">Consultation Fee (INR) *</Label>
                      <Input
                        id="consultationFee"
                        type="number"
                        min="0"
                        value={formData.consultationFee}
                        onChange={(e) => updateField("consultationFee", e.target.value)}
                        className="bg-white/80"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications (comma-separated) *</Label>
                    <Input
                      id="qualifications"
                      value={formData.qualifications}
                      onChange={(e) => updateField("qualifications", e.target.value)}
                      className="bg-white/80"
                      placeholder="e.g., MBBS, MD, DM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages (comma-separated)</Label>
                    <Input
                      id="languages"
                      value={languagesInput}
                      onChange={(e) => setLanguagesInput(e.target.value)}
                      className="bg-white/80"
                      placeholder="e.g., English, Hindi, Bengali"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      className="min-h-24 bg-white/80"
                      placeholder="Briefly describe your experience and clinical focus..."
                    />
                  </div>
                </section>

                <section className="space-y-4 border-t border-slate-200 pt-5">
                  <p className="text-base font-semibold text-slate-900">Account Security</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        minLength={6}
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="bg-white/80"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        minLength={6}
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="bg-white/80"
                        required
                      />
                    </div>
                  </div>
                </section>

                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <AlertCircle className="mr-2 inline h-4 w-4" />
                    {error}
                  </div>
                ) : null}

                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  Your registration is reviewed by the admin team before profile activation. Typical verification time is 24-48 hours.
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                  {isLoading ? "Registering..." : "Register as Doctor"}
                </Button>
              </form>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium text-teal-700 hover:underline">
                    Login
                  </Link>
                </p>
                <p>
                  Signing up as patient?{" "}
                  <Link href="/auth/signup" className="font-medium text-teal-700 hover:underline">
                    Create patient account
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
