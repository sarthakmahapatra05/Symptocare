"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Activity, ArrowRight, Brain, Calendar, Clock3, ShieldCheck, Sparkles, Stethoscope, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type Condition = {
  name: string
  description: string
  specialist?: string
  department?: string
}

const fallbackConditions: Condition[] = [
  {
    name: "Diabetes",
    description: "A chronic condition that affects blood sugar regulation.",
    specialist: "Endocrinologist",
    department: "Endocrinology",
  },
  {
    name: "Hypertension",
    description: "Elevated blood pressure that requires monitoring and treatment.",
    specialist: "Cardiologist",
    department: "Cardiology",
  },
  {
    name: "Asthma",
    description: "Airway inflammation that can cause wheezing and breathing difficulty.",
    specialist: "Pulmonologist",
    department: "Pulmonology",
  },
]

export default function HomePage() {
  const [symptomText, setSymptomText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [conditions, setConditions] = useState<Condition[]>([])
  const [error, setError] = useState("")

  const featureGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.to(".orbital", {
        y: -18,
        duration: 2.8,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      if (featureGridRef.current) {
        gsap.fromTo(
          featureGridRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featureGridRef.current,
              start: "top 82%",
            },
          },
        )
      }
    })

    return () => ctx.revert()
  }, [])

  const handleAnalyzeSymptoms = useCallback(async () => {
    if (!symptomText.trim()) return

    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomText }),
      })

      if (!response.ok) {
        throw new Error("Could not analyze symptoms right now.")
      }

      const data = await response.json()
      const normalized: Condition[] = (data.conditions ?? []).slice(0, 5).map((condition: any) => ({
        name: condition.name ?? "Possible condition",
        description: condition.description ?? "Additional details are unavailable.",
        specialist: condition.recommended_specialist,
        department: condition.recommended_department,
      }))

      setConditions(normalized.length > 0 ? normalized : fallbackConditions)
      if (data.error) {
        setError(String(data.error))
      }
    } catch {
      setConditions(fallbackConditions)
      setError("Live analysis failed. Check ML service at http://127.0.0.1:5000 and try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }, [symptomText])

  const getDoctorRoute = (specialist?: string) => {
    if (!specialist?.trim()) return "/doctors"
    return `/doctors?specialization=${encodeURIComponent(specialist.trim())}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen"
    >
      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:pt-12">
        <section className="grid items-center gap-8 md:grid-cols-[1.08fr_0.92fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-700/20 bg-teal-500/10 px-3 py-1 text-sm text-teal-900"
            >
              <Sparkles className="h-4 w-4" />
              AI-first preventive care
            </motion.div>

            <h1 className="text-balance text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Better health starts with a smarter first step
            </h1>

            <motion.p
              className="mt-5 max-w-xl text-lg text-slate-700"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55 }}
            >
              Describe symptoms, get triage-level suggestions, connect with doctors, and manage wellness in one place.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.55 }}
            >
              <Link href="/doctors">
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                  Find Doctors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/medicine-store">
                <Button variant="outline" className="border-slate-300 bg-white/80">
                  Medicine Store
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="glass-panel relative overflow-hidden p-4"
          >
            <div className="pointer-events-none absolute -left-4 top-6 h-24 w-24 rounded-full bg-teal-400/30 blur-xl orbital" />
            <div className="pointer-events-none absolute bottom-5 right-4 h-20 w-20 rounded-full bg-cyan-400/25 blur-xl orbital" />
            <div className="relative h-[340px] overflow-hidden rounded-2xl">
              <Image src="/carousel3.jpg" alt="Doctor consultation" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </motion.div>
        </section>

        <section className="mt-10 md:mt-14">
          <Card className="glass-panel border-white/55">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                <Stethoscope className="h-6 w-6 text-teal-700" />
                Symptom Analyzer
              </CardTitle>
              <p className="text-slate-600">Write symptoms in plain language to get likely conditions and specialist recommendations.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                className="min-h-28 bg-white/80"
                placeholder="Example: fever for two days, dry cough, mild chest pain and fatigue..."
              />
              <Button
                onClick={handleAnalyzeSymptoms}
                disabled={!symptomText.trim() || isAnalyzing}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
              </Button>

              {error ? <p className="text-sm text-amber-700">{error}</p> : null}

              {conditions.length > 0 ? (
                <div className="grid gap-3 pt-2">
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={`${condition.name}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.32 }}
                      className="rounded-2xl border border-slate-200 bg-white/85 p-4"
                    >
                      <p className="text-lg font-semibold text-slate-900">{condition.name}</p>
                      <p className="text-sm text-slate-600">{condition.description}</p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-teal-800">
                          {condition.specialist
                            ? `Recommended: ${condition.specialist}${condition.department ? ` (${condition.department})` : ""}`
                            : "General physician guidance suggested"}
                        </p>
                        <Link href={getDoctorRoute(condition.specialist)}>
                          <Button size="sm" variant="outline" className="bg-white">
                            Consult Doctors
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section ref={featureGridRef} className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          <Card className="glass-panel">
            <CardContent className="p-6">
              <Activity className="mb-3 h-8 w-8 text-emerald-700" />
              <p className="text-xl font-semibold text-slate-900">Real-time Symptom Triage</p>
              <p className="mt-2 text-slate-600">Capture early warning signs and prioritize next steps before escalation.</p>
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardContent className="p-6">
              <Users className="mb-3 h-8 w-8 text-cyan-700" />
              <p className="text-xl font-semibold text-slate-900">Community-Driven Recovery</p>
              <p className="mt-2 text-slate-600">Learn routines, nutrition habits, and progress patterns in FitGram.</p>
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardContent className="p-6">
              <ShieldCheck className="mb-3 h-8 w-8 text-indigo-700" />
              <p className="text-xl font-semibold text-slate-900">Safe Clinical Routing</p>
              <p className="mt-2 text-slate-600">Move from analysis to specialists and medicine access with clear guidance.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          <Card className="glass-panel overflow-hidden">
            <div className="relative h-44">
              <Image src="/fitgramsection.png" alt="FitGram community" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <CardContent className="p-5">
              <p className="text-xl font-semibold text-slate-900">FitGram Community</p>
              <p className="mt-2 text-slate-600">Share your journey, follow healthy routines, and stay accountable with peers.</p>
              <Link href="/fitgram" className="mt-4 inline-block">
                <Button variant="outline">Explore FitGram</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-panel overflow-hidden">
            <div className="relative h-44">
              <Image src="/healthy-meal-prep.png" alt="Healthy meal recommendations" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <CardContent className="p-5">
              <p className="text-xl font-semibold text-slate-900">Nutrition Guidance</p>
              <p className="mt-2 text-slate-600">Get practical diet suggestions that support your condition and recovery goals.</p>
              <Link href="/dashboard/user" className="mt-4 inline-block">
                <Button variant="outline">View Plans</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-panel overflow-hidden">
            <div className="relative h-44">
              <Image src="/carousel3.jpg" alt="Medicine delivery support" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <CardContent className="p-5">
              <p className="text-xl font-semibold text-slate-900">Medicine Access</p>
              <p className="mt-2 text-slate-600">Order prescribed medicines online and track delivery directly from your account.</p>
              <Link href="/medicine-store" className="mt-4 inline-block">
                <Button variant="outline">Open Store</Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 md:mt-14">
          <Card className="glass-panel overflow-hidden">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative min-h-72">
                <Image src="/healthy_meal.jpg" alt="Healthy lifestyle support" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="p-6 md:p-8">
                <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">How care flows in SymptoCare</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">From symptom signal to specialist action</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
                    <p className="font-semibold text-slate-900">1. Describe Symptoms</p>
                    <p className="text-sm text-slate-600">Natural language input captures what you feel without complex forms.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
                    <p className="font-semibold text-slate-900">2. AI Triage Suggestions</p>
                    <p className="text-sm text-slate-600">Get likely conditions and specialist directions in seconds.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
                    <p className="font-semibold text-slate-900">3. Consult and Continue</p>
                    <p className="text-sm text-slate-600">Book doctors, access medicines, and track wellness progress.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-10 md:mt-14">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { value: "24/7", label: "Assistant Availability", icon: Clock3 },
              { value: "5+", label: "Likely Conditions Suggested", icon: Brain },
              { value: "100%", label: "Mobile Friendly Experience", icon: Activity },
              { value: "1 Platform", label: "Doctors + Medicine + Wellness", icon: ShieldCheck },
            ].map((metric) => (
              <Card key={metric.label} className="glass-panel">
                <CardContent className="p-5">
                  <metric.icon className="h-6 w-6 text-cyan-700" />
                  <p className="mt-3 text-3xl font-bold text-slate-900">{metric.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10 md:mt-14">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                <Brain className="h-6 w-6 text-cyan-700" />
                Trusted by Health-Conscious Users
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
                { image: "/woman-profile.png", name: "Shreya", text: "The symptom analyzer gave me quick clarity before I booked a consultation." },
                { image: "/man-profile.png", name: "Rohit", text: "I like how doctor booking and medicine ordering are connected in one flow." },
                { image: "/diverse-woman-smiling.png", name: "Ananya", text: "FitGram helped me stay consistent with food and recovery routines." },
              ].map((item) => (
                <div key={item.name} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={52} height={52} className="h-13 w-13 rounded-full object-cover" />
                    <p className="font-semibold text-slate-900">{item.name}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 md:mt-14">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                {
                  q: "Is SymptoCare a replacement for doctors?",
                  a: "No. SymptoCare provides guidance and helps route you to the right professional care.",
                },
                {
                  q: "Can I use this before booking an appointment?",
                  a: "Yes. Use symptom analysis first, then book consultations based on suggested specialists.",
                },
                {
                  q: "Can I order medicine after consultation?",
                  a: "Yes. You can move directly to the medicine store to place relevant orders.",
                },
                {
                  q: "Do I need to install an app?",
                  a: "No. The platform is fully responsive and works directly in the browser.",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="font-semibold text-slate-900">{item.q}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 md:mt-14">
          <Card className="overflow-hidden border-none bg-gradient-to-r from-slate-900 to-cyan-900 text-white shadow-xl">
            <CardContent className="flex flex-col gap-5 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-2xl font-semibold">Start your smarter care journey today</p>
                <p className="mt-2 text-white">Use AI triage, connect with specialists, and manage your care routine end-to-end.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/user">
                  <Button className="bg-white text-slate-900 hover:bg-slate-100">
                    <Calendar className="mr-2 h-4 w-4" />
                    Open Patient Dashboard
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </motion.div>
  )
}
