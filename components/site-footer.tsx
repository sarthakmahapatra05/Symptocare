"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { HeartPulse, Mail, MapPin, Phone } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/20 bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-cyan-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-teal-400/25 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2"
        >
          <div className="flex items-center gap-3">
            <Image src="/logosymptocare.png" alt="SymptoCare logo" width={46} height={46} className="h-11 w-11 rounded-xl object-cover" />
            <div>
              <p className="text-xl font-semibold">SymptoCare</p>
              <p className="text-sm text-cyan-100/80">Your Symptoms Our Care</p>
            </div>
          </div>
          <p className="mt-4 max-w-lg text-sm text-slate-300">
            AI-powered symptom intelligence, trusted doctor discovery, medicine support, and a wellness community in one connected platform.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-cyan-100">
            <HeartPulse className="h-4 w-4" />
            Private, secure, and guidance-first healthcare support
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-base font-semibold">Quick Links</p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <Link href="/" className="block hover:text-white">Home</Link>
            <Link href="/doctors" className="block hover:text-white">Doctors</Link>
            <Link href="/appointments" className="block hover:text-white">Appointments</Link>
            <Link href="/medicine-store" className="block hover:text-white">Medicine Store</Link>
            <Link href="/fitgram" className="block hover:text-white">FitGram</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-base font-semibold">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-200" />
              symptocare@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-cyan-200" />
              +91 720522140
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-200" />
              24/7 Digital Healthcare
            </p>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} SymptoCare. All rights reserved.
      </div>
    </footer>
  )
}
