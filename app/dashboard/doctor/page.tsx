"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Calendar, CheckCircle, Clock, LogOut, Phone, Stethoscope, User, Users, Video } from "lucide-react"
import { signOut, getCurrentUser, getDoctorProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoctorDashboard() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctor, setDoctor] = useState<any>(null)
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

        const doctorData = await getDoctorProfile(currentUser.id)
        setDoctor(doctorData)
        if (!doctorData?.is_verified) return

        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(
              id,
              full_name,
              email,
              phone,
              gender
            )
          `)
          .eq("doctor_id", currentUser.id)
          .order("scheduled_at", { ascending: false })
          .limit(30)

        if (error) throw error
        setAppointments(data || [])
      } catch (error) {
        console.error("Error loading data:", error)
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

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    if (!user) return
    const { error } = await supabase.from("appointments").update({ status: newStatus }).eq("id", appointmentId)
    if (error) return

    const { data } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(
          id,
          full_name,
          email,
          phone,
          gender
        )
      `)
      .eq("doctor_id", user.id)
      .order("scheduled_at", { ascending: false })
      .limit(30)

    setAppointments(data || [])
  }

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

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString()
    return appointments.filter((a) => new Date(a.scheduled_at).toDateString() === today && (a.status === "scheduled" || a.status === "confirmed"))
  }, [appointments])

  if (isLoading) {
    return <main className="mx-auto w-full max-w-7xl px-4 py-8 text-slate-600">Loading dashboard...</main>
  }

  if (doctor && !doctor.is_verified) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card className="glass-panel border-yellow-200 bg-yellow-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-yellow-700" />
            <p className="text-2xl font-semibold text-slate-900">Verification Pending</p>
            <p className="mt-2 text-slate-700">Your doctor profile is under review. You will get access once verification is complete.</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
          <p className="text-slate-600">Manage patient appointments and daily schedule.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-cyan-100 text-cyan-800">
            <Stethoscope className="mr-1 h-4 w-4" />
            {doctor?.specialization || "Doctor"}
          </Badge>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-panel"><CardContent className="p-5"><p className="text-sm text-slate-500">Total Appointments</p><p className="text-3xl font-bold text-slate-900">{appointments.length}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-5"><p className="text-sm text-slate-500">Today</p><p className="text-3xl font-bold text-slate-900">{todayAppointments.length}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-5"><p className="text-sm text-slate-500">Upcoming</p><p className="text-3xl font-bold text-slate-900">{appointments.filter((a) => a.status === "scheduled" || a.status === "confirmed").length}</p></CardContent></Card>
        <Card className="glass-panel"><CardContent className="p-5"><p className="text-sm text-slate-500">Unique Patients</p><p className="text-3xl font-bold text-slate-900">{new Set(appointments.map((a) => a.patient_id)).size}</p></CardContent></Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-slate-900">Appointment Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-slate-600">No appointments yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-xl border border-slate-200 bg-white/75 p-4">
                  <div className="mb-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-semibold text-slate-900">{appointment.patient?.full_name || "Patient"}</p>
                      <p className="text-sm text-slate-600">{appointment.patient?.email || "No email"}</p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                    <p className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(appointment.scheduled_at).toLocaleDateString()}</p>
                    <p className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="inline-flex items-center gap-1">{getTypeIcon(appointment.consultation_type)}{appointment.consultation_type}</p>
                  </div>
                  {appointment.reason ? <p className="mt-2 text-sm text-slate-600">Reason: {appointment.reason}</p> : null}

                  {(appointment.status === "scheduled" || appointment.status === "confirmed") && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(appointment.id, "completed")}>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Complete
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
