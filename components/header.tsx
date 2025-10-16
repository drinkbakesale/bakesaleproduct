"use client"

import { useState } from "react"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleContactUs = () => {
    // This would integrate with your chat system (like Gorgias)
    console.log("Opening contact chat...")
    // GorgiasChat.open() - when you have the chat system integrated
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background:
            "linear-gradient(0deg, rgba(170, 152, 208, 0) 0%, rgba(170, 152, 208, 0.78) 36.58%, rgba(170, 152, 208, 0.96) 53.37%, #AA98D0 71.52%)",
        }}
      >
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex justify-center">
            <a href="/" className="block">
              <Image
                src="/images/design-mode/bakesale-vibes(1).png"
                alt="BakeSale Vibes Logo"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
            <nav className="px-4 py-4">{/* Menu items here */}</nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20"></div>
    </>
  )
}
