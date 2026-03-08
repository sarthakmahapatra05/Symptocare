"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock3, MapPin, Pill, ShieldCheck, Store, Truck, ArrowRight } from "lucide-react"

const medicineStores = [
  {
    id: "healthplus-medical-store",
    name: "HealthPlus Medical Store",
    location: "Saheed Nagar, Bhubaneswar",
    openHours: "8:00 AM - 10:00 PM",
    image: "/healthy_meal.jpg",
    isOpen: true,
    distance: "2.3 km",
    tags: ["Prescription Medicines", "OTC", "Home Delivery"],
  },
]

export default function MedicineStorePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:pt-12">
      <section className="glass-panel overflow-hidden">
        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
          <div>
            <Badge className="mb-3 bg-cyan-500/15 text-cyan-900 hover:bg-cyan-500/15">
              <ShieldCheck className="mr-1 h-4 w-4" />
              Trusted pharmacy partners
            </Badge>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Order medicines from verified stores</h1>
            <p className="mt-3 max-w-xl text-slate-600">
              Continue your treatment without delays. Browse nearby partner pharmacies and place your medicine order with transparent pricing.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/80">Doctor-linked care flow</Badge>
              <Badge variant="outline" className="bg-white/80">Fast local delivery</Badge>
              <Badge variant="outline" className="bg-white/80">Secure checkout</Badge>
            </div>
          </div>
          <div className="relative min-h-64 overflow-hidden rounded-2xl">
            <Image src="/carousel3.jpg" alt="Medicine support" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="glass-panel"><CardContent className="p-5"><Store className="h-6 w-6 text-cyan-700" /><p className="mt-2 text-sm text-slate-500">Partner Stores</p><p className="text-3xl font-bold text-slate-900">{medicineStores.length}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-5"><Truck className="h-6 w-6 text-cyan-700" /><p className="mt-2 text-sm text-slate-500">Delivery Coverage</p><p className="text-3xl font-bold text-slate-900">Local</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-5"><Pill className="h-6 w-6 text-cyan-700" /><p className="mt-2 text-sm text-slate-500">Catalog Type</p><p className="text-3xl font-bold text-slate-900">Mixed</p></CardContent></Card>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {medicineStores.map((store) => (
          <Card key={store.id} className="glass-panel overflow-hidden">
            <div className="relative h-44">
              <Image src={store.image} alt={store.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute left-3 top-3 flex gap-2">
                <Badge className={store.isOpen ? "bg-emerald-600 text-white" : "bg-slate-500 text-white"}>
                  {store.isOpen ? "Open" : "Closed"}
                </Badge>
                <Badge variant="outline" className="bg-white/90 text-slate-800">{store.distance}</Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-slate-900">{store.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-500" />
                {store.location}
              </p>
              <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                <Clock3 className="h-4 w-4 text-slate-500" />
                {store.openHours}
              </p>
              <div className="flex flex-wrap gap-2">
                {store.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-white/80 text-slate-700">{tag}</Badge>
                ))}
              </div>
              <Link href={`/medicine-store/${store.id}`}>
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                  View Store
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}

