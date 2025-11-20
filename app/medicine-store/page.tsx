"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Store, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const medicineStores = [
  {
    id: "healthplus-medical-store",
    name: "HealthPlus Medical Store",
    location: "Saheed Nagar, Bhubaneswar",
    rating: 4.8,
    reviews: 245,
    openHours: "8AM – 10PM",
    image: "/placeholder.jpg", // Using existing placeholder
    isOpen: true,
    distance: "2.3 km"
  }
]

export default function MedicineStorePage() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary professional-heading">Medicine Store</h1>
              <p className="text-muted-foreground professional-body mt-2 text-sm sm:text-base">
                Find and order medicines from trusted pharmacies near you
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="btn-outline text-sm sm:text-base">
                <Store className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {medicineStores.map((store) => (
            <Card key={store.id} className="card-elevated hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="relative h-32 sm:h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <Badge variant={store.isOpen ? "default" : "secondary"} className="bg-green-500 hover:bg-green-600 text-xs">
                      {store.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                    <Badge variant="outline" className="bg-white/90 text-black text-xs">
                      {store.distance}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground professional-heading mb-2">
                    {store.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{store.rating}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">({store.reviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    <span className="truncate">{store.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    <span>{store.openHours}</span>
                  </div>
                </div>

                <Link href={`/medicine-store/${store.id}`}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-primary text-sm sm:text-base">
                    View Shop
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for Future Stores */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 sm:p-8 bg-card border border-border rounded-lg">
              <Store className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 professional-heading">
                More Stores Coming Soon
              </h3>
              <p className="text-muted-foreground professional-body text-sm sm:text-base">
                We're expanding our network of trusted pharmacies across Odisha.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
