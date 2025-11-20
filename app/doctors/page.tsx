"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const doctors = [
  {
    id: "dr-aarav-mehta",
    name: "Dr. Aarav Mehta",
    specialization: "General Physician",
    experience: "7+ years",
    location: "Bhubaneswar, Odisha",
    rate: 499,
    image: "/placeholder-user.jpg", // Using existing placeholder
    rating: 4.8,
    consultations: 1250
  }
]

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary professional-heading">Our Doctors</h1>
              <p className="text-muted-foreground professional-body mt-1 sm:mt-2 text-sm sm:text-base">
                Connect with experienced healthcare professionals
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="btn-outline w-full sm:w-auto">
                <User className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="card-elevated hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-card-foreground professional-heading truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium professional-body text-sm sm:text-base">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{doctor.rating}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">•</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{doctor.consultations} consultations</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{doctor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{doctor.location}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-primary">₹{doctor.rate}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">per consultation</p>
                  </div>
                  <Link href={`/doctors/${doctor.id}`} className="w-full sm:w-auto">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 btn-primary w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
