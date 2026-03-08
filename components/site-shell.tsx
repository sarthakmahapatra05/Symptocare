"use client"

import type React from "react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SplashScreen } from "@/components/splash-screen"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}</AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 10 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="health-grid-bg min-h-screen"
      >
        <SiteHeader />
        <div className="min-h-screen">{children}</div>
        <SiteFooter />
      </motion.div>
    </>
  )
}
