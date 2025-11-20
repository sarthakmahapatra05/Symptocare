"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth"
import { getDoctorProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export default function BookAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = searchParams.get("doctorId")
  
  const [user, setUser] = useState<any>(null)
  const [doctor, setDoctor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    consultationType: "video",
    reason: "",
    patientNotes: "",
  })

  useEffect(() => {
    const checkAuthAndLoadDoctor = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push(`/auth/login?redirect=/appointments/book?doctorId=${doctorId}`)
          return
        }

        setUser(currentUser)

        if (doctorId) {
          const doctorData = await getDoctorProfile(doctorId)
          setDoctor(doctorData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadDoctor()
  }, [doctorId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsBooking(true)

    if (!formData.date || !formData.time || !formData.reason.trim()) {
      setError("Please fill in all required fields")
      setIsBooking(false)
      return
    }

    try {
      // Combine date and time
      const scheduledAt = new Date(`${formData.date}T${formData.time}`)

      // Create appointment in database
      const { data, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: doctorId,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: 30,
          status: 'scheduled',
          consultation_type: formData.consultationType,
          reason: formData.reason,
          patient_notes: formData.patientNotes || null,
        })
        .select()
        .single()

      if (appointmentError) throw appointmentError

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/user")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to book appointment. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  const getAvailableDates = () => {
    const dates = []
    for (let i = 1; i <= 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date.toISOString().split("T")[0])
    }
    return dates
  }

  const getAvailableTimes = () => {
    // Generate time slots (9 AM to 6 PM, 30-minute intervals)
    const times = []
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(timeString)
      }
    }
    return times
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Doctor Not Found</h2>
            <p className="text-muted-foreground mb-4">The doctor you're looking for doesn't exist.</p>
            <Link href="/doctors">
              <Button className="w-full">Back to Doctors</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Appointment Booked!</h2>
            <p className="text-muted-foreground mb-4">Your appointment has been successfully booked.</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <Link href={`/doctors/${doctorId}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-6 smooth-transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Doctor Profile
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl text-card-foreground">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm sm:text-base">Select Date *</Label>
                    <Select value={formData.date} onValueChange={(value) => setFormData({ ...formData, date: value })} required>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Choose date" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableDates().map((date) => (
                          <SelectItem key={date} value={date}>
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm sm:text-base">Select Time *</Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })} required>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTimes().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationType" className="text-sm sm:text-base">Consultation Type *</Label>
                    <Select
                      value={formData.consultationType}
                      onValueChange={(value) => setFormData({ ...formData, consultationType: value })}
                      required
                    >
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm sm:text-base">Reason for Visit *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe your symptoms or reason for consultation..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="bg-input border-border text-foreground min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientNotes" className="text-sm sm:text-base">Additional Notes (Optional)</Label>
                    <Textarea
                      id="patientNotes"
                      placeholder="Any additional information you'd like to share..."
                      value={formData.patientNotes}
                      onChange={(e) => setFormData({ ...formData, patientNotes: e.target.value })}
                      className="bg-input border-border text-foreground min-h-[80px]"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 text-sm fade-in scale-in">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isBooking}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale disabled:opacity-50"
                  >
                    {isBooking ? "Booking..." : "Confirm Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-card to-accent/30 border-border sticky top-6 fade-in-up hover-lift smooth-transition">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Doctor Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-card-foreground">{doctor.profiles?.full_name || "Dr. Unknown"}</h3>
                  <p className="text-primary font-medium">{doctor.specialization}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{doctor.experience_years}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>₹{doctor.consultation_fee} per consultation</span>
                  </div>
                </div>

                {doctor.location && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs sm:text-sm text-muted-foreground">{doctor.location}</p>
                    {doctor.address && (
                      <p className="text-xs text-muted-foreground mt-1">{doctor.address}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

