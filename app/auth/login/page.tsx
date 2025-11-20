 "use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Shield, AlertCircle, Menu, X, Home, Users, FileText, Phone, LogIn, UserPlus, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { signIn } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Handle browser back button - redirect to home instead of previous page
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      router.replace('/')
    }

    // Push a new state to replace the current one
    window.history.replaceState({ fromLogin: true }, '', '/auth/login')
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setIsLoading(true)
    setError("")

    try {
      await signIn(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-foreground hover:bg-accent mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
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

        <div className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Login to SymptoCare
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your email and password to continue
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!email.trim() || !password.trim() || isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
