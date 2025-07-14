"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Coffee, DollarSign, Share2, Users, Target } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function CreatorPage({ params }: { params: { username: string } }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")

  const handleDonation = () => {
    const amount = selectedAmount || Number.parseFloat(customAmount)
    if (amount && amount > 0) {
      // In a real app, this would integrate with Cash App API
      const cashAppUrl = `https://cash.app/$${params.username}/${amount}`
      window.open(cashAppUrl, "_blank")
    }
  }

  // This page doesn't have a theme toggle, so it will use the default light theme styling
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
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Creator Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card text-card-foreground border border-border rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-2 border-primary">
                    <AvatarImage src="https://i.ibb.co/zh2sXYzD/baa8eys.jpg" /> {/* Updated to new image URL */}
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
                <CardDescription className="text-muted-foreground">
                  Help me reach my monthly goal to upgrade my equipment!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-foreground">
                    <span>$750 of $1,000 goal</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-secondary" /> {/* Progress bar background */}
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
                    placeholder="Enter amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                    className="bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Message (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Say something nice..."
                    className="resize-none bg-input text-foreground placeholder:text-muted-foreground border-border rounded-lg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md"
                    onClick={handleDonation}
                    disabled={!selectedAmount && !customAmount}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pay with Cash App
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-input hover:bg-input/90 text-foreground border-border rounded-lg"
                  >
                    Other payment methods
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">Secure payments powered by Cash App</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
