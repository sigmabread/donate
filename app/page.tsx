"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Coffee,
  DollarSign,
  Moon,
  Sun,
  Settings,
  Save,
  X,
  Upload,
  Loader2,
  Key,
  CheckCircle,
} from "lucide-react"
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
  profileImage: "/josie.jpg", // Ensure Josie's picture is the default
  heroTitle: "Love what you do and make money too",
  heroSubtitle: "Support sigmabread's work and help keep the content coming!",
}

// Discord invite URL (consider moving to .env for production: NEXT_PUBLIC_DISCORD_INVITE_URL)
const DISCORD_INVITE_URL = "https://discord.gg/ttCVFwRvbu"

export default function SigmaBreadPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [donorName, setDonorName] = useState("") // New state for donor name
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

  // Donation states
  const [isDonating, setIsDonating] = useState(false) // For donation button loading state
  const [showThankYouPopup, setShowThankYouPopup] = useState(false) // For thank you popup

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

  const handleDonation = useCallback(async () => {
    const amount = selectedAmount || Number.parseFloat(customAmount)
    if (!amount || amount < 1) {
      alert("Please enter a valid donation amount (minimum $1).")
      return
    }

    setIsDonating(true)
    try {
      // 1. Redirect to Cash App
      // Note: The webhook is sent immediately after redirection.
      // For true "only if actually donated" confirmation, a server-side
      // integration with a payment processor's webhook system would be required.
      const cashAppUrl = `https://cash.app/$${siteContent.cashApp}/${amount}`
      window.open(cashAppUrl, "_blank")

      // 2. Send webhook notification
      const webhookResponse = await fetch("/api/donate-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: donorName,
          amount: amount,
          message: message,
          cashAppHandle: siteContent.cashApp,
        }),
      })

      if (!webhookResponse.ok) {
        console.error("Failed to send donation webhook:", await webhookResponse.text())
        // Optionally, alert the user about webhook failure but proceed with donation
        // alert("Donation processed, but failed to send notification. Please check console for details.")
      }

      // 3. Show thank you popup and clear form
      setShowThankYouPopup(true)
      setSelectedAmount(null)
      setCustomAmount("")
      setMessage("")
      setDonorName("")
    } catch (error) {
      console.error("Donation error:", error)
      alert("An error occurred during the donation process.")
    } finally {
      setIsDonating(false)
    }
  }, [selectedAmount, customAmount, message, donorName, siteContent.cashApp])

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev)
  }, [])

  if (isLoadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading content...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-bold text-foreground">{siteContent.name}</span>
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
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
                    <Button
                      size="sm"
                      onClick={handleCancelEdit}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setIsEditMode(true)}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Edit Site
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  onClick={handleAdminLogout}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Admin Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <Settings className="w-4 h-4 py-0 mr-0" />
                {""}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-input bg-input hover:bg-input/90 text-foreground"
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
              className="text-center text-4xl md:text-5xl font-bold bg-input text-foreground placeholder:text-muted-foreground"
              placeholder="Hero title"
            />
            <Textarea
              value={editContent.heroSubtitle}
              onChange={(e) => setEditContent({ ...editContent, heroSubtitle: e.target.value })}
              className="text-center text-xl resize-none bg-input text-foreground placeholder:text-muted-foreground"
              rows={2}
              placeholder="Hero subtitle"
            />
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-foreground">
              {siteContent.heroTitle}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground">
              {siteContent.heroSubtitle}
            </p>
          </>
        )}

        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg rounded-full shadow-md"
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
            <Card className="shadow-lg bg-card text-card-foreground border border-border rounded-xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-primary">
                      <AvatarImage
                        src={siteContent.profileImage || "/placeholder.svg"}
                        alt={`${siteContent.name}'s profile`}
                      />
                      <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
                        {siteContent.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditMode && (
                      <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                        <Upload className="w-4 h-4 text-primary-foreground" />
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
                          className="text-2xl font-bold bg-input text-foreground placeholder:text-muted-foreground"
                        />
                        <Textarea
                          value={editContent.description}
                          onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
                          placeholder="Profile description"
                          className="resize-none bg-input text-foreground placeholder:text-muted-foreground"
                          rows={3}
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-3xl font-bold mb-3 text-foreground">{siteContent.name}</h2>
                        <p className="leading-relaxed text-muted-foreground">{siteContent.description}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-card text-card-foreground border border-border rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">About</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditMode ? (
                  <Textarea
                    value={editContent.aboutText}
                    onChange={(e) => setEditContent({ ...editContent, aboutText: e.target.value })}
                    placeholder="About text"
                    className="resize-none bg-input text-foreground placeholder:text-muted-foreground"
                    rows={4}
                  />
                ) : (
                  <p className="leading-relaxed text-muted-foreground">{siteContent.aboutText}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Donation Form */}
          <div id="donation-form">
            <Card className="shadow-lg sticky top-8 bg-card text-card-foreground border border-border rounded-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Buy {siteContent.name} a coffee
                </CardTitle>
                <CardDescription className="text-muted-foreground">Show your support with a donation</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {isEditMode && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Cash App Handle</Label>
                    <Input
                      value={editContent.cashApp}
                      onChange={(e) => setEditContent({ ...editContent, cashApp: e.target.value })}
                      placeholder="Cash App username (without $)"
                      className="bg-input text-foreground placeholder:text-muted-foreground border-border"
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {[1, 5, 10].map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={cn(
                        "h-14 text-lg font-medium rounded-lg",
                        selectedAmount === amount
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "bg-input hover:bg-input/90 text-foreground border-border",
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
                  <Label htmlFor="custom-amount" className="text-sm font-medium text-foreground">
                    Name a fair price
                  </Label>
                  <Input
                    id="custom-amount"
                    placeholder="$1 minimum"
                    type="number"
                    min="1"
                    step="1"
                    className="h-12 text-lg bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Minimum $1 (Cash App requirement)</p>
                </div>

                {/* New: Donor Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="donor-name" className="text-sm font-medium text-foreground">
                    Your name (optional)
                  </Label>
                  <Input
                    id="donor-name"
                    placeholder="Anonymous"
                    type="text"
                    className="h-12 text-lg bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    Say something nice... (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder=""
                    className="resize-none bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md"
                  onClick={handleDonation}
                  disabled={isDonating || (!selectedAmount && (!customAmount || Number.parseFloat(customAmount) < 1))}
                >
                  {isDonating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      Support via Cash App
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Cash App: @{siteContent.cashApp}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16 bg-card text-card-foreground shadow-inner">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-bold text-foreground">{siteContent.name}</span>
          </div>
          <p className="text-muted-foreground">Thanks for your support!</p>
        </div>
      </footer>

      {/* Admin Login Dialog (Password Only) */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-[425px] p-6 bg-card text-card-foreground border border-border rounded-xl">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-2">
              <Key className="w-6 h-6 text-secondary-foreground" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">Admin Login</DialogTitle>
            <DialogDescription className="text-muted-foreground">
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
                className="w-full pl-10 pr-4 py-2 border border-input bg-input rounded-lg shadow-sm focus:outline-none focus:ring-ring focus:border-primary text-foreground placeholder:text-muted-foreground"
                placeholder="Enter your secret key"
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            {loginError && <p className="text-destructive text-sm text-center font-medium mt-2">{loginError}</p>}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button
              onClick={() => setShowAdminLogin(false)}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAdminLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
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

      {/* Thank You Popup */}
      <Dialog open={showThankYouPopup} onOpenChange={setShowThankYouPopup}>
        <DialogContent className="sm:max-w-[425px] p-6 text-center bg-card text-card-foreground border border-border rounded-xl">
          <DialogHeader className="flex flex-col items-center space-y-3">
            <CheckCircle className="w-16 h-16 text-primary" />
            <DialogTitle className="text-2xl font-bold text-foreground">Thank You!</DialogTitle>
            <DialogDescription className="text-muted-foreground">Your support means a lot!</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-lg font-medium text-foreground">Join our community!</p>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md">
              <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                Join Discord Server
              </a>
            </Button>
          </div>
          <DialogFooter className="flex justify-center">
            <Button
              onClick={() => setShowThankYouPopup(false)}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
