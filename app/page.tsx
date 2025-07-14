"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Coffee, DollarSign, Moon, Sun, Settings, Save, X, Upload, Loader2, Key } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils" // Import cn for conditional class joining

interface SiteContent {
  name: string
  cashApp: string
  description: string
  aboutText: string
  profileImage: string
  heroTitle: string
  heroSubtitle: string
}

const defaultContent: SiteContent = {
  name: "sigmabread",
  cashApp: "sigmabread",
  description: "Creating content and sharing knowledge. Your support helps me continue doing what I love!",
  aboutText:
    "Thanks for considering supporting my work! Every contribution helps me create better content and keep everything accessible for everyone.",
  profileImage: "/dog-profile.jpg",
  heroTitle: "Love what you do and make money too",
  heroSubtitle: "Support sigmabread's work and help keep the content coming!",
}

export default function SigmaBreadPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Admin states
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminKey, setAdminKey] = useState("") // For password login
  const [loginError, setLoginError] = useState<string | null>(null) // For login errors
  const [isLoggingIn, setIsLoggingIn] = useState(false) // For login loading state
  const [isSaving, setIsSaving] = useState(false) // For save loading state
  const [isLoadingContent, setIsLoadingContent] = useState(true) // For initial content loading

  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent)
  const [editContent, setEditContent] = useState<SiteContent>(defaultContent)

  // Load saved content and check admin status from server on initial load
  useEffect(() => {
    const fetchSiteContent = async () => {
      setIsLoadingContent(true)
      try {
        const response = await fetch("/api/site-content", {
          credentials: "include", // Ensure cookies are sent for content fetch
        })
        if (response.ok) {
          const data = await response.json()
          setSiteContent(data)
          setEditContent(data)
        } else {
          console.error("Failed to fetch site content:", response.statusText)
          // Fallback to default content if fetching fails
          setSiteContent(defaultContent)
          setEditContent(defaultContent)
        }
      } catch (error) {
        console.error("Failed to fetch site content:", error)
        // Fallback to default content if fetching fails
        setSiteContent(defaultContent)
        setEditContent(defaultContent)
      } finally {
        setIsLoadingContent(false)
      }
    }

    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/admin-login", {
          credentials: "include", // Ensure cookies are sent for admin status check
        }) // Endpoint for status check
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        console.error("Failed to check admin status:", error)
        setIsAdmin(false)
      }
    }

    fetchSiteContent()
    checkAuthStatus()

    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  // handleAdminLogin for password only
  const handleAdminLogin = useCallback(async () => {
    setIsLoggingIn(true)
    setLoginError(null)
    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: adminKey }),
        credentials: "include", // Ensure cookies are sent for login
      })

      if (response.ok) {
        setIsAdmin(true)
        setShowAdminLogin(false)
        setAdminKey("")
        alert("Admin access granted!")
      } else {
        const errorData = await response.json()
        setLoginError(errorData.error || "Invalid credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An unexpected error occurred during login.")
    } finally {
      setIsLoggingIn(false)
    }
  }, [adminKey])

  const handleAdminLogout = useCallback(async () => {
    try {
      const response = await fetch("/api/admin-logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent for logout
      })
      if (response.ok) {
        setIsAdmin(false)
        setIsEditMode(false)
        alert("Admin access revoked.")
      } else {
        alert("Failed to log out.")
      }
    } catch (error) {
      console.error("Logout error:", error)
      alert("An error occurred during logout.")
    }
  }, [])

  const handleSaveContent = useCallback(async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editContent),
        credentials: "include", // Crucial: Ensure cookies are sent with this request
      })

      if (response.ok) {
        setSiteContent(editContent)
        setIsEditMode(false)
        alert("Content saved successfully!")
      } else {
        const errorData = await response.json()
        alert(`Failed to save content: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Save content error:", error)
      alert("An unexpected error occurred while saving content.")
    } finally {
      setIsSaving(false)
    }
  }, [editContent])

  const handleCancelEdit = useCallback(() => {
    setEditContent(siteContent)
    setIsEditMode(false)
  }, [siteContent])

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setEditContent((prev) => ({ ...prev, profileImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDonation = useCallback(() => {
    const amount = selectedAmount || Number.parseFloat(customAmount)
    if (amount && amount >= 1) {
      const cashAppUrl = `https://cash.app/$${siteContent.cashApp}/${amount}`
      window.open(cashAppUrl, "_blank")
    }
  }, [selectedAmount, customAmount, siteContent.cashApp])

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev)
  }, [])

  if (isLoadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <span className="sr-only">Loading content...</span>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-[#f7f5f3]"}`}>
      {/* Header */}
      <header
        className={`border-b transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-colors duration-300",
                isDarkMode ? "text-gray-100" : "text-gray-900",
              )}
            >
              {siteContent.name}
            </span>
          </div>

          <nav className="flex items-center gap-4">
            {/* Admin Controls */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSaveContent}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button size="sm" onClick={handleCancelEdit} className="bg-red-500 hover:bg-red-600 text-white">
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setIsEditMode(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Edit Site
                    </Button>
                  </>
                )}
                <Button size="sm" onClick={handleAdminLogout} className="bg-red-500 hover:bg-red-600 text-white">
                  Admin Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className={`transition-colors duration-300 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center max-w-4xl">
        {isEditMode ? (
          <div className="space-y-4">
            <Input
              value={editContent.heroTitle}
              onChange={(e) => setEditContent({ ...editContent, heroTitle: e.target.value })}
              className={cn(
                "text-center text-4xl font-bold",
                isDarkMode ? "bg-gray-700 border-gray-600 text-gray-50" : "text-gray-900",
              )}
              placeholder="Hero title"
            />
            <Textarea
              value={editContent.heroSubtitle}
              onChange={(e) => setEditContent({ ...editContent, heroSubtitle: e.target.value })}
              className={cn(
                "text-center text-xl resize-none",
                isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "text-gray-600",
              )}
              rows={2}
              placeholder="Hero subtitle"
            />
          </div>
        ) : (
          <>
            <h1
              className={cn(
                "text-5xl md:text-6xl font-bold mb-6 leading-tight transition-colors duration-300",
                isDarkMode ? "text-gray-50" : "text-gray-900",
              )}
            >
              {siteContent.heroTitle}
            </h1>
            <p
              className={cn(
                "text-xl mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              {siteContent.heroSubtitle}
            </p>
          </>
        )}

        <Button
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-full transition-colors duration-300"
          onClick={() => document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth" })}
        >
          Support {siteContent.name}
        </Button>
      </section>

      {/* Donation Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Profile */}
          <div className="space-y-6">
            <Card
              className={`shadow-sm transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={siteContent.profileImage || "/placeholder.svg"}
                        alt={`${siteContent.name}'s profile`}
                      />
                      <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">
                        {siteContent.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditMode && (
                      <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600">
                        <Upload className="w-4 h-4 text-white" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditMode ? (
                      <div className="space-y-3">
                        <Input
                          value={editContent.name}
                          onChange={(e) => setEditContent({ ...editContent, name: e.target.value })}
                          placeholder="Display name"
                          className={cn(
                            "text-2xl font-bold",
                            isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "text-gray-900",
                          )}
                        />
                        <Textarea
                          value={editContent.description}
                          onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
                          placeholder="Profile description"
                          className={cn(
                            "resize-none",
                            isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "text-gray-600",
                          )}
                          rows={3}
                        />
                      </div>
                    ) : (
                      <>
                        <h2
                          className={cn(
                            "text-2xl font-bold mb-3 transition-colors duration-300",
                            isDarkMode ? "text-gray-100" : "text-gray-900",
                          )}
                        >
                          {siteContent.name}
                        </h2>
                        <p
                          className={cn(
                            "leading-relaxed transition-colors duration-300",
                            isDarkMode ? "text-gray-300" : "text-gray-600",
                          )}
                        >
                          {siteContent.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`shadow-sm transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <CardHeader>
                <CardTitle
                  className={cn(
                    "text-xl transition-colors duration-300",
                    isDarkMode ? "text-gray-100" : "text-gray-900",
                  )}
                >
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditMode ? (
                  <Textarea
                    value={editContent.aboutText}
                    onChange={(e) => setEditContent({ ...editContent, aboutText: e.target.value })}
                    placeholder="About text"
                    className={cn(
                      "resize-none",
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "text-gray-600",
                    )}
                    rows={4}
                  />
                ) : (
                  <p
                    className={cn(
                      "leading-relaxed transition-colors duration-300",
                      isDarkMode ? "text-gray-300" : "text-gray-600",
                    )}
                  >
                    {siteContent.aboutText}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Donation Form */}
          <div id="donation-form">
            <Card
              className={`shadow-sm sticky top-8 transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle
                  className={cn(
                    "text-2xl transition-colors duration-300",
                    isDarkMode ? "text-gray-100" : "text-gray-900",
                  )}
                >
                  Buy {siteContent.name} a coffee
                </CardTitle>
                <CardDescription
                  className={cn("transition-colors duration-300", isDarkMode ? "text-gray-400" : "text-gray-600")}
                >
                  Show your support with a donation
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {isEditMode && (
                  <div className="space-y-2">
                    <Label className={cn("text-sm font-medium", isDarkMode ? "text-gray-200" : "text-gray-700")}>
                      Cash App Handle
                    </Label>
                    <Input
                      value={editContent.cashApp}
                      onChange={(e) => setEditContent({ ...editContent, cashApp: e.target.value })}
                      placeholder="Cash App username (without $)"
                      className={cn(
                        isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "text-gray-900",
                        "placeholder-gray-400",
                      )}
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {[1, 5, 10].map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={cn(
                        "h-14 text-lg font-medium transition-colors duration-300",
                        selectedAmount === amount
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
                      )}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount("")
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="custom-amount"
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isDarkMode ? "text-gray-200" : "text-gray-700",
                    )}
                  >
                    Name a fair price
                  </Label>
                  <Input
                    id="custom-amount"
                    placeholder="$1 minimum"
                    type="number"
                    min="1"
                    step="1"
                    className={cn(
                      "h-12 text-lg transition-colors duration-300",
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "border-gray-300 text-gray-900 placeholder-gray-500",
                    )}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                  />
                  <p
                    className={cn(
                      "text-xs transition-colors duration-300",
                      isDarkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Minimum $1 (Cash App requirement)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isDarkMode ? "text-gray-200" : "text-gray-700",
                    )}
                  >
                    Say something nice... (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder=""
                    className={cn(
                      "resize-none transition-colors duration-300",
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "border-gray-300 text-gray-900 placeholder-gray-500",
                    )}
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full h-12 text-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
                  onClick={handleDonation}
                  disabled={!selectedAmount && (!customAmount || Number.parseFloat(customAmount) < 1)}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Support via Cash App
                </Button>

                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs transition-colors duration-300",
                      isDarkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Cash App: @{siteContent.cashApp}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t py-8 mt-16 transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-colors duration-300",
                isDarkMode ? "text-gray-100" : "text-gray-900",
              )}
            >
              {siteContent.name}
            </span>
          </div>
          <p className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-600")}>
            Thanks for your support!
          </p>
        </div>
      </footer>

      {/* Admin Login Dialog (Password Only) */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Key className="w-6 h-6 text-gray-600" />
            </div>
            <DialogTitle className={cn("text-2xl font-bold", isDarkMode ? "text-gray-50" : "text-gray-900")}>
              Admin Login
            </DialogTitle>
            <DialogDescription className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
              Enter the secret key to gain admin access.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Label htmlFor="admin-key" className="sr-only">
                Secret Key
              </Label>
              <Input
                id="admin-key"
                type="password"
                value={adminKey}
                onChange={(e) => {
                  setAdminKey(e.target.value)
                  setLoginError(null) // Clear error on input change
                }}
                className={cn(
                  "w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "border-gray-300 text-gray-900 placeholder-gray-500",
                )}
                placeholder="Enter your secret key"
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {loginError && <p className="text-red-600 text-sm text-center font-medium mt-2">{loginError}</p>}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button
              onClick={() => setShowAdminLogin(false)}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAdminLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
