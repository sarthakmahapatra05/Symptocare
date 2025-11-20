"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Home,
  Menu,
  X,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Moon,
  Sun,
  FileText,
  LogIn,
  UserPlus,
  Users,
  Phone,
  ChevronRight,
  Mail,
  Clock,
  Shield,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { GoogleGenerativeAI } from "@google/generative-ai"

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [symptomText, setSymptomText] = useState("")
  const [possibleConditions, setPossibleConditions] = useState<string[]>([])
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const { theme, setTheme } = useTheme()

  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { title: "SymptoCare", subtitle: "Your symptoms, our care!" },
    { title: "Smart Diagnosis", subtitle: "Get instant insights into your health symptoms" },
    { title: "Expert Care", subtitle: "Connect with healthcare professionals when needed" },
  ]

  const genAI = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
    : null

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const analyzeSymptoms = async () => {
    if (!symptomText.trim()) return

    try {
      if (!genAI) {
        // Fallback to mock data if no API key
        const fallbackConditions = [
          "Diabetes - A chronic condition that affects how your body processes blood sugar.",
          "Hypertension - High blood pressure that can lead to serious health problems.",
          "Asthma - A condition in which your airways narrow and swell, causing breathing difficulties.",
          "Common Cold - A viral infection of your nose and throat.",
          "Migraine - A headache that can cause severe throbbing pain or a pulsing sensation.",
          "Anemia - A condition where you lack enough healthy red blood cells.",
          "Allergy - An immune system reaction to a foreign substance.",
          "Bronchitis - Inflammation of the lining of your bronchial tubes.",
          "Flu - A contagious respiratory illness caused by influenza viruses.",
          "Gastroenteritis - Inflammation of the stomach and intestines causing vomiting and diarrhea."
        ]
        setPossibleConditions(fallbackConditions)
        setShowResults(true)
        return
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const prompt = `You are a medical assistant. Based on the following symptoms: "${symptomText}", provide a list of 10 possible medical conditions with brief descriptions.`
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse the response text into an array of conditions
      const conditions = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 10)

      setPossibleConditions(conditions)
      setShowResults(true)
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      // Fallback to mock data on error
      const fallbackConditions = [
        "Diabetes - A chronic condition that affects how your body processes blood sugar.",
        "Hypertension - High blood pressure that can lead to serious health problems.",
        "Asthma - A condition in which your airways narrow and swell, causing breathing difficulties.",
        "Common Cold - A viral infection of your nose and throat.",
        "Migraine - A headache that can cause severe throbbing pain or a pulsing sensation.",
        "Anemia - A condition where you lack enough healthy red blood cells.",
        "Allergy - An immune system reaction to a foreign substance.",
        "Bronchitis - Inflammation of the lining of your bronchial tubes.",
        "Flu - A contagious respiratory illness caused by influenza viruses.",
        "Gastroenteritis - Inflammation of the stomach and intestines causing vomiting and diarrhea."
      ]
      setPossibleConditions(fallbackConditions)
      setShowResults(true)
    }
  }

  const selectCondition = (condition: string) => {
    setSelectedCondition(condition)
    const conditionPath = condition.toLowerCase().replace(/\s+/g, "-")
    window.location.href = `/questionnaire/${conditionPath}`
  }

  return (
    <div className="min-h-screen bg-background flex" suppressHydrationWarning>
      {/* Mobile Overlay Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 md:w-16"
        }`}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {isSidebarOpen && <span className="ml-2">Menu</span>}
          </Button>
        </div>

        <nav className="px-4 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-primary hover:bg-sidebar-accent"
            >
              <Home className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">Home</span>}
            </Button>
          </Link>

          <Link href="/fitgram">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Users className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">FitGram</span>}
            </Button>
          </Link>

          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <FileText className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">My Details</span>}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Phone className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Contact Us</span>}
          </Button>
        </nav>
      </div>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16"}`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <p className="text-2xl font-bold text-primary italic professional-heading">SymptoCare</p>
            </div>

            {/* Right: Theme Switch and Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-foreground hover:bg-accent"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground border-border hover:bg-accent bg-transparent"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="bg-gradient-to-br from-accent via-accent/50 to-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <Carousel className="w-full max-w-5xl mx-auto" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="text-center py-6 sm:py-8 md:py-12 carousel-slide">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-primary glow-text mb-3 sm:mb-4 md:mb-6 professional-heading">
                        {slide.title}
                      </h1>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 professional-body italic px-2">"{slide.subtitle}"</p>
                      <div className="mt-6 sm:mt-8 flex justify-center gap-2">
                        {slides.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                              i === currentSlide ? "bg-primary scale-125" : "bg-primary/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Card className="mb-8 bg-card border-border fade-in-up">
            <CardHeader>
            <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground flex items-center gap-2 professional-heading">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Describe Your Symptoms
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground professional-body">
                Tell us what you're experiencing and we'll help identify possible conditions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your symptoms in detail... (e.g., headache, fever, nausea, fatigue)"
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                className="min-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground professional-body"
              />
              <Button
                onClick={analyzeSymptoms}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 professional-body"
                disabled={!symptomText.trim()}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Analyze Symptoms
              </Button>
            </CardContent>
          </Card>

          {showResults && (
            <Card className="mb-8 bg-card border-border fade-in-up">
              <CardHeader>
                <h3 className="text-xl font-semibold text-card-foreground professional-heading">Possible Conditions</h3>
                <p className="text-muted-foreground professional-body">
                  Based on your symptoms, here are 5 possible conditions. Click one to answer more detailed questions.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {possibleConditions.map((condition, index) => (
                    <Card
                      key={condition}
                      className={`cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md ${
                        selectedCondition === condition ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => selectCondition(condition)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-card-foreground professional-heading">{condition}</h4>
                              <p className="text-sm text-muted-foreground professional-body">
                                Click to take detailed questionnaire (50 questions)
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms analyze your symptoms for accurate results
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Detailed Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Answer specific questions to confirm potential conditions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Professional Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Get recommendations for next steps and when to see a doctor
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="bg-gradient-to-r from-card via-accent/20 to-card border-t border-border mt-8 sm:mt-12">
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 professional-heading">SymptoCare</h3>
                <p className="text-muted-foreground mb-4 professional-body text-sm sm:text-base">
                  AI-powered healthcare assistance providing intelligent symptom analysis and professional medical
                  guidance.
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>HIPAA Compliant & Secure</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-card-foreground mb-4 professional-heading flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  Contact Information
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-2 w-2 sm:h-3 sm:w-3" />
                    symptocare@gmail.com
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-2 w-2 sm:h-3 sm:w-3" />
                    +91 720522140
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                    24/7 Support Available
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-card-foreground mb-4 professional-heading text-sm sm:text-base">Quick Links</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors block">
                    About Us
                  </Link>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors block">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors block">
                    Terms of Service
                  </Link>
                  <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors block">
                    Help Center
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground professional-body">
                © 2024 SymptoCare. All rights reserved by @hackodisha 5.0
              </p>
            </div>
          </div>
        </footer>

        {/* Bottom Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 sm:p-4 md:hidden">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Share your symptoms..."
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  className="min-h-[44px] sm:min-h-[50px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                />
              </div>
              <Button
                onClick={analyzeSymptoms}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 sm:px-4 py-2 sm:py-2 h-11 sm:h-11"
                disabled={!symptomText.trim()}
              >
                <Stethoscope className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Check</span>
                <span className="sm:hidden">Go</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom padding to account for fixed bottom section */}
        <div className="h-24"></div>
      </div>
    </div>
  )
}
