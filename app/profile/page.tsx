"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Heart,
  Edit,
  Save,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Home,
  LogOut,
  Menu,
  X,
  MessageSquare,
  FileText,
  HelpCircle,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      // In real app, check with Supabase or your auth provider
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/auth/login")
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      date: "2024-01-15",
      action: "Symptom Analysis Completed",
      details: "Diabetes questionnaire - 85% completion",
      type: "questionnaire",
      severity: "moderate",
    },
    {
      id: 2,
      date: "2024-01-14",
      action: "Doctor Consultation Booked",
      details: "Dr. Sarah Johnson - Jan 20, 2024 at 3:00 PM",
      type: "appointment",
      severity: "info",
    },
    {
      id: 3,
      date: "2024-01-12",
      action: "Health Report Shared",
      details: "Hypertension analysis shared with Dr. Mike Chen",
      type: "report",
      severity: "info",
    },
    {
      id: 4,
      date: "2024-01-10",
      action: "Critical Symptoms Detected",
      details: "Chest pain symptoms - Immediate consultation recommended",
      type: "alert",
      severity: "high",
    },
    {
      id: 5,
      date: "2024-01-08",
      action: "Profile Updated",
      details: "Medical history and emergency contact information updated",
      type: "profile",
      severity: "info",
    },
  ])

  const [profileData, setProfileData] = useState({
    // Personal Information
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    age: "32",
    gender: "male",
    location: "Mumbai, Maharashtra",
    occupation: "Software Engineer",
    profilePicture: "",

    // Health Information
    medicalHistory: "Hypertension (2019), Seasonal allergies",
    currentMedications: "Lisinopril 10mg daily, Cetirizine as needed",
    allergies: "Pollen, Dust mites, Shellfish",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+91 9876543211",
    bloodGroup: "O+",
    height: "175",
    weight: "70",

    // Preferences
    language: "english",
    preferredDoctor: "general",
    consultationPreference: "video",

    // Privacy & Notifications
    emailNotifications: true,
    smsNotifications: false,
    reminderFrequency: "weekly",
    profileVisibility: "private",
    dataSharing: false,
  })

  const [healthMetrics] = useState([
    { date: "2024-01-15", weight: "70kg", bp: "120/80", notes: "Regular checkup" },
    { date: "2024-01-01", weight: "71kg", bp: "125/82", notes: "New Year health check" },
    { date: "2023-12-15", weight: "72kg", bp: "118/78", notes: "Monthly monitoring" },
  ])

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      setCameraStream(stream)
      setShowCamera(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera permission denied:", error)
      alert(
        "Camera permission is required to take a profile photo. Please enable camera access in your browser settings.",
      )
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8)
        updateField("profilePicture", photoDataUrl)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
  }

  const updateField = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log(`[v0] Profile updated:`, profileData)
    setIsEditing(false)
    // In real app, this would save to backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    stopCamera()
    // Reset any unsaved changes
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "questionnaire":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "report":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "alert":
        return <Activity className="h-4 w-4 text-red-500" />
      case "profile":
        return <User className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4 text-primary" />
    }
  }

  const getActivityBadgeColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const renderPersonalInfo = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Personal Information</h3>
        <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)} className="smooth-transition hover-scale text-xs sm:text-sm w-full sm:w-auto">
          {isEditing ? <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" /> : <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Picture with Camera */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
            {profileData.profilePicture ? (
              <img
                src={profileData.profilePicture || "/placeholder.svg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-primary" />
            )}
          </div>
          {isEditing && (
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-background border-2"
              onClick={requestCameraPermission}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{profileData.name}</h4>
          <p className="text-sm text-muted-foreground">{profileData.email}</p>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Take Profile Photo</h3>
              <Button variant="ghost" size="sm" onClick={stopCamera}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground text-sm sm:text-base">
            Full Name
          </Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={!isEditing}
            className="bg-input border-border text-foreground text-sm sm:text-base smooth-transition"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => updateField("email", e.target.value)}
              disabled={!isEditing}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              disabled={!isEditing}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-foreground">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            value={profileData.age}
            onChange={(e) => updateField("age", e.target.value)}
            disabled={!isEditing}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Gender</Label>
          <Select
            value={profileData.gender}
            onValueChange={(value) => updateField("gender", value)}
            disabled={!isEditing}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-foreground">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              value={profileData.location}
              onChange={(e) => updateField("location", e.target.value)}
              disabled={!isEditing}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation" className="text-foreground">
          Occupation
        </Label>
        <Input
          id="occupation"
          value={profileData.occupation}
          onChange={(e) => updateField("occupation", e.target.value)}
          disabled={!isEditing}
          className="bg-input border-border text-foreground"
        />
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale w-full sm:w-auto text-sm">
            <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleCancel} className="smooth-transition w-full sm:w-auto text-sm">
            Cancel
          </Button>
        </div>
      )}
    </div>
  )

  const renderHealthInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Health Information</h3>
        <Button variant="outline" size="sm" onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}>
          {showSensitiveInfo ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showSensitiveInfo ? "Hide" : "Show"} Sensitive Info
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="blood-group" className="text-foreground text-sm sm:text-base">
            Blood Group
          </Label>
          <Select
            value={profileData.bloodGroup}
            onValueChange={(value) => updateField("bloodGroup", value)}
            disabled={!isEditing}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-foreground">
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            value={profileData.height}
            onChange={(e) => updateField("height", e.target.value)}
            disabled={!isEditing}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-foreground">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={profileData.weight}
            onChange={(e) => updateField("weight", e.target.value)}
            disabled={!isEditing}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      {showSensitiveInfo && (
        <div className="space-y-4 p-4 bg-accent rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="medical-history" className="text-foreground">
              Medical History
            </Label>
            <Textarea
              id="medical-history"
              value={profileData.medicalHistory}
              onChange={(e) => updateField("medicalHistory", e.target.value)}
              disabled={!isEditing}
              className="bg-input border-border text-foreground min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications" className="text-foreground">
              Current Medications
            </Label>
            <Textarea
              id="medications"
              value={profileData.currentMedications}
              onChange={(e) => updateField("currentMedications", e.target.value)}
              disabled={!isEditing}
              className="bg-input border-border text-foreground min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-foreground">
              Allergies
            </Label>
            <Input
              id="allergies"
              value={profileData.allergies}
              onChange={(e) => updateField("allergies", e.target.value)}
              disabled={!isEditing}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency-contact" className="text-foreground">
                Emergency Contact
              </Label>
              <Input
                id="emergency-contact"
                value={profileData.emergencyContact}
                onChange={(e) => updateField("emergencyContact", e.target.value)}
                disabled={!isEditing}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency-phone" className="text-foreground">
                Emergency Phone
              </Label>
              <Input
                id="emergency-phone"
                type="tel"
                value={profileData.emergencyPhone}
                onChange={(e) => updateField("emergencyPhone", e.target.value)}
                disabled={!isEditing}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {/* Health Metrics History */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Recent Health Metrics</h4>
        <div className="space-y-3">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="bg-accent border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{metric.date}</p>
                      <p className="text-sm text-muted-foreground">
                        Weight: {metric.weight} | BP: {metric.bp}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.notes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Preferences & Settings</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground">Preferred Language</Label>
          <Select value={profileData.language} onValueChange={(value) => updateField("language", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
              <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Preferred Doctor Type</Label>
          <Select value={profileData.preferredDoctor} onValueChange={(value) => updateField("preferredDoctor", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Practitioner</SelectItem>
              <SelectItem value="specialist">Specialist</SelectItem>
              <SelectItem value="no-preference">No Preference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Consultation Preference</Label>
          <Select
            value={profileData.consultationPreference}
            onValueChange={(value) => updateField("consultationPreference", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video Consultation</SelectItem>
              <SelectItem value="phone">Phone Consultation</SelectItem>
              <SelectItem value="in-person">In-Person Visit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Notifications</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive health updates via email</p>
            </div>
            <Switch
              checked={profileData.emailNotifications}
              onCheckedChange={(checked) => updateField("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Receive urgent alerts via SMS</p>
            </div>
            <Switch
              checked={profileData.smsNotifications}
              onCheckedChange={(checked) => updateField("smsNotifications", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Reminder Frequency</Label>
            <Select
              value={profileData.reminderFrequency}
              onValueChange={(value) => updateField("reminderFrequency", value)}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="as-needed">As Needed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Privacy Settings</h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Profile Visibility</Label>
            <Select
              value={profileData.profileVisibility}
              onValueChange={(value) => updateField("profileVisibility", value)}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="doctors-only">Doctors Only</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Data Sharing for Research</p>
              <p className="text-sm text-muted-foreground">Help improve healthcare with anonymized data</p>
            </div>
            <Switch
              checked={profileData.dataSharing}
              onCheckedChange={(checked) => updateField("dataSharing", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {recentActivity.length} Activities
        </Badge>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <Card key={activity.id} className="bg-accent border-border hover-lift smooth-transition fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">{activity.action}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className={`text-xs ${getActivityBadgeColor(activity.severity)}`}>
                        {activity.severity}
                      </Badge>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{activity.details}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recentActivity.length === 0 && (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent activity found</p>
          <p className="text-sm text-muted-foreground">Your health activities will appear here</p>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground text-red-600">Danger Zone</h4>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Delete Account</p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-2 sm:top-4 left-2 sm:left-4 z-40 fade-in">
        <div className="flex items-center gap-1 sm:gap-2 bg-background/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border smooth-transition hover-scale">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm sm:text-lg text-primary">SymptoCare</span>
        </div>
      </div>

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 z-30 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/")}>
              <Home className="h-4 w-4 mr-3" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/fitgram")}>
              <Activity className="h-4 w-4 mr-3" />
              FitGram
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <User className="h-4 w-4 mr-3" />
              My Details
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/contact")}>
              <HelpCircle className="h-4 w-4 mr-3" />
              Contact Us
            </Button>
          </nav>

          <Separator />

          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
            onClick={() => {
              localStorage.removeItem("auth_token")
              router.push("/auth/login")
            }}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-2 sm:top-4 left-16 sm:left-20 z-40 bg-background/80 backdrop-blur-sm smooth-transition hover-scale p-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-20" onClick={() => setIsSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="p-4 sm:p-6 pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your personal information and preferences</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Patient Profile
            </Badge>
          </div>

          <Tabs defaultValue="personal" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
              <TabsTrigger value="personal" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Health</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
                <CardContent className="p-4 sm:p-6">{renderPersonalInfo()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health">
              <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
                <CardContent className="p-4 sm:p-6">{renderHealthInfo()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
                <CardContent className="p-4 sm:p-6">{renderPreferences()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="bg-card border-border fade-in-up hover-lift smooth-transition">
                <CardContent className="p-4 sm:p-6">{renderActivity()}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
