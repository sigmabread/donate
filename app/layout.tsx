import type React from "react"
import type { Metadata } from "next"
// Removed: import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "Donate Bread",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Google AdSense Script - Placed directly for verification */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9971726695182172"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  )
}
