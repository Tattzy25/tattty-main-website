"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Nav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Simple state to simulate authentication status
  const [isSignedIn, setIsSignedIn] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const routes = [
    {
      name: "TaTTTy",
      path: "/inked",
    },
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Inspiration",
      path: "/inspiration",
    },
    {
      name: "Pricing",
      path: "/pricing",
    },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl">🔥</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
                TATTTY
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-amber-400",
                  pathname === route.path ? "text-amber-400" : "text-zinc-300",
                )}
              >
                {route.name}
              </Link>
            ))}
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => setIsSignedIn(false)}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => setIsSignedIn(true)}
                >
                  Sign In
                </Button>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isSignedIn && (
              <Link href="/dashboard" className="mr-4">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0"
                >
                  Dashboard
                </Button>
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-md border-b border-zinc-800">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                pathname === route.path
                  ? "text-amber-400 bg-zinc-900"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {route.name}
            </Link>
          ))}
          {!isSignedIn ? (
            <>
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
                onClick={() => {
                  setIsSignedIn(true)
                  setMobileMenuOpen(false)
                }}
              >
                Sign In
              </button>
              <Link
                href="/sign-up"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-red-500 to-amber-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
              onClick={() => {
                setIsSignedIn(false)
                setMobileMenuOpen(false)
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
