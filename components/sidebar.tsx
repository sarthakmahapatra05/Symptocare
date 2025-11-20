"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Home,
  Menu,
  X,
  FileText,
  Users,
  Phone,
} from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onToggle}
      />

      <div
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 overflow-hidden ${
          isOpen ? "w-64" : "w-0 md:w-16"
        }`}
      >
        <div className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              {isOpen && <span className="ml-2">Menu</span>}
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
                {isOpen && <span className="ml-2">Home</span>}
              </Button>
            </Link>

            <Link href="/fitgram">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Users className="h-4 w-4" />
                {isOpen && <span className="ml-2">FitGram</span>}
              </Button>
            </Link>

            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <FileText className="h-4 w-4" />
                {isOpen && <span className="ml-2">My Details</span>}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Phone className="h-4 w-4" />
              {isOpen && <span className="ml-2">Contact Us</span>}
            </Button>
          </nav>
        </div>
      </div>
    </>
  )
}
