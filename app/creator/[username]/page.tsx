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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-gray-900">SupportMe</span>
          </div>

          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Creator Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="text-2xl">{params.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">@{params.username}</h1>
                    <p className="text-gray-600 mb-4">
                      Creating amazing content and sharing knowledge with the world. Your support helps me continue
                      doing what I love!
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <CardTitle>Current Goal</CardTitle>
                </div>
                <CardDescription>Help me reach my monthly goal to upgrade my equipment!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>$750 of $1,000 goal</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-gray-600">$250 to go! Thank you for your amazing support.</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Supporters */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Anonymous", amount: 10, message: "Keep up the great work!" },
                    { name: "Sarah M.", amount: 25, message: "Love your content!" },
                    { name: "Mike R.", amount: 5, message: "" },
                    { name: "Anonymous", amount: 15, message: "Thanks for sharing your knowledge" },
                  ].map((supporter, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{supporter.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{supporter.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            ${supporter.amount}
                          </Badge>
                        </div>
                        {supporter.message && <p className="text-sm text-gray-600 mt-1">{supporter.message}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Buy me a coffee</CardTitle>
                <CardDescription>Show your support with a donation</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 25].map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className="h-12"
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
                  <Label htmlFor="custom-amount">Custom amount</Label>
                  <Input
                    id="custom-amount"
                    placeholder="Enter amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Say something nice..."
                    className="resize-none"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleDonation}
                    disabled={!selectedAmount && !customAmount}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pay with Cash App
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Other payment methods
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">Secure payments powered by Cash App</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
