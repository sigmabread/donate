import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { kv } from "@/lib/kv"

const SITE_CONTENT_KEY = "site_content"

// GET handler to fetch site content
export async function GET() {
  try {
    const content = await kv.get(SITE_CONTENT_KEY)
    if (content) {
      return NextResponse.json(content)
    } else {
      // Return default content if nothing is stored yet
      const defaultContent = {
        name: "sigmabread",
        cashApp: "sigmabread",
        description: "Creating content and sharing knowledge. Your support helps me continue doing what I love!",
        aboutText:
          "Thanks for considering supporting my work! Every contribution helps me create better content and keep everything accessible for everyone.",
        profileImage: "/dog-profile.jpg", // This will be replaced by the actual image URL from the client
        heroTitle: "Love what you do and make money too",
        heroSubtitle: "Support sigmabread's work and help keep the content coming!",
      }
      return NextResponse.json(defaultContent)
    }
  } catch (error) {
    console.error("Error fetching site content from KV:", error)
    return NextResponse.json({ error: "Failed to fetch site content." }, { status: 500 })
  }
}

// POST handler to save site content (admin only)
export async function POST(req: Request) {
  const isAdmin = cookies().get("isAdmin")?.value === "true"

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 403 })
  }

  try {
    const newContent = await req.json()
    // Basic validation (you might want more robust validation)
    if (!newContent || typeof newContent !== "object") {
      return NextResponse.json({ error: "Invalid content format." }, { status: 400 })
    }

    await kv.set(SITE_CONTENT_KEY, newContent)
    return NextResponse.json({ success: true, message: "Site content updated successfully." })
  } catch (error) {
    console.error("Error saving site content to KV:", error)
    return NextResponse.json({ error: "Failed to save site content." }, { status: 500 })
  }
}
