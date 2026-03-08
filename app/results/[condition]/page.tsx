"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  Calendar,
  Share2,
  Download,
  ArrowRight,
  Activity,
  TrendingUp,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"

interface SeverityData {
  [key: string]: string | number
  name: string
  value: number
  color: string
}

interface RecommendationLevel {
  level: "can" | "should" | "must"
  title: string
  description: string
  urgency: "low" | "medium" | "high"
  icon: React.ReactNode
  timeframe: string
  actions: string[]
}

interface SymptomAnalysis {
  category: string
  severity: number
  weight: number
  riskFactors: string[]
}

interface RiskAssessment {
  overallRisk: number
  criticalSymptoms: string[]
  moderateSymptoms: string[]
  mildSymptoms: string[]
  redFlags: string[]
  confidenceLevel: number
}

export default function ResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const condition = params.condition as string
  const answersParam = searchParams.get("answers")

  const [answers, setAnswers] = useState<any>({})
  const [severityScore, setSeverityScore] = useState(0)
  const [recommendation, setRecommendation] = useState<RecommendationLevel | null>(null)
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [symptomAnalysis, setSymptomAnalysis] = useState<SymptomAnalysis[]>([])

  useEffect(() => {
    if (answersParam) {
      try {
        const parsedAnswers = JSON.parse(decodeURIComponent(answersParam))
        setAnswers(parsedAnswers)

        const analysis = performDetailedAnalysis(parsedAnswers, condition)
        setSeverityScore(analysis.overallRisk)
        setRiskAssessment(analysis)

        const symptoms = analyzeSymptomCategories(parsedAnswers, condition)
        setSymptomAnalysis(symptoms)

        const rec = getEnhancedRecommendationLevel(analysis)
        setRecommendation(rec)
      } catch (error) {
        console.error("Error parsing answers:", error)
      }
    }
  }, [answersParam, condition])

  const performDetailedAnalysis = (answers: any, condition: string): RiskAssessment => {
    let totalScore = 0
    let maxPossibleScore = 0
    const criticalSymptoms: string[] = []
    const moderateSymptoms: string[] = []
    const mildSymptoms: string[] = []
    const redFlags: string[] = []

    // Define condition-specific critical indicators
    const criticalIndicators = getCriticalIndicators(condition)
    const moderateIndicators = getModerateIndicators(condition)

    Object.entries(answers).forEach(([questionId, answer]) => {
      const questionNum = Number.parseInt(questionId)
      let questionScore = 0
      let questionWeight = 1

      // Assign higher weights to critical questions
      if (criticalIndicators.includes(questionNum)) {
        questionWeight = 3
      } else if (moderateIndicators.includes(questionNum)) {
        questionWeight = 2
      }

      if (typeof answer === "string") {
        if (answer.includes("Severe") || answer.includes("High") || answer.includes("Extreme")) {
          questionScore = 10
          if (questionWeight === 3) {
            criticalSymptoms.push(answer)
            redFlags.push(`Severe ${getQuestionCategory(questionNum)}: ${answer}`)
          } else {
            moderateSymptoms.push(answer)
          }
        } else if (answer.includes("Moderate") || answer.includes("Medium")) {
          questionScore = 6
          moderateSymptoms.push(answer)
        } else if (answer.includes("Mild") || answer.includes("Low") || answer.includes("Slight")) {
          questionScore = 3
          mildSymptoms.push(answer)
        } else if (answer.includes("No") || answer.includes("Normal")) {
          questionScore = 0
        } else {
          questionScore = 4 // Default for other responses
        }
      } else if (typeof answer === "number") {
        questionScore = answer
        if (answer >= 8 && questionWeight === 3) {
          redFlags.push(`High severity rating: ${answer}/10`)
        }
      } else if (Array.isArray(answer)) {
        questionScore = Math.min(answer.length * 2, 10)
        if (answer.length >= 4) {
          moderateSymptoms.push(`Multiple symptoms: ${answer.join(", ")}`)
        }
      }

      totalScore += questionScore * questionWeight
      maxPossibleScore += 10 * questionWeight
    })

    const overallRisk = Math.min((totalScore / maxPossibleScore) * 100, 100)

    // Calculate confidence based on number of answers and consistency
    const answerCount = Object.keys(answers).length
    const confidenceLevel = Math.min((answerCount / 50) * 100, 100)

    return {
      overallRisk: Math.round(overallRisk),
      criticalSymptoms,
      moderateSymptoms,
      mildSymptoms,
      redFlags,
      confidenceLevel: Math.round(confidenceLevel),
    }
  }

  const analyzeSymptomCategories = (answers: any, condition: string): SymptomAnalysis[] => {
    const categories = [
      { name: "Pain & Discomfort", questions: [1, 3, 7, 15, 30], weight: 2.5 },
      { name: "Respiratory", questions: [2, 5, 11, 24, 25], weight: 3.0 },
      { name: "Neurological", questions: [6, 12, 27, 28], weight: 2.8 },
      { name: "Gastrointestinal", questions: [9, 26], weight: 2.2 },
      { name: "General Health", questions: [8, 10, 20, 29], weight: 2.0 },
      { name: "Sensory", questions: [13, 14, 22, 23], weight: 2.3 },
    ]

    return categories.map((category) => {
      let categoryScore = 0
      let answeredQuestions = 0
      const riskFactors: string[] = []

      category.questions.forEach((qNum) => {
        const answer = answers[qNum]
        if (answer) {
          answeredQuestions++
          let score = 0

          if (typeof answer === "string") {
            if (answer.includes("Severe") || answer.includes("High")) {
              score = 10
              riskFactors.push(`Severe ${category.name.toLowerCase()}`)
            } else if (answer.includes("Moderate")) {
              score = 6
            } else if (answer.includes("Mild")) {
              score = 3
            }
          } else if (typeof answer === "number") {
            score = answer
            if (answer >= 8) {
              riskFactors.push(`High ${category.name.toLowerCase()} severity`)
            }
          }

          categoryScore += score
        }
      })

      const averageScore = answeredQuestions > 0 ? categoryScore / answeredQuestions : 0

      return {
        category: category.name,
        severity: Math.round(averageScore * 10),
        weight: category.weight,
        riskFactors,
      }
    })
  }

  const getEnhancedRecommendationLevel = (assessment: RiskAssessment): RecommendationLevel => {
    const { overallRisk, redFlags, criticalSymptoms } = assessment

    if (overallRisk >= 75 || redFlags.length >= 3 || criticalSymptoms.length >= 2) {
      return {
        level: "must",
        title: "Must Consult a Doctor Immediately",
        description:
          "Your symptoms indicate a potentially serious condition requiring immediate medical evaluation. Do not delay seeking professional care.",
        urgency: "high",
        timeframe: "Within 2-4 hours",
        icon: <AlertTriangle className="h-5 w-5" />,
        actions: [
          "Contact your doctor immediately or go to emergency room",
          "Do not drive yourself if symptoms are severe",
          "Bring a list of current medications",
          "Have someone accompany you if possible",
        ],
      }
    } else if (overallRisk >= 45 || redFlags.length >= 1 || criticalSymptoms.length >= 1) {
      return {
        level: "should",
        title: "Should Consult a Doctor Soon",
        description:
          "Your symptoms suggest a condition that warrants professional medical evaluation within the next day or two.",
        urgency: "medium",
        timeframe: "Within 24-48 hours",
        icon: <Clock className="h-5 w-5" />,
        actions: [
          "Schedule an appointment with your primary care doctor",
          "Monitor symptoms closely for any worsening",
          "Keep a symptom diary",
          "Avoid strenuous activities until evaluated",
        ],
      }
    } else {
      return {
        level: "can",
        title: "Can Monitor or Consult if Needed",
        description:
          "Your symptoms appear mild to moderate. Continue monitoring and consider consulting a doctor if symptoms persist or worsen.",
        urgency: "low",
        timeframe: "Within 1-2 weeks if symptoms persist",
        icon: <CheckCircle className="h-5 w-5" />,
        actions: [
          "Continue with appropriate home care measures",
          "Monitor symptoms for any changes",
          "Maintain good hydration and rest",
          "Consult a doctor if symptoms worsen or persist beyond expected timeframe",
        ],
      }
    }
  }

  const getCriticalIndicators = (condition: string): number[] => {
    const indicators: { [key: string]: number[] } = {
      "common-cold": [4, 11, 25], // Fever, breathing difficulty, blood in phlegm
      "seasonal-allergies": [11, 23], // Breathing difficulty, severe eye symptoms
      "migraine-headache": [3, 12, 27], // Severe pain, dizziness, concentration issues
      gastroenteritis: [9, 26, 31], // Nausea, abdominal pain, dehydration
      "anxiety-disorder": [27, 28, 29], // Concentration, weakness, mood changes
    }
    return indicators[condition] || []
  }

  const getModerateIndicators = (condition: string): number[] => {
    const indicators: { [key: string]: number[] } = {
      "common-cold": [1, 2, 5, 8], // Duration, symptoms, congestion, energy
      "seasonal-allergies": [1, 2, 13, 14], // Duration, symptoms, taste, smell
      "migraine-headache": [1, 6, 8, 10], // Duration, appetite, energy, sleep
      gastroenteritis: [1, 6, 8, 10], // Duration, appetite, energy, sleep
      "anxiety-disorder": [1, 8, 10, 39], // Duration, energy, sleep, stress
    }
    return indicators[condition] || []
  }

  const getQuestionCategory = (questionNum: number): string => {
    if ([1, 3, 7, 15, 30].includes(questionNum)) return "pain/discomfort"
    if ([2, 5, 11, 24, 25].includes(questionNum)) return "respiratory symptoms"
    if ([6, 12, 27, 28].includes(questionNum)) return "neurological symptoms"
    if ([9, 26].includes(questionNum)) return "gastrointestinal symptoms"
    return "general symptoms"
  }

  const severityData: SeverityData[] = [
    {
      name: "Likelihood of Condition",
      value: severityScore,
      color: severityScore >= 70 ? "#ef4444" : severityScore >= 40 ? "#f59e0b" : "#10b981",
    },
    {
      name: "Uncertainty",
      value: 100 - severityScore,
      color: "#e5e7eb",
    },
  ]

  const symptomChartData = symptomAnalysis.map((analysis) => ({
    category: analysis.category,
    severity: analysis.severity,
    weight: analysis.weight,
  }))

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const shareReport = () => {
    // In real app, this would generate a shareable report
    alert("Report sharing functionality would be implemented here")
  }

  const downloadReport = () => {
    // In real app, this would generate a PDF report
    alert("Report download functionality would be implemented here")
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Comprehensive Assessment Results</h1>
          <p className="text-muted-foreground capitalize">Results for: {condition.replace("-", " ")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Risk Score */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Overall Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-card-foreground mb-2">{severityScore}%</div>
                <Progress value={severityScore} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Risk Level: {severityScore >= 70 ? "High" : severityScore >= 40 ? "Medium" : "Low"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Level */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Analysis Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-card-foreground mb-2">
                  {riskAssessment?.confidenceLevel || 0}%
                </div>
                <Progress value={riskAssessment?.confidenceLevel || 0} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">Based on {Object.keys(answers).length} responses</p>
              </div>
            </CardContent>
          </Card>

          {/* Red Flags */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Critical Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-card-foreground mb-2">
                  {riskAssessment?.redFlags.length || 0}
                </div>
                <p className="text-sm text-muted-foreground mb-2">Red flags identified</p>
                {(riskAssessment?.redFlags.length || 0) > 0 && (
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    Requires attention
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Condition Likelihood Pie Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Condition Likelihood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1">{severityScore}%</div>
                <p className="text-sm text-muted-foreground">Likelihood of having {condition.replace("-", " ")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Symptom Category Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={symptomChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={10} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="severity" fill="#1aa6a0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recommendation */}
        {recommendation && (
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                {recommendation.icon}
                Medical Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-card-foreground text-lg">{recommendation.title}</h3>
                  <Badge className={getUrgencyColor(recommendation.urgency)}>{recommendation.urgency} priority</Badge>
                </div>
                <p className="text-muted-foreground mb-2">{recommendation.description}</p>
                <p className="text-sm font-medium text-card-foreground">
                  Recommended timeframe: {recommendation.timeframe}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-card-foreground mb-3">Recommended Actions:</h4>
                <div className="space-y-2">
                  {recommendation.actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              {recommendation.level !== "can" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <User className="h-4 w-4 mr-2" />
                    Find Nearby Doctors
                  </Button>
                  <Button variant="outline" className="bg-transparent border-border text-foreground hover:bg-accent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Detailed Clinical Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {riskAssessment?.redFlags && riskAssessment.redFlags.length > 0 && (
              <div>
                <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Findings
                </h3>
                <div className="space-y-2">
                  {riskAssessment.redFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <p className="text-sm text-red-800 dark:text-red-300">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-card-foreground mb-3">Symptom Severity Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {riskAssessment?.criticalSymptoms && riskAssessment.criticalSymptoms.length > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Critical Symptoms</h4>
                    <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                      {riskAssessment.criticalSymptoms.slice(0, 3).map((symptom, index) => (
                        <li key={index}>• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {riskAssessment?.moderateSymptoms && riskAssessment.moderateSymptoms.length > 0 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Moderate Symptoms</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                      {riskAssessment.moderateSymptoms.slice(0, 3).map((symptom, index) => (
                        <li key={index}>• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {riskAssessment?.mildSymptoms && riskAssessment.mildSymptoms.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Mild Symptoms</h4>
                    <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                      {riskAssessment.mildSymptoms.slice(0, 3).map((symptom, index) => (
                        <li key={index}>• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={shareReport}
            variant="outline"
            className="bg-transparent border-border text-foreground hover:bg-accent"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with Doctor
          </Button>
          <Button
            onClick={downloadReport}
            variant="outline"
            className="bg-transparent border-border text-foreground hover:bg-accent"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Link href="/chat">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with Doctor
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">Important Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This assessment is for informational purposes only and should not replace professional medical advice,
                  diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns. If
                  you're experiencing a medical emergency, call emergency services immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
