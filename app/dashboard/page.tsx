"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        // Get user role and redirect accordingly
        const { getCurrentUserRole } = await import("@/lib/auth")
        const role = await getCurrentUserRole()
        
        if (role === 'doctor') {
          router.push("/dashboard/doctor")
        } else if (role === 'admin') {
          router.push("/dashboard/admin")
        } else {
          router.push("/dashboard/user")
        }
      } catch (error) {
        console.error("Error checking user:", error)
        router.push("/auth/login")
      }
    }

    checkUserAndRedirect()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  )
}
