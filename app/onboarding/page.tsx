"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, User, Heart, Bell, CheckCircle, Stethoscope, Target, Settings } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

type OnboardingStep = "welcome" | "profile" | "health" | "preferences" | "goals" | "notifications" | "complete"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("welcome")
  const [onboardingData, setOnboardingData] = useState({
    // Profile data
    name: "",
    age: "",
    gender: "",
    location: "",
    occupation: "",

    // Health data
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Preferences
    language: "",
    preferredDoctor: "",
    consultationPreference: "",

    // Goals
    healthGoals: [] as string[],
    symptomTracking: [] as string[],

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    reminderFrequency: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const steps = ["welcome", "profile", "health", "preferences", "goals", "notifications", "complete"]
  const currentStepIndex = steps.indexOf(step)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const nextStep = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as OnboardingStep)
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as OnboardingStep)
    }
  }

  const handleCompleteOnboarding = async () => {
    setIsLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) {
        alert("You must be logged in to complete onboarding.")
        setIsLoading(false)
        return
      }

      // Update profile in profiles table
      const { error } = await supabase.from("profiles").update({
        full_name: onboardingData.name,
        age: parseInt(onboardingData.age) || null,
        gender: onboardingData.gender,
        location: onboardingData.location,
        occupation: onboardingData.occupation,
        medical_history: onboardingData.medicalHistory,
        current_medications: onboardingData.currentMedications,
        allergies: onboardingData.allergies,
        emergency_contact: onboardingData.emergencyContact,
        emergency_phone: onboardingData.emergencyPhone,
        preferred_language: onboardingData.language,
        preferred_doctor: onboardingData.preferredDoctor,
        consultation_preference: onboardingData.consultationPreference,
        health_goals: onboardingData.healthGoals,
        symptom_tracking: onboardingData.symptomTracking,
        email_notifications: onboardingData.emailNotifications,
        sms_notifications: onboardingData.smsNotifications,
        reminder_frequency: onboardingData.reminderFrequency,
        onboarding_completed: true,
      }).eq("id", user.id)

      if (error) {
        throw error
      }

      alert("Profile setup completed successfully!")
      // Redirect to appropriate dashboard based on user type
      router.push("/dashboard/user")
    } catch (error: any) {
      alert("Failed to complete onboarding: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateData = (field: string, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: string, item: string) => {
    setOnboardingData((prev) => {
      const currentValue = prev[field as keyof typeof prev];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: currentValue.includes(item)
            ? currentValue.filter((i) => i !== item)
            : [...currentValue, item],
        };
      }
      return prev;
    });
  }

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
        <Stethoscope className="h-12 w-12 text-primary" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to SymptoCare!</h2>
        <p className="text-muted-foreground text-lg">
          Let's set up your profile to provide you with personalized healthcare assistance
        </p>
      </div>
      <div className="bg-accent p-4 rounded-lg">
        <p className="text-sm text-foreground">
          This setup will take about 5 minutes and will help us provide better symptom analysis and health
          recommendations.
        </p>
      </div>
      <Button onClick={nextStep} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Get Started
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  const renderProfileStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-card-foreground">
            Full Name *
          </Label>
          <Input
            id="name"
            value={onboardingData.name}
            onChange={(e) => updateData("name", e.target.value)}
            placeholder="Enter your full name"
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age" className="text-card-foreground">
            Age *
          </Label>
          <Input
            id="age"
            type="number"
            value={onboardingData.age}
            onChange={(e) => updateData("age", e.target.value)}
            placeholder="Your age"
            className="bg-input border-border text-foreground"
            min="1"
            max="120"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-card-foreground">Gender *</Label>
        <Select value={onboardingData.gender} onValueChange={(value) => updateData("gender", value)}>
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-card-foreground">
            Location
          </Label>
          <Input
            id="location"
            value={onboardingData.location}
            onChange={(e) => updateData("location", e.target.value)}
            placeholder="City, State"
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-card-foreground">
            Occupation
          </Label>
          <Input
            id="occupation"
            value={onboardingData.occupation}
            onChange={(e) => updateData("occupation", e.target.value)}
            placeholder="Your profession"
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>
    </div>
  )

  const renderHealthStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="medical-history" className="text-card-foreground">
          Medical History
        </Label>
        <Textarea
          id="medical-history"
          value={onboardingData.medicalHistory}
          onChange={(e) => updateData("medicalHistory", e.target.value)}
          placeholder="Any chronic conditions, past surgeries, or significant medical events..."
          className="bg-input border-border text-foreground min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications" className="text-card-foreground">
          Current Medications
        </Label>
        <Textarea
          id="medications"
          value={onboardingData.currentMedications}
          onChange={(e) => updateData("currentMedications", e.target.value)}
          placeholder="List any medications you're currently taking..."
          className="bg-input border-border text-foreground min-h-[60px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies" className="text-card-foreground">
          Allergies
        </Label>
        <Input
          id="allergies"
          value={onboardingData.allergies}
          onChange={(e) => updateData("allergies", e.target.value)}
          placeholder="Food, drug, or environmental allergies"
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergency-contact" className="text-card-foreground">
            Emergency Contact
          </Label>
          <Input
            id="emergency-contact"
            value={onboardingData.emergencyContact}
            onChange={(e) => updateData("emergencyContact", e.target.value)}
            placeholder="Contact person name"
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency-phone" className="text-card-foreground">
            Emergency Phone
          </Label>
          <Input
            id="emergency-phone"
            type="tel"
            value={onboardingData.emergencyPhone}
            onChange={(e) => updateData("emergencyPhone", e.target.value)}
            placeholder="Emergency contact number"
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>
    </div>
  )

  const renderPreferencesStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-card-foreground">Preferred Language</Label>
        <Select value={onboardingData.language} onValueChange={(value) => updateData("language", value)}>
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Select your preferred language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
            <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
            <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
            <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
            <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
            <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
            <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-card-foreground">Preferred Doctor Type</Label>
        <RadioGroup
          value={onboardingData.preferredDoctor}
          onValueChange={(value) => updateData("preferredDoctor", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" />
            <Label htmlFor="general">General Practitioner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="specialist" id="specialist" />
            <Label htmlFor="specialist">Specialist (when needed)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no-preference" id="no-preference" />
            <Label htmlFor="no-preference">No Preference</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-card-foreground">Consultation Preference</Label>
        <RadioGroup
          value={onboardingData.consultationPreference}
          onValueChange={(value) => updateData("consultationPreference", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video">Video Consultation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone">Phone Consultation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-person" id="in-person" />
            <Label htmlFor="in-person">In-Person Visit</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )

  const renderGoalsStep = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-card-foreground text-lg">Health Goals</Label>
        <p className="text-sm text-muted-foreground">Select what you'd like to focus on:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "General Health Monitoring",
            "Chronic Condition Management",
            "Preventive Care",
            "Mental Health Support",
            "Fitness & Wellness",
            "Medication Management",
          ].map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox
                id={goal}
                checked={onboardingData.healthGoals.includes(goal)}
                onCheckedChange={() => toggleArrayItem("healthGoals", goal)}
              />
              <Label htmlFor={goal} className="text-sm">
                {goal}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-card-foreground text-lg">Symptom Tracking Interests</Label>
        <p className="text-sm text-muted-foreground">What symptoms would you like to track?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Headaches & Migraines",
            "Digestive Issues",
            "Sleep Patterns",
            "Mood & Anxiety",
            "Pain Management",
            "Respiratory Symptoms",
          ].map((symptom) => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox
                id={symptom}
                checked={onboardingData.symptomTracking.includes(symptom)}
                onCheckedChange={() => toggleArrayItem("symptomTracking", symptom)}
              />
              <Label htmlFor={symptom} className="text-sm">
                {symptom}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderNotificationsStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-card-foreground text-lg">Notification Preferences</Label>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Health reminders and updates</p>
              </div>
            </div>
            <Checkbox
              checked={onboardingData.emailNotifications}
              onCheckedChange={(checked) => updateData("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Urgent health alerts</p>
              </div>
            </div>
            <Checkbox
              checked={onboardingData.smsNotifications}
              onCheckedChange={(checked) => updateData("smsNotifications", checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-card-foreground">Reminder Frequency</Label>
          <Select
            value={onboardingData.reminderFrequency}
            onValueChange={(value) => updateData("reminderFrequency", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="How often would you like health reminders?" />
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
  )

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Setup Complete!</h2>
        <p className="text-muted-foreground text-lg">
          Your SymptoCare profile is ready. You can now start using our AI-powered symptom analysis.
        </p>
      </div>
      <div className="bg-accent p-4 rounded-lg space-y-2">
        <p className="text-sm text-foreground font-medium">What's Next?</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Start tracking your symptoms</li>
          <li>• Get personalized health insights</li>
          <li>• Connect with healthcare professionals</li>
          <li>• Access your health dashboard</li>
        </ul>
      </div>
      <Button
        onClick={handleCompleteOnboarding}
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? "Setting up your account..." : "Go to Dashboard"}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  const getStepIcon = () => {
    switch (step) {
      case "welcome":
        return <Stethoscope className="h-8 w-8 text-primary" />
      case "profile":
        return <User className="h-8 w-8 text-primary" />
      case "health":
        return <Heart className="h-8 w-8 text-primary" />
      case "preferences":
        return <Settings className="h-8 w-8 text-primary" />
      case "goals":
        return <Target className="h-8 w-8 text-primary" />
      case "notifications":
        return <Bell className="h-8 w-8 text-primary" />
      case "complete":
        return <CheckCircle className="h-8 w-8 text-green-600" />
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case "welcome":
        return "Welcome"
      case "profile":
        return "Personal Information"
      case "health":
        return "Health Information"
      case "preferences":
        return "Preferences"
      case "goals":
        return "Health Goals"
      case "notifications":
        return "Notifications"
      case "complete":
        return "All Set!"
    }
  }

  const canProceed = () => {
    switch (step) {
      case "welcome":
        return true
      case "profile":
        return onboardingData.name && onboardingData.age && onboardingData.gender
      case "health":
        return true // All fields optional
      case "preferences":
        return onboardingData.language
      case "goals":
        return true // Optional selections
      case "notifications":
        return true
      case "complete":
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">{getStepIcon()}</div>
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground">{getStepTitle()}</CardTitle>

          {/* Progress bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "welcome" && renderWelcomeStep()}
          {step === "profile" && renderProfileStep()}
          {step === "health" && renderHealthStep()}
          {step === "preferences" && renderPreferencesStep()}
          {step === "goals" && renderGoalsStep()}
          {step === "notifications" && renderNotificationsStep()}
          {step === "complete" && renderCompleteStep()}

          {step !== "welcome" && step !== "complete" && (
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep} className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
              >
                {step === "notifications" ? "Finish" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step !== "welcome" && step !== "complete" && (
            <div className="text-center pt-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Skip for now
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
