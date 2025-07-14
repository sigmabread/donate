import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

  if (!DISCORD_WEBHOOK_URL) {
    console.error("DISCORD_WEBHOOK_URL environment variable is not set.")
    return NextResponse.json({ error: "Server not configured for Discord webhooks." }, { status: 500 })
  }

  try {
    const { name, amount, message, cashAppHandle } = await req.json()

    const payload = {
      username: "SupportMe Donation Bot",
      avatar_url: "https://i.ibb.co/zh2sXYzD/baa8eys.jpg", // Updated to new image URL
      embeds: [
        {
          title: "🎉 New Donation Received!",
          description: `A new supporter might have just sent a donation!`,
          color: 0x34bf0d, // Green color
          thumbnail: {
            url: "https://i.ibb.co/zh2sXYzD/baa8eys.jpg", // Updated to new image URL
          },
          fields: [
            {
              name: "Amount",
              value: `$${amount}`,
              inline: true,
            },
            {
              name: "Donor",
              value: name && name.trim() !== "" ? name : "Anonymous",
              inline: true,
            },
            {
              name: "Cash App Handle",
              value: `@${cashAppHandle}`,
              inline: true,
            },
            {
              name: "Message",
              value: message && message.trim() !== "" ? message : "No message provided.",
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Powered by SupportMe",
            icon_url: "https://blob.v0.dev/heart-icon.png", // Placeholder for a heart icon
          },
        },
      ],
    }

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Webhook sent successfully." })
    } else {
      const errorText = await response.text()
      console.error("Failed to send Discord webhook:", response.status, errorText)
      return NextResponse.json({ error: `Failed to send Discord webhook: ${errorText}` }, { status: response.status })
    }
  } catch (error) {
    console.error("Error processing donation webhook:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
