"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, AlertCircle, Menu, X, Home, Users, FileText, Phone, LogIn, UserPlus, Moon, Sun, Stethoscope } from "lucide-react"
import Link from "next/link"
import { signUpDoctor } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

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

    // Validation
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
      await signUpDoctor(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        experienceYears: parseInt(formData.experienceYears) || 0,
        consultationFee: parseFloat(formData.consultationFee) || 0,
        location: formData.location,
        address: formData.address,
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q),
        languages: formData.languages,
        bio: formData.bio,
        availability: {},
      })

      // Redirect to a pending verification page
      router.push("/doctor/apply?status=pending")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex" suppressHydrationWarning>
      {/* Mobile Overlay Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 md:w-16"
        }`}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {isSidebarOpen && <span className="ml-2">Menu</span>}
          </Button>
        </div>

        <nav className="px-4 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-primary hover:bg-sidebar-accent"
            >
              <Home className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">Home</span>}
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16"}`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border fade-in">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-foreground hover:bg-accent smooth-transition p-2 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <p className="text-xl sm:text-2xl font-bold text-primary italic professional-heading">SymptoCare</p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-foreground hover:bg-accent smooth-transition p-2 sm:p-2.5"
              >
                {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground border-border hover:bg-accent bg-transparent smooth-transition text-xs sm:text-sm px-2 sm:px-3"
                >
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale text-xs sm:text-sm px-2 sm:px-3">
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Patient Signup</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-3xl bg-card border-border fade-in-up scale-in hover-lift smooth-transition">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg float-animation">
                  <Stethoscope className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-card-foreground">
                Doctor Registration
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Register as a healthcare professional. Your application will be reviewed by our admin team.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-card-foreground text-sm sm:text-base">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-card-foreground text-sm sm:text-base">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-card-foreground text-sm sm:text-base">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-card-foreground text-sm sm:text-base">
                        Location/City *
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-card-foreground text-sm sm:text-base">
                      Full Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition min-h-[80px]"
                      required
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber" className="text-card-foreground text-sm sm:text-base">
                        Medical License Number *
                      </Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => updateField("licenseNumber", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                        placeholder="e.g., MCI-12345"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-card-foreground text-sm sm:text-base">
                        Specialization *
                      </Label>
                      <Select
                        value={formData.specialization}
                        onValueChange={(value) => updateField("specialization", value)}
                        required
                      >
                        <SelectTrigger className="bg-input border-border text-foreground">
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
                      <Label htmlFor="experienceYears" className="text-card-foreground text-sm sm:text-base">
                        Years of Experience *
                      </Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) => updateField("experienceYears", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consultationFee" className="text-card-foreground text-sm sm:text-base">
                        Consultation Fee (₹) *
                      </Label>
                      <Input
                        id="consultationFee"
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => updateField("consultationFee", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications" className="text-card-foreground text-sm sm:text-base">
                      Qualifications (comma-separated) *
                    </Label>
                    <Input
                      id="qualifications"
                      value={formData.qualifications}
                      onChange={(e) => updateField("qualifications", e.target.value)}
                      className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                      placeholder="e.g., MBBS, MD, DM"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-card-foreground text-sm sm:text-base">
                      Professional Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition min-h-[100px]"
                      placeholder="Tell us about your professional background..."
                    />
                  </div>
                </div>

                {/* Account Security */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">Account Security</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-card-foreground text-sm sm:text-base">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-card-foreground text-sm sm:text-base">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 text-sm fade-in scale-in">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    {error}
                  </div>
                )}

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Your registration will be reviewed by our admin team. You will receive access to the platform once your license and credentials are verified. This process typically takes 24-48 hours.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Registering..." : "Register as Doctor"}
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline smooth-transition">
                    Login here
                  </Link>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Are you a patient?{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline smooth-transition">
                    Sign up as patient
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

