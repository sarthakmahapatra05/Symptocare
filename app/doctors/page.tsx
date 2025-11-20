"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, User, Stethoscope } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        // Fetch only verified doctors
        const { data, error } = await supabase
          .from('doctors')
          .select(`
            id,
            specialization,
            experience_years,
            location,
            consultation_fee,
            profiles:profiles!doctors_id_fkey(
              id,
              full_name,
              email
            )
          `)
          .eq('is_verified', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setDoctors(data || [])
      } catch (error) {
        console.error("Error loading doctors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDoctors()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border fade-in">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary professional-heading">Our Doctors</h1>
              <p className="text-muted-foreground professional-body mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                Connect with experienced healthcare professionals
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/auth/doctor-signup">
                <Button variant="outline" className="w-full sm:w-auto smooth-transition hover-scale text-sm">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Register as Doctor
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto smooth-transition hover-scale text-sm">
                  <User className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Verified Doctors Available</h3>
            <p className="text-muted-foreground mb-6">Check back soon as we verify more healthcare professionals.</p>
            <Link href="/auth/doctor-signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Stethoscope className="h-4 w-4 mr-2" />
                Register as Doctor
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {doctors.map((doctor, index) => (
              <Card key={doctor.id} className="hover-lift smooth-transition fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0 float-animation">
                      <User className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground professional-heading truncate">
                        {doctor.profiles?.full_name || "Dr. Unknown"}
                      </h3>
                      <p className="text-primary font-medium professional-body text-xs sm:text-sm md:text-base">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground">{doctor.experience_years}+ years</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{doctor.location || "Location not specified"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">₹{doctor.consultation_fee || 0}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">per consultation</p>
                    </div>
                    <Link href={`/doctors/${doctor.id}`} className="w-full sm:w-auto">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale w-full sm:w-auto text-sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State for Future Doctors */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 sm:p-8 bg-card border border-border rounded-lg">
              <User className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 professional-heading">
                More Doctors Coming Soon
              </h3>
              <p className="text-muted-foreground professional-body text-sm sm:text-base">
                We're continuously expanding our network of healthcare professionals to serve you better.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
