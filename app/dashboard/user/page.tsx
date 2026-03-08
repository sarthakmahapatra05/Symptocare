"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Calendar, CheckCircle, Clock, LogOut, MapPin, Phone, Stethoscope, User, Video } from "lucide-react"
import { signOut, getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function UserDashboard() {
  const router = useRouter()
  const [symptomText, setSymptomText] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }
        setUser(currentUser)

        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            doctor:doctors!appointments_doctor_id_fkey(
              id,
              specialization,
              location,
              profiles:profiles!doctors_id_fkey(full_name)
            )
          `)
          .eq("patient_id", currentUser.id)
          .order("scheduled_at", { ascending: false })
          .limit(20)

        if (error) throw error
        setAppointments(data || [])
      } catch (error) {
        console.error("Error loading appointments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const analyzeSymptoms = () => {
    if (!symptomText.trim()) return
    router.push("/")
  }

  const upcomingAppointments = useMemo(
    () => appointments.filter((a) => a.status === "scheduled" || a.status === "confirmed"),
    [appointments],
  )

  const getStatusColor = (status: string) => {
    if (status === "confirmed") return "bg-green-100 text-green-800"
    if (status === "scheduled") return "bg-blue-100 text-blue-800"
    if (status === "completed") return "bg-slate-100 text-slate-800"
    if (status === "cancelled") return "bg-red-100 text-red-800"
    return "bg-slate-100 text-slate-800"
  }

  const getTypeIcon = (type: string) => {
    if (type === "video") return <Video className="h-4 w-4" />
    if (type === "phone") return <Phone className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
          <p className="text-slate-600">Welcome {user?.email ? `, ${user.email}` : ""}. Manage symptoms and appointments here.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="w-fit">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-panel">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Total Appointments</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{appointments.length}</p>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Upcoming</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{upcomingAppointments.length}</p>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{appointments.filter((a) => a.status === "completed").length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Stethoscope className="h-5 w-5 text-teal-700" />
              Quick Symptom Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your current symptoms..."
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              className="min-h-[110px] bg-white/80"
            />
            <Button onClick={analyzeSymptoms} disabled={!symptomText.trim()} className="bg-slate-900 text-white hover:bg-slate-800">
              <AlertCircle className="mr-2 h-4 w-4" />
              Analyze Symptoms
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-900">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-700" />
                Appointment Center
              </span>
              <Link href="/doctors">
                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                  Book New
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-slate-600">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white/70 p-4">
                <p className="text-slate-700">No appointments yet.</p>
                <Link href="/doctors">
                  <Button className="mt-3 bg-slate-900 text-white hover:bg-slate-800">Find Doctors</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-xl border border-slate-200 bg-white/75 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{appointment.doctor?.profiles?.full_name || "Doctor"}</p>
                        <p className="text-sm text-slate-600">{appointment.doctor?.specialization || "Specialist"}</p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(appointment.scheduled_at).toLocaleDateString()}</p>
                      <p className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      <p className="inline-flex items-center gap-1">{getTypeIcon(appointment.consultation_type)}{appointment.consultation_type}</p>
                      {appointment.doctor?.location ? (
                        <p className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{appointment.doctor.location}</p>
                      ) : null}
                    </div>
                    {appointment.reason ? <p className="mt-2 text-sm text-slate-600">Reason: {appointment.reason}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-slate-900">Care Progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white/75 p-4">
            <p className="text-sm text-slate-500">Symptom Tracking</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">Active</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/75 p-4">
            <p className="text-sm text-slate-500">Follow-up Status</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{upcomingAppointments.length > 0 ? "Pending Visits" : "Up to date"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/75 p-4">
            <p className="text-sm text-slate-500">Recent Outcome</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xl font-semibold text-slate-900">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Stable
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
