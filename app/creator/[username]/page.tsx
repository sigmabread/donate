"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Coffee, DollarSign, Share2, Users, Target, Loader2 } from "lucide-react"
import { useState, useCallback, useEffect, useRef } from "react" // Import useRef
import { cn } from "@/lib/utils"

const MIN_DONATION_AMOUNT = 1
const MAX_DONATION_AMOUNT = 1250
const MAX_DONOR_NAME_LENGTH = 64
const MAX_MESSAGE_LENGTH = 256

export default function CreatorPage({ params }: { params: { username: string } }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [donorName, setDonorName] = useState("")
  const [isDonating, setIsDonating] = useState(false)

  // Create refs for the ad containers
  const creatorHeaderAdRef = useRef<HTMLDivElement>(null)
  const creatorInFormAdRef = useRef<HTMLDivElement>(null)

  // Adsterra script injection
  useEffect(() => {
    const loadAd = (container: HTMLDivElement, adKey: string, format: string, height: number, width: number) => {
      // Clear existing content in the ad container to prevent duplicates on re-renders
      container.innerHTML = ""

      // Create a div to hold the ad scripts, as some ad networks prefer this
      const adWrapper = document.createElement("div")
      adWrapper.style.width = `${width}px`
      adWrapper.style.height = `${height}px`
      adWrapper.style.margin = "0 auto" // Center the ad if needed

      const script1 = document.createElement("script")
      script1.type = "text/javascript"
      script1.innerHTML = `var atOptions = {
        'key' : '${adKey}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };`
      adWrapper.appendChild(script1)

      const script2 = document.createElement("script")
      script2.type = "text/javascript"
      script2.src = `//www.highperformanceformat.com/${adKey}/invoke.js`
      adWrapper.appendChild(script2)

      container.appendChild(adWrapper)
    }

    // Load header ad only when the ref is available
    if (creatorHeaderAdRef.current) {
      loadAd(creatorHeaderAdRef.current, "20b30e54eca31e3ee33b0ff76954df89", "iframe", 50, 320)
    }

    // Load in-form ad only when the ref is available
    if (creatorInFormAdRef.current) {
      loadAd(creatorInFormAdRef.current, "7dc50cc819e4aa7ff7e4c1fcee6486c3", "iframe", 300, 160)
    }

    return () => {
      // Clean up when component unmounts or dependencies change
      if (creatorHeaderAdRef.current) {
        creatorHeaderAdRef.current.innerHTML = ""
      }
      if (creatorInFormAdRef.current) {
        creatorInFormAdRef.current.innerHTML = ""
      }
    }
  }, []) // Empty dependency array means this runs once after initial render

  const handleDonation = useCallback(async () => {
    const amount = selectedAmount || Number.parseFloat(customAmount)

    if (isNaN(amount) || amount < MIN_DONATION_AMOUNT) {
      alert(`Please enter a valid donation amount (minimum $${MIN_DONATION_AMOUNT}).`)
      return
    }
    if (amount > MAX_DONATION_AMOUNT) {
      alert(`Donation amount cannot exceed $${MAX_DONATION_AMOUNT}.`)
      return
    }
    if (donorName.length > MAX_DONOR_NAME_LENGTH) {
      alert(`Your name cannot exceed ${MAX_DONOR_NAME_LENGTH} characters.`)
      return
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      alert(`Your message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`)
      return
    }

    setIsDonating(true)
    try {
      const cashAppUrl = `https://cash.app/$${params.username}/${amount}`
      window.open(cashAppUrl, "_blank")

      const webhookResponse = await fetch("/api/donate-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: donorName,
          amount: amount,
          message: message,
          cashAppHandle: params.username,
        }),
      })

      if (!webhookResponse.ok) {
        console.error("Failed to send donation webhook:", await webhookResponse.text())
      }

      alert("Donation initiated! Thank you for your support.")
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
  }, [selectedAmount, customAmount, message, donorName, params.username])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-bold text-foreground">Donate Bread</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-input bg-input hover:bg-input/90 text-foreground rounded-lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
        {/* Adsterra Ad - Header Banner */}
        <div
          ref={creatorHeaderAdRef}
          id="creator-header-ad-container"
          className="container mx-auto px-4 py-2 mt-2 text-center"
        ></div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Creator Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card text-card-foreground border border-border rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-2 border-primary">
                    <AvatarImage src="https://i.ibb.co/zh2sXYzD/baa8eys.jpg" />
                    <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                      {params.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground mb-2">@{params.username}</h1>
                    <p className="text-muted-foreground mb-4">
                      Creating amazing content and sharing knowledge with the world. Your support helps me continue
                      doing what I love!
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>1,234 supporters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coffee className="w-4 h-4" />
                        <span>5,678 coffees</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Goal */}
            <Card className="bg-card text-card-foreground border border-border rounded-xl shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-foreground text-xl font-semibold">Current Goal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Help me reach my monthly goal to upgrade my equipment!
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-foreground">
                    <span>$750 of $1,000 goal</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-secondary" />
                  <p className="text-sm text-muted-foreground">$250 to go! Thank you for your amazing support.</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Supporters */}
            <Card className="bg-card text-card-foreground border border-border rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground text-xl font-semibold">Recent Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Anonymous", amount: 10, message: "Keep up the great work!" },
                    { name: "Sarah M.", amount: 25, message: "Love your content!" },
                    { name: "Mike R.", amount: 5, message: "" },
                    { name: "Anonymous", amount: 15, message: "Thanks for sharing your knowledge" },
                  ].map((supporter, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                          {supporter.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">{supporter.name}</span>
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                            ${supporter.amount}
                          </Badge>
                        </div>
                        {supporter.message && <p className="text-sm text-muted-foreground mt-1">{supporter.message}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-card text-card-foreground border border-border rounded-xl shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">Buy me a coffee</CardTitle>
                <CardDescription className="text-muted-foreground">Show your support with a donation</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 25].map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={cn(
                        "h-12 rounded-lg",
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
                  <Label htmlFor="custom-amount" className="text-foreground">
                    Custom amount
                  </Label>
                  <Input
                    id="custom-amount"
                    placeholder={`$${MIN_DONATION_AMOUNT} minimum`}
                    type="number"
                    min={MIN_DONATION_AMOUNT}
                    max={MAX_DONATION_AMOUNT}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                    className="bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum ${MIN_DONATION_AMOUNT}, Maximum ${MAX_DONATION_AMOUNT} (Cash App requirement)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donor-name" className="text-sm font-medium text-foreground">
                    Your name (optional)
                  </Label>
                  <Input
                    id="donor-name"
                    placeholder="Anonymous"
                    type="text"
                    maxLength={MAX_DONOR_NAME_LENGTH}
                    className="h-12 text-lg bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Max {MAX_DONOR_NAME_LENGTH} characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Message (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Say something nice..."
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="resize-none bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Max {MAX_MESSAGE_LENGTH} characters</p>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md"
                    onClick={handleDonation}
                    disabled={
                      isDonating ||
                      (!selectedAmount && (!customAmount || Number.parseFloat(customAmount) < MIN_DONATION_AMOUNT))
                    }
                  >
                    {isDonating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pay with Cash App
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-input hover:bg-input/90 text-foreground border-border rounded-lg"
                  >
                    Other payment methods
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">Secure payments powered by Cash App</p>

                {/* Adsterra Ad - In-form Ad */}
                <div ref={creatorInFormAdRef} id="creator-in-form-ad-container" className="text-center mt-6"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
