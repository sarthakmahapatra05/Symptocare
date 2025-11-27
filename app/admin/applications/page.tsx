"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Eye,
  Check,
  X,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Stethoscope,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export default function AdminApplicationsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [verificationComment, setVerificationComment] = useState("")

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      try {
        const role = await getCurrentUserRole()
        if (role !== 'admin') {
          router.push("/dashboard")
          return
        }

        await loadApplications()
      } catch (error) {
        console.error("Error:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAndLoad()
  }, [router])

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_applications')
        .select(`
          *,
          user:profiles!doctor_applications_user_id_fkey(
            id,
            full_name,
            email,
            phone
          ),
          doctor:doctors!doctor_applications_doctor_id_fkey(
            id,
            specialization,
            experience_years,
            license_number,
            location,
            consultation_fee,
            qualifications,
            languages,
            bio
          )
        `)
        .order('submitted_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error("Error loading applications:", error)
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: "approved" | "rejected") => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      // Update application status
      const { error: appError } = await supabase
        .from('doctor_applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (appError) throw appError

      // If approved, verify the doctor
      if (newStatus === 'approved') {
        const application = applications.find(a => a.id === applicationId)
        if (application?.doctor?.id) {
          const { error: doctorError } = await supabase
            .from('doctors')
            .update({
              is_verified: true,
              verified_at: new Date().toISOString(),
              verified_by: currentUser.id,
            })
            .eq('id', application.doctor.id)

          if (doctorError) throw doctorError
        }
      }

      // Create approval record
      const { error: approvalError } = await supabase
        .from('approvals')
        .insert({
          application_id: applicationId,
          approved_by: currentUser.id,
          status: newStatus,
          comments: verificationComment || null,
        })

      if (approvalError) throw approvalError

      setVerificationComment("")
      await loadApplications()
      setSelectedApplication(null)
    } catch (error: any) {
      console.error("Error updating application:", error)
      alert(error.message || "Failed to update application")
    }
  }

  const filteredApplications = applications.filter((app) => {
    const name = app.user?.full_name || ""
    const email = app.user?.email || ""
    const specialization = app.doctor?.specialization || ""
    const search = searchTerm.toLowerCase()
    return name.toLowerCase().includes(search) ||
           email.toLowerCase().includes(search) ||
           specialization.toLowerCase().includes(search) ||
           app.license_number?.toLowerCase().includes(search)
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <Link href="/dashboard/admin" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Applications</h1>
          <p className="text-muted-foreground">Review and manage doctor applications for SymptoCare platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground">Applications</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4 mt-4">
                    {filteredApplications.map((application) => (
                      <Card
                        key={application.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${
                          selectedApplication?.id === application.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedApplication(application)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-card-foreground">{application.user?.full_name || "Unknown"}</h3>
                            <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {application.user?.email || "N/A"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-3 w-3" />
                              {application.doctor?.specialization || application.specialization || "N/A"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              Submitted: {new Date(application.submitted_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4 mt-4">
                    {filteredApplications
                      .filter((app) => app.status === "pending")
                      .map((application) => (
                        <Card
                          key={application.id}
                          className={`cursor-pointer transition-colors hover:bg-accent ${
                            selectedApplication?.id === application.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSelectedApplication(application)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-card-foreground">{application.fullName}</h3>
                              <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {application.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-3 w-3" />
                                {application.specializations.join(", ")}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>

                  <TabsContent value="approved" className="space-y-4 mt-4">
                    {filteredApplications
                      .filter((app) => app.status === "approved")
                      .map((application) => (
                        <Card
                          key={application.id}
                          className={`cursor-pointer transition-colors hover:bg-accent ${
                            selectedApplication?.id === application.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSelectedApplication(application)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-card-foreground">{application.fullName}</h3>
                              <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {application.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-3 w-3" />
                                {application.specializations.join(", ")}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>

                  <TabsContent value="rejected" className="space-y-4 mt-4">
                    {filteredApplications
                      .filter((app) => app.status === "rejected")
                      .map((application) => (
                        <Card
                          key={application.id}
                          className={`cursor-pointer transition-colors hover:bg-accent ${
                            selectedApplication?.id === application.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSelectedApplication(application)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-card-foreground">{application.fullName}</h3>
                              <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {application.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-3 w-3" />
                                {application.specializations.join(", ")}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          <div>
            {selectedApplication ? (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Application Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-3">{selectedApplication.user?.full_name || "Unknown"}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {selectedApplication.user?.email || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {selectedApplication.user?.phone || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        License: {selectedApplication.license_number || selectedApplication.doctor?.license_number || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {selectedApplication.doctor?.experience_years || selectedApplication.experience_years || 0} years experience
                      </div>
                      {selectedApplication.doctor?.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Stethoscope className="h-3 w-3" />
                          {selectedApplication.doctor.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-card-foreground mb-2">Specialization</h4>
                    <Badge variant="secondary" className="text-xs">
                      {selectedApplication.doctor?.specialization || selectedApplication.specialization || "N/A"}
                    </Badge>
                  </div>

                  {selectedApplication.doctor?.qualifications && selectedApplication.doctor.qualifications.length > 0 && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Qualifications</h4>
                      <div className="space-y-1">
                        {selectedApplication.doctor.qualifications.map((qual: string, idx: number) => (
                          <div key={idx} className="text-sm text-muted-foreground">• {qual}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApplication.doctor?.bio && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Bio</h4>
                      <p className="text-sm text-muted-foreground">{selectedApplication.doctor.bio}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-card-foreground mb-2">Status</h4>
                    <Badge className={getStatusColor(selectedApplication.status)}>{selectedApplication.status}</Badge>
                  </div>

                  {selectedApplication.status === "pending" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Verification Comments (Optional)</label>
                        <Textarea
                          value={verificationComment}
                          onChange={(e) => setVerificationComment(e.target.value)}
                          placeholder="Add any comments about the verification..."
                          className="bg-input border-border text-foreground min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleStatusUpdate(selectedApplication.id, "approved")}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve & Verify Doctor
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(selectedApplication.id, "rejected")}
                          variant="destructive"
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-border text-foreground hover:bg-accent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Documents
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select an application to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
