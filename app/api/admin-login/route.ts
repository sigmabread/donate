import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { key } = await req.json()
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY

  if (!ADMIN_SECRET_KEY) {
    console.error("ADMIN_SECRET_KEY environment variable is not set.")
    return NextResponse.json({ error: "Server not configured for admin login." }, { status: 500 })
  }

  if (key !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Invalid secret key." }, { status: 401 })
  }

  // If we reach here, the secret key is valid
  cookies().set("isAdmin", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const isAdmin = cookies().get("isAdmin")?.value === "true"
  // No 2FA status needed as 2FA is removed
  return NextResponse.json({ isAdmin })
}
