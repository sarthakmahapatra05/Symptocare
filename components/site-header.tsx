"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/medicine-store", label: "Medicine" },
  { href: "/fitgram", label: "FitGram" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <Image src="/logosymptocare.png" alt="SymptoCare logo" width={42} height={42} className="h-10 w-10 rounded-xl object-cover" />
          <div className="leading-tight">
            <p className="text-lg font-semibold text-slate-900">SymptoCare</p>
            <p className="text-xs text-slate-500">Your Symptoms Our Care</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isActive ? "bg-slate-900 text-white hover:bg-slate-800 hover:text-white" : "text-slate-700"}
                >
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/auth/login">
            <Button size="sm" variant="outline" className="border-slate-300 bg-white/80">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
              Sign up
            </Button>
          </Link>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5 text-slate-800" /> : <Menu className="h-5 w-5 text-slate-800" />}
        </Button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200/70 bg-white/95 px-4 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/auth/login" onClick={closeMobileMenu}>
              <Button size="sm" variant="outline" className="w-full border-slate-300 bg-white/80">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup" onClick={closeMobileMenu}>
              <Button size="sm" className="w-full bg-slate-900 text-white hover:bg-slate-800">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
