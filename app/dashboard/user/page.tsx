"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Stethoscope, Clock, Heart, Activity, Calendar, AlertCircle, CheckCircle, TrendingUp, LogOut, MapPin, Video, Phone } from "lucide-react"
import { signOut, getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

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

        // Fetch appointments from database
        const { data: appointmentsData, error } = await supabase
          .from('appointments')
          .select(`
            *,
            doctor:doctors!appointments_doctor_id_fkey(
              id,
              specialization,
              consultation_fee,
              location,
              profiles:profiles!doctors_id_fkey(full_name, email)
            )
          `)
          .eq('patient_id', currentUser.id)
          .order('scheduled_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setAppointments(appointmentsData || [])
      } catch (error) {
        console.error("Error loading appointments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const analyzeSymptoms = () => {
    if (!symptomText.trim()) return
    router.push("/")
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
            <p className="text-muted-foreground">Track your health and manage symptoms</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center">
              <User className="h-4 w-4 mr-2" />
              Patient
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
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-foreground">
                    {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {appointments.filter(a => a.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift smooth-transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quick Check</p>
                  <Link href="/">
                    <Button size="sm" variant="ghost" className="mt-1 text-primary hover:text-primary/80">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Symptom Check */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Stethoscope className="h-5 w-5 text-primary" />
                Quick Symptom Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your current symptoms..."
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                className="min-h-[100px] bg-input border-border text-foreground"
              />
              <Button
                onClick={analyzeSymptoms}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!symptomText.trim()}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Analyze Symptoms
              </Button>
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="bg-card border-border hover-lift smooth-transition">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-card-foreground">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  My Appointments
                </div>
                <Link href="/appointments">
                  <Button size="sm" variant="outline">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading appointments...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No appointments yet</p>
                  <Link href="/doctors">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-3 bg-accent rounded-lg hover-lift smooth-transition">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {appointment.doctor?.profiles?.full_name || "Dr. Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
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
                        {appointment.doctor?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.doctor.location}
                          </div>
                        )}
                      </div>
                      {appointment.reason && (
                        <p className="text-xs text-muted-foreground mt-2">{appointment.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Progress */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Heart className="h-5 w-5 text-primary" />
              Health Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">Overall Health Score</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">Symptom Resolution Rate</span>
                  <span className="text-sm text-muted-foreground">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">Health Monitoring Consistency</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
