"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Stethoscope, UserRound, ShieldCheck, Clock3 } from "lucide-react"
import { supabase } from "@/lib/supabase"

type DoctorRecord = {
  id: string
  specialization: string
  experience_years: number | null
  location: string | null
  consultation_fee: number | null
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

type RawDoctorRecord = Omit<DoctorRecord, "profiles"> & {
  profiles: { full_name: string | null; email: string | null }[] | null
}

export default function DoctorsPage() {
  const searchParams = useSearchParams()
  const [doctors, setDoctors] = useState<DoctorRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const specialization = searchParams.get("specialization")?.trim() ?? ""
    if (specialization) {
      setQuery(specialization)
    }
  }, [searchParams])

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select(
            `
            id,
            specialization,
            experience_years,
            location,
            consultation_fee,
            profiles:profiles!doctors_id_fkey(
              full_name,
              email
            )
          `,
          )
          .eq("is_verified", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        const normalized = ((data as RawDoctorRecord[]) || []).map((item) => ({
          ...item,
          profiles: Array.isArray(item.profiles) ? item.profiles[0] ?? null : null,
        }))
        setDoctors(normalized)
      } catch (error) {
        console.error("Failed to load doctors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDoctors()
  }, [])

  const filteredDoctors = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return doctors

    return doctors.filter((doctor) => {
      const name = doctor.profiles?.full_name?.toLowerCase() ?? ""
      const specialization = doctor.specialization?.toLowerCase() ?? ""
      const location = doctor.location?.toLowerCase() ?? ""
      return name.includes(search) || specialization.includes(search) || location.includes(search)
    })
  }, [doctors, query])

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:pt-12">
      <section className="glass-panel p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-3 bg-teal-500/15 text-teal-900 hover:bg-teal-500/15">
              <ShieldCheck className="mr-1 h-4 w-4" />
              Verified medical professionals
            </Badge>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Find the right doctor in minutes</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Browse verified specialists, compare expertise, and book consultations directly from SymptoCare.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/doctor-signup">
              <Button variant="outline" className="bg-white/80">Register as Doctor</Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by doctor name, specialization, or location"
              className="border-slate-200 bg-white pl-9"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="glass-panel"><CardContent className="p-5"><p className="text-sm text-slate-500">Verified Doctors</p><p className="text-3xl font-bold text-slate-900">{doctors.length}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-5"><p className="text-sm text-slate-500">Specializations</p><p className="text-3xl font-bold text-slate-900">{new Set(doctors.map((d) => d.specialization)).size}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-5"><p className="text-sm text-slate-500">Showing Results</p><p className="text-3xl font-bold text-slate-900">{filteredDoctors.length}</p></CardContent></Card>
      </section>

      <section className="mt-6">
        {isLoading ? (
          <div className="glass-panel p-8 text-center text-slate-600">Loading doctors...</div>
        ) : filteredDoctors.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="p-8 text-center">
              <Stethoscope className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="text-xl font-semibold text-slate-900">No doctors found</p>
              <p className="mt-1 text-slate-600">Try a different search keyword or check back soon.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="glass-panel overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-3 text-slate-900">
                    <div className="rounded-xl bg-slate-900/5 p-2">
                      <UserRound className="h-5 w-5 text-teal-700" />
                    </div>
                    <div>
                      <p className="text-lg">{doctor.profiles?.full_name || "Doctor"}</p>
                      <p className="text-sm font-normal text-teal-800">{doctor.specialization}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4 text-slate-500" />
                    {doctor.experience_years ?? 0}+ years experience
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {doctor.location || "Location not specified"}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <div>
                      <p className="text-xs text-slate-500">Consultation</p>
                      <p className="text-xl font-bold text-slate-900">INR {doctor.consultation_fee ?? 0}</p>
                    </div>
                    <Link href={`/doctors/${doctor.id}`}>
                      <Button className="bg-slate-900 text-white hover:bg-slate-800">View Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
