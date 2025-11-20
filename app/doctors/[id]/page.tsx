"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  Star,
  User,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Award,
  Stethoscope,
  CheckCircle,
  DollarSign,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const doctorId = params.id as string
  const [doctor, setDoctor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const { getDoctorProfile } = await import("@/lib/auth")
        const doctorData = await getDoctorProfile(doctorId)
        setDoctor(doctorData)
      } catch (error) {
        console.error("Error loading doctor:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (doctorId) {
      loadDoctor()
    }
  }, [doctorId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (!doctor || !doctor.is_verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Doctor Not Available</h2>
            <p className="text-muted-foreground mb-4">
              {!doctor ? "The doctor you're looking for doesn't exist." : "This doctor's profile is not yet verified."}
            </p>
            <Link href="/doctors">
              <Button className="w-full">Back to Doctors</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleBookAppointment = async () => {
    try {
      // Check if user is logged in
      const { getCurrentUser } = await import("@/lib/auth")
      const user = await getCurrentUser()
      
      if (!user) {
        // Redirect to login with return URL
        router.push(`/auth/login?redirect=/appointments/book?doctorId=${doctorId}`)
        return
      }

      // User is logged in, redirect to booking page
      router.push(`/appointments/book?doctorId=${doctorId}`)
    } catch (error) {
      // If error, redirect to login
      router.push(`/auth/login?redirect=/appointments/book?doctorId=${doctorId}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border fade-in sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/doctors">
              <Button variant="ghost" size="sm" className="smooth-transition hover-scale">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Doctors</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="smooth-transition hover-scale text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Doctor Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Header Card */}
            <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-4 border-primary/20 float-animation">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground professional-heading">
                        {doctor.profiles?.full_name || "Dr. Unknown"}
                      </h1>
                      {doctor.is_verified && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg sm:text-xl text-primary font-medium professional-body mb-3">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap mb-4">
                      <div className="flex items-center gap-1 text-sm sm:text-base text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{doctor.experience_years}+ years experience</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{doctor.location || "Location not specified"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground professional-heading flex items-center gap-2">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  About
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm sm:text-base text-muted-foreground professional-body leading-relaxed">
                  {doctor.bio || "No bio available."}
                </p>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground professional-heading flex items-center gap-2">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Qualifications
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {doctor.qualifications && doctor.qualifications.length > 0 ? (
                  <ul className="space-y-3">
                    {doctor.qualifications.map((qual: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-muted-foreground professional-body">{qual}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No qualifications listed.</p>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground professional-heading flex items-center gap-2">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Availability
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {doctor.availability && typeof doctor.availability === 'object' ? (
                  <div className="space-y-2 text-sm sm:text-base text-muted-foreground professional-body">
                    <p>Availability schedule will be displayed here.</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Availability information not available.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-card to-accent/30 border-border sticky top-20 fade-in-up hover-lift smooth-transition">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground professional-heading">
                    Consultation Fee
                  </h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-primary">₹{doctor.consultation_fee || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">per consultation</p>
              </CardHeader>
              <Separator />
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Location Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm sm:text-base text-card-foreground mb-1">Location</p>
                      <p className="text-xs sm:text-sm text-muted-foreground professional-body leading-relaxed">
                        {doctor.address || doctor.location || "Address not specified"}
                      </p>
                    </div>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base text-card-foreground mb-1">Phone</p>
                        <a href={`tel:${doctor.phone}`} className="text-xs sm:text-sm text-primary hover:underline">
                          {doctor.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base text-card-foreground mb-1">Email</p>
                        <a href={`mailto:${doctor.email}`} className="text-xs sm:text-sm text-primary hover:underline break-all">
                          {doctor.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Languages */}
                {doctor.languages && doctor.languages.length > 0 && (
                  <div>
                    <p className="font-medium text-sm sm:text-base text-card-foreground mb-2">Languages Spoken</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((lang: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Book Now Button */}
                <Button
                  onClick={handleBookAppointment}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale text-base sm:text-lg py-6"
                  size="lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  {isBooking ? "Redirecting..." : "Book Appointment"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You'll be redirected to the booking page
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

