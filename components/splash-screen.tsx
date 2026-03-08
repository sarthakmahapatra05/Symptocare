"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { gsap } from "gsap"

type SplashScreenProps = {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".halo-ring", {
        rotate: 360,
        duration: 5,
        repeat: -1,
        ease: "none",
      })

      gsap.fromTo(
        ".status-pill",
        { y: 8, opacity: 0.35 },
        { y: 0, opacity: 1, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.12 },
      )
    }, rootRef)

    const timer = window.setTimeout(onComplete, 2300)
    return () => {
      window.clearTimeout(timer)
      ctx.revert()
    }
  }, [onComplete])

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
      className="fixed inset-0 z-[120] overflow-hidden bg-[#04101a]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(45,212,191,0.24),transparent_40%),radial-gradient(circle_at_75%_80%,rgba(56,189,248,0.18),transparent_45%)]" />

      <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-6 h-36 w-36">
          <div className="halo-ring absolute inset-0 rounded-full border-2 border-dashed border-cyan-300/55" />
          <div className="absolute inset-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl" />
          <div className="absolute inset-7 overflow-hidden rounded-full border border-white/40 bg-slate-900/50 p-3">
            <Image src="/logosymptocare.png" alt="SymptoCare logo" fill className="object-cover" sizes="144px" />
          </div>
        </div>

        <p className="text-4xl font-bold tracking-tight text-white">SymptoCare</p>
        <p className="mt-2 text-sm tracking-[0.12em] text-cyan-100/95">Your Symptoms Our Care</p>

        <div className="mt-7 flex items-center gap-2">
          <span className="status-pill h-2.5 w-2.5 rounded-full bg-cyan-200" />
          <span className="status-pill h-2.5 w-2.5 rounded-full bg-teal-200" />
          <span className="status-pill h-2.5 w-2.5 rounded-full bg-sky-200" />
        </div>
      </div>
    </motion.div>
  )
}
