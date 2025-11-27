"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Calendar, Clock, Users, LogOut, AlertCircle, CheckCircle, User, Video, Phone, MapPin } from "lucide-react"
import { signOut, getCurrentUser, getDoctorProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

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

        // Check if doctor is verified
        const doctorData = await getDoctorProfile(currentUser.id)
        setDoctor(doctorData)

        if (!doctorData?.is_verified) {
          // Doctor not verified, show pending message
          return
        }

        // Fetch appointments from database
        const { data: appointmentsData, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(
              id,
              full_name,
              email,
              phone,
              date_of_birth,
              gender
            )
          `)
          .eq('doctor_id', currentUser.id)
          .order('scheduled_at', { ascending: false })
          .limit(20)

        if (error) throw error
        setAppointments(appointmentsData || [])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error

      // Reload appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(
            id,
            full_name,
            email,
            phone,
            date_of_birth,
            gender
          )
        `)
        .eq('doctor_id', user.id)
        .order('scheduled_at', { ascending: false })
        .limit(20)

      setAppointments(appointmentsData || [])
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "in-person":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (doctor && !doctor.is_verified) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Verification Pending</h2>
              <p className="text-muted-foreground mb-4">
                Your doctor account is pending verification by our admin team. You will receive access once your license and credentials are verified.
              </p>
              <p className="text-sm text-muted-foreground">
                This process typically takes 24-48 hours. You will be notified via email once your account is verified.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter(a => 
    a.status === 'scheduled' || a.status === 'confirmed'
  )
  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.scheduled_at)
    const today = new Date()
    return appointmentDate.toDateString() === today.toDateString() && 
           (a.status === 'scheduled' || a.status === 'confirmed')
  })

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Manage your appointments and patients</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center">
              <Stethoscope className="h-4 w-4 mr-2" />
              {doctor?.specialization || "Doctor"}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border hover-lift smooth-transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                  <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift smooth-transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-foreground">{todayAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift smooth-transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift smooth-transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(appointments.map(a => a.patient_id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card className="bg-card border-border hover-lift smooth-transition">
          <CardHeader>
            <CardTitle className="text-card-foreground">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-accent rounded-lg hover-lift smooth-transition">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {appointment.patient?.full_name || "Patient"}
                          </h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(appointment.scheduled_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(appointment.consultation_type)}
                            {appointment.consultation_type}
                          </div>
                          {appointment.patient?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {appointment.patient.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                    {appointment.reason && (
                      <div className="mt-2 p-2 bg-background rounded text-sm">
                        <p className="font-medium text-foreground mb-1">Reason:</p>
                        <p className="text-muted-foreground">{appointment.reason}</p>
                      </div>
                    )}
                    {appointment.patient_notes && (
                      <div className="mt-2 p-2 bg-background rounded text-sm">
                        <p className="font-medium text-foreground mb-1">Patient Notes:</p>
                        <p className="text-muted-foreground">{appointment.patient_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
