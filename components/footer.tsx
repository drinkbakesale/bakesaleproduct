"use client"
import { Facebook, Instagram } from "lucide-react"

export default function Footer() {
  const policies = [
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Refund Policy", href: "/refund-policy" },
    { title: "Terms of Service", href: "/terms-of-service" },
    { title: "Shipping Policy", href: "/shipping-policy" },
  ]

  const usefulLinks = [
    { title: "T-H-C Disclaimer", href: "/t-h-c-disclaimer" },
    { title: "C-B-D Disclaimer", href: "/c-b-d-disclaimer" },
    { title: "FDA Disclaimer", href: "/fda-disclaimer" },
    { title: "COA's + Lab Analysis", href: "/lab-analysis" },
    { title: "Batch Information", href: "/batch-information" },
    { title: "Instructions for Use", href: "/instructions" },
    { title: "Warning Statements", href: "/warnings" },
  ]

  return (
    <footer
      className="mt-12 pt-12 pb-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(170, 152, 208, 0.8) 0%, rgba(170, 152, 208, 0.9) 50%, rgba(170, 152, 208, 1) 100%)",
      }}
    >
      <div className="max-w-md mx-auto px-6">
        {/* Brand Section */}
        <div className="text-center mb-8">
          {/* BakeSale Script Logo */}
          <div className="mb-4">
            <h2 className="text-white text-4xl font-script mb-2" style={{ fontFamily: "sans-serif" }}>
              Bakesale Beverage Co.
            </h2>
          </div>

          {/* Company Info */}
          <div className="text-white space-y-1 mb-4">
            <p className="text-sm">2810 N Church St.</p>
            <p className="text-sm">Wilmington, DE, 19802</p>
            <a href="tel:8335714160" className="text-sm underline block mt-2">
              (833) 571-4160
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://facebook.com/bakesalevibes"
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://instagram.com/bakesalevibes"
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://tiktok.com/@bakesalevibes"
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="TikTok"
            >
              <span className="text-white text-lg font-bold">♪</span>
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-8 text-white">
          {/* Our Policies */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">Our Policies</h3>
            <ul className="space-y-3">
              {policies.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-white/90 hover:text-white transition-colors text-sm">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">Useful Links</h3>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-white/90 hover:text-white transition-colors text-sm">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
