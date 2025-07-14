import type React from "react"
import type { Metadata } from "next"
import Script from "next/script" // Import Script component
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
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9971726695182172"
          crossOrigin="anonymous"
          strategy="afterInteractive" // Load after the page is interactive
        />
      </body>
    </html>
  )
}
