"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Header from "./components/header"
import { ChevronDown, Play, Star, Truck, DollarSign, MapPin } from "lucide-react"
import { usePreloadCheckout } from "./hooks/usePreloadCheckout"

function getFbclid() {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("fbclid") || ""
  }
  return ""
}

function fixedPositionIsBroken(thresholdPx = 8): boolean {
  try {
    const probe = document.createElement("div")
    Object.assign(probe.style, {
      position: "fixed",
      left: "0",
      bottom: "0",
      width: "1px",
      height: "1px",
      background: "transparent",
      zIndex: "2147483647",
      pointerEvents: "none",
    })
    document.body.appendChild(probe)

    const rect = probe.getBoundingClientRect()
    probe.remove()

    const vh = window.visualViewport?.height ?? window.innerHeight
    const expectedBottom = vh
    const actualBottom = rect.bottom
    return Math.abs(expectedBottom - actualBottom) > thresholdPx
  } catch {
    return false
  }
}

function neutralizeLayoutTrapsOnce() {
  if (document.getElementById("__fixed_fallback_css")) return
  const style = document.createElement("style")
  style.id = "__fixed_fallback_css"
  style.textContent = `
    html, body { transform: none !important; overflow: visible !important; height: auto !important; }
    #__next, main, [data-app-root] { transform: none !important; overflow: visible !important; }
  `
  document.head.appendChild(style)
}

function mountEmergencyStickyBarOnce() {
  if (document.getElementById("__emergency_sticky")) return

  const bar = document.createElement("div")
  bar.id = "__emergency_sticky"
  Object.assign(bar.style, {
    position: "fixed",
    left: "0",
    right: "0",
    bottom: "0",
    zIndex: "2147483647",
    display: "flex",
    boxShadow: "0 -6px 16px rgba(0,0,0,.15)",
    background: "#fff",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
    fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
  })

  const mk = (text: string, styles: Record<string, string>, on: () => void) => {
    const btn = document.createElement("button")
    btn.textContent = text
    Object.assign(btn.style, styles)
    btn.onclick = on
    return btn
  }

  const shop = mk(
    "SHOP NOW",
    {
      width: "66.66%",
      padding: "16px 0",
      fontWeight: "800",
      textTransform: "uppercase",
      border: "0",
      background: "#EDA21C",
      color: "#7B0202",
      fontSize: "19.2px",
      fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
    },
    () => {
      const el = document.getElementById("pricing-section")
      if (!el) return
      const r = el.getBoundingClientRect()
      const y = (window.pageYOffset || document.documentElement.scrollTop || 0) + r.top
      const vh = window.visualViewport?.height ?? window.innerHeight
      const target = Math.max(0, y - vh / 2 + r.height / 2)
      try {
        window.scrollTo({ top: target, behavior: "smooth" })
      } catch {
        window.scrollTo(0, target)
        ;(document.documentElement as any).scrollTop = target
      }
    },
  )

  const chat = mk(
    "LIVE CHAT",
    {
      width: "33.33%",
      padding: "16px 0",
      fontWeight: "800",
      textTransform: "uppercase",
      border: "0",
      background: "#AA98D0",
      color: "#fff",
      fontSize: "19.2px",
      fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
    },
    () => {
      try {
        const w = window as any
        const g = w.GorgiasChat || w.Gorgias
        if (g?.isOpen?.()) g.close?.()
        else g?.open?.()
      } catch {}
    },
  )

  bar.appendChild(shop)
  bar.appendChild(chat)
  document.body.appendChild(bar)

  if (!document.getElementById("__emergency_pad")) {
    const pad = document.createElement("style")
    pad.id = "__emergency_pad"
    pad.textContent = `body::after{content:"";display:block;height:calc(64px + env(safe-area-inset-bottom,0px));}`
    document.head.appendChild(pad)
  }
}

function enableFixedFallbackIfNeeded() {
  if (fixedPositionIsBroken()) {
    neutralizeLayoutTrapsOnce()
    mountEmergencyStickyBarOnce()
  }
}

function disableFixedFallback() {
  document.getElementById("__fixed_fallback_css")?.remove()
  document.getElementById("__emergency_sticky")?.remove()
  document.getElementById("__emergency_pad")?.remove()
}

function StickyFooter() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      let faqSection = document.getElementById("faq-section")

      if (!faqSection) {
        const headings = document.querySelectorAll("h3")
        faqSection = Array.from(headings).find((h) =>
          h.textContent?.includes("You're Probably Wondering"),
        ) as HTMLElement
      }

      if (!faqSection) return

      const rect = faqSection.getBoundingClientRect()
      setIsVisible(rect.top < window.innerHeight * 0.5)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted || !isVisible) return null

  const portalTarget = typeof document !== "undefined" ? document.body : null
  if (!portalTarget) return null

  const centerScrollTo = () => {
    const el = document.getElementById("pricing-section")
    if (!el) return
    const rect = el.getBoundingClientRect()
    const docY = window.pageYOffset || document.documentElement.scrollTop || 0
    const top = rect.top + docY
    const vh = window.visualViewport?.height ?? window.innerHeight
    const target = Math.max(0, top - vh / 2 + rect.height / 2)
    try {
      window.scrollTo({ top: target, behavior: "smooth" })
    } catch {
      window.scrollTo(0, target)
      document.documentElement.scrollTop = target
    }
  }

  const toggleChat = () => {
    try {
      const g = (window as any).GorgiasChat || (window as any).Gorgias
      if (g?.isOpen?.()) g.close?.()
      else g?.open?.()
    } catch (e) {
      console.warn("Chat widget error:", e)
    }
  }

  return createPortal(
    <div
      id="sticky-footer"
      className={`fixed left-0 right-0 bottom-0 z-[2147483647] flex shadow-[0_-4px_16px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        WebkitTransform: isVisible ? "translateZ(0)" : "translateZ(0) translateY(100%)",
        background: "#fff",
      }}
    >
      <button
        className="w-2/3 text-center py-4 font-bold uppercase hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#EDA21C", color: "#531700", fontSize: "19.2px" }}
        onClick={centerScrollTo}
      >
        SHOP NOW
      </button>
      <button
        className="w-1/3 text-center py-4 font-bold uppercase hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#AA98D0", color: "#FFFFFF", fontSize: "19.2px" }}
        onClick={toggleChat}
      >
        LIVE CHAT
      </button>
    </div>,
    portalTarget,
  )
}

export default function Component() {
  const thumbnailImages = [
    {
      src: "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product/images/3-boxes-main-updated.webp",
      alt: "BakeSale Vibes Brownie Product Box",
    },
    {
      src: "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product/images/box-thumb-2-new.webp",
      alt: "Multiple BakeSale Vibes Brownie Pouches Layout",
    },
    {
      src: "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product/images/box-thumb-3-updated.webp",
      alt: "Open BakeSale Vibes Box with Pouches Inside",
    },
    {
      src: "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product/images/box-thumb-4-new.png",
      alt: "BakeSale Vibes Box - The Tastiest Way to Unwind",
    },
  ]

  const faqData = [
    {
      question: "How many should I have?",
      answer:
        "Everyone's tolerance is different, so we recommend starting with one pouch and seeing how you feel after 15 minutes, then deciding if you want another.\n\nJust like alcohol, Bakesale Vibes' effects stack, so if you want to increase the intensity of the effects, you can have another pouch. Just remember to enjoy responsibly!",
    },
    {
      question: "Is 3mg good for beginners?",
      answer:
        "Each pouch's friendly dose of 3mg T-H-C is meant to be an easy starting place for new consumers, so it is a relatively low dose.\n\nThat being said, if you are concerned about overdoing it, you can try a little bit at a time, wait 15 minutes or so, and once you have figured out how much it effects you, you can adjust how much you drink accordingly.",
    },
    {
      question: "How is it legal?",
      answer:
        "Thanks to the 2018 Farm Bill, products containing less than 0.3% hemp derived T-H-C by weight (like Bakesale Vibes) are Federally Legal. This makes Bakesale Vibes 100% legal to buy and sell online to individuals over the age of 21.",
    },
    {
      question: "What does it feel like?",
      answer:
        "Bakesale's friendly dose of 3mg of T-H-C is relaxing, playful, and delightfully uplifting.\n\nFor most people, drinking one pouch worth is roughly the same strength of experience as a glass of wine or a beer.",
    },
    {
      question: "Nutritional Info?",
      answer: "image",
    },
    {
      question: "Ingredients List",
      answer:
        "Bakesale Vibes contains Purified Water, Cane Sugar, Vegetable Glycerin, Salt, Gum Acacia, Potassium Sorbate, Sodium Benzoate, Hemp-Derived Delta-9 T-H-C Extract, Hemp-Derived C-B-D Extract, Natural and Artifical Flavors, Caramel Coloring.",
    },
  ]

  const [mainImage, setMainImage] = useState(
    "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product/images/3-boxes-main-updated.webp",
  )
  const [selectedQuantity, setSelectedQuantity] = useState(2) // Default to 2 boxes
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showVideo, setShowVideo] = useState(false)

  const fbclid = getFbclid()

  // Use the preload checkout hook with current selection
  usePreloadCheckout(selectedQuantity, fbclid)

  const quantityOptions = [
    {
      id: 1,
      label: "1 Box (12 pouches)",
      price: "$45.00",
      qty: 1,
      url: `https://landing.bakesalevibes.com/checkout/?qty=1${fbclid ? `&fbclid=${fbclid}` : ""}`,
    },
    {
      id: 2,
      label: "2 Boxes - Most Popular",
      price: "$68.00",
      originalPrice: "$90.00",
      savings: "You save 24%",
      qty: 2,
      url: `https://landing.bakesalevibes.com/checkout/?qty=2${fbclid ? `&fbclid=${fbclid}` : ""}`,
    },
    {
      id: 3,
      label: "3 Boxes - Best Savings",
      price: "$95.00",
      originalPrice: "$135.00",
      savings: "You save 30%",
      qty: 3,
      url: `https://landing.bakesalevibes.com/checkout/?qty=3${fbclid ? `&fbclid=${fbclid}` : ""}`,
    },
  ]

  const selectedOption = quantityOptions.find((option) => option.id === selectedQuantity)

  // Handle quantity selection change
  const handleQuantityChange = (newQuantity: number) => {
    setSelectedQuantity(newQuantity)

    // Immediately prefetch the new selected URL for faster loading
    const newSelectedUrl = quantityOptions.find((opt) => opt.id === newQuantity)?.url
    if (newSelectedUrl) {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = newSelectedUrl
      link.as = "document"
      document.head.appendChild(link)
    }
  }

  useEffect(() => {
    enableFixedFallbackIfNeeded()

    const hideGorgiasCSS = `
      iframe[id="chat-button"],
      .gorgias-chat-button,
      [data-gorgias-chat-widget] iframe[src*="chat-button"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `
    const styleElement = document.createElement("style")
    styleElement.textContent = hideGorgiasCSS
    document.head.insertBefore(styleElement, document.head.firstChild)

    const loadAllScripts = () => {
      const loadScript = (src: string, id?: string, async = false) =>
        new Promise((resolve) => {
          try {
            if (id && document.getElementById(id)) {
              resolve(true)
              return
            }
            const s = document.createElement("script")
            if (id) s.id = id
            s.src = src
            s.async = async
            s.onload = () => resolve(true)
            s.onerror = (e) => {
              console.warn(`Failed to load script: ${src}`, e)
              resolve(false)
            }
            document.head.appendChild(s)
          } catch (e) {
            console.warn(`Error creating script element for: ${src}`, e)
            resolve(false)
          }
        })

      setTimeout(async () => {
        try {
          await loadScript(
            "https://config.gorgias.chat/bundle-loader/01JQSNZSF0ETDCVXMG4DKN0EKX",
            "gorgias-chat-widget-install-v3",
            true,
          )
        } catch (error) {
          console.warn("Error loading Gorgias script:", error)
        }
      }, 500)

      setTimeout(async () => {
        try {
          await loadScript(
            "https://bundle.5gtb.com/loader.js?g_cvt_id=77c02f1d-ae53-49f2-8bbf-f5da05d5e79f",
            "bundle-script",
            true,
          )
        } catch (bundleError) {
          console.warn("Bundle script failed to load:", bundleError)
        }
      }, 300)

      setTimeout(() => {
        try {
          if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
            const s = document.createElement("script")
            s.src = "https://player.vimeo.com/api/player.js"
            s.async = true
            document.head.appendChild(s)
          }
        } catch (error) {
          console.warn("Error loading Vimeo script:", error)
        }
      }, 800)
    }

    const initializeScripts = () => {
      if (document.readyState === "complete") {
        setTimeout(loadAllScripts, 800)
      } else {
        window.addEventListener("load", () => {
          setTimeout(loadAllScripts, 800)
        })
      }
    }

    initializeScripts()

    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      if (args[0] && typeof args[0] === "string" && args[0].includes("Amplitude Logger")) return
      originalConsoleError.apply(console, args)
    }

    const hideMessengerButton = () => {
      const selectors = ["#chat-button", ".gorgias-chat-button", "iframe[src*='chat-button']"]
      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.style.display = "none"
            element.style.visibility = "hidden"
            element.style.opacity = "0"
          }
        })
      })
    }
    hideMessengerButton()

    let observer: MutationObserver | null = null
    try {
      observer = new MutationObserver(() => hideMessengerButton())
      observer.observe(document.body, { childList: true, subtree: true })
    } catch (error) {
      console.warn("Error setting up MutationObserver:", error)
    }

    return () => {
      try {
        observer?.disconnect()
        disableFixedFallback()
        document.getElementById("gorgias-chat-widget-install-v3")?.remove()
        document.getElementById("bundle-script")?.remove()
        console.error = originalConsoleError
      } catch (error) {
        console.warn("Error during cleanup:", error)
      }
    }
  }, [])

  return (
    <div
      className="page-root min-h-[100dvh] min-h-screen"
      style={{ backgroundColor: "#FFF7E6", fontFamily: "sans-serif" }}
    >
      <style jsx global>{`
        :root { --safe-bottom: env(safe-area-inset-bottom, 0px); }
        html, body { overflow-y: visible; }
        iframe[id="chat-button"],
        .gorgias-chat-button,
        [data-gorgias-chat-widget] iframe[src*="chat-button"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `}</style>

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-M9LHLSBR"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <Header />

      <div className="px-6 mb-1.5">
        <div className="mb-0 leading-7">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt="BakeSale Vibes Brownie Product"
            width={400}
            height={320}
            className="w-full rounded-lg"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="flex gap-3 justify-evenly">
          {thumbnailImages.map((thumb, index) => (
            <button
              key={index}
              onClick={() => setMainImage(thumb.src)}
              className={`rounded-lg overflow-hidden ${mainImage === thumb.src ? "border-2" : "border-0"}`}
              style={{ borderColor: mainImage === thumb.src ? "#531700" : "transparent" }}
            >
              <Image
                src={thumb.src || "/placeholder.svg"}
                alt={thumb.alt}
                width={70}
                height={70}
                className="w-[70px] h-[70px] object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      <section className="w-full bg-[#FFF7E6]">
        <div className="px-6 text-center pb-0 pt-2.5 pl-0 pr-0">
          <h1
            className="font-bold mb-3 leading-8 font-sans text-center tracking-tighter text-xl"
            style={{ color: "#531700" }}
          >
            Bakesale Vibes 12-Pack Box
          </h1>
          <p
            className="font-sans font-medium text-center text-base tracking-tighter"
            style={{ color: "#531700", lineHeight: "1rem" }}
          >
            A delicious brownie-flavored drink infused with a beginner-friendly 3mg dose of T-H-C.
            <br />
            <br />
            For wonderful nights and easy mornings after.
          </p>
        </div>
      </section>

      <div className="px-6 mb-4" id="pricing-section">
        <div className="grid grid-cols-2 gap-4 mb-6 mt-5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/design-mode/icon-calories(2).png"
                alt="16 calories icon"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span className="font-medium text-sm leading-tight" style={{ color: "#531700" }}>
              only 16 calories per pouch
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/icon-smiley-new.png"
                alt="Smiley face icon"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span className="font-medium text-sm leading-tight" style={{ color: "#531700" }}>
              no hangovers & no regrets
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/design-mode/icon-leaf(2).png"
                alt="Leaf icon"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span className="font-medium text-sm leading-tight" style={{ color: "#531700" }}>
              beginner friendly
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/design-mode/icon-lightning(2).png"
                alt="Lightning bolt icon"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span className="font-medium text-sm leading-tight" style={{ color: "#531700" }}>
              feel it in 10 minutes, lasts 90
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-[#E4A830] mb-4 px-4 py-0 pb-5">
          <div className="text-center mb-2 mt-1.5">
            <div
              className="inline-block px-6 py-2 rounded-full text-white font-bold text-sm mb-1.5"
              style={{ backgroundColor: "#E4A830" }}
            >
              ✨ CHOOSE YOUR VIBE ✨
            </div>
            <h2 className="font-bold mb-1 text-xl" style={{ color: "#531700" }}>
              {"Select your Vibes quantity:"}
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {quantityOptions.map((option) => (
              <div
                key={option.id}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all px-2.5 py-1.5 ${
                  selectedQuantity === option.id ? "border-[#531700] bg-[#FFF7E6]" : "border-[#E4A830] bg-white"
                }`}
                onClick={() => handleQuantityChange(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center leading-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${
                        selectedQuantity === option.id ? "border-[#531700]" : "border-gray-400"
                      }`}
                    >
                      {selectedQuantity === option.id && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#531700" }} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-base tracking-tighter" style={{ color: "#531700" }}>
                        {option.id} Box{option.id > 1 ? "es" : ""} {option.id === 1 ? "(12 pouches)" : ""}
                        {option.id === 2 ? " - Most Popular" : ""}
                        {option.id === 3 ? " - Best Savings" : ""}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {option.id === 2 || option.id === 3
                          ? option.savings || `${option.id * 12} pouches total`
                          : `${option.id * 12} pouches total`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-base tracking-tighter" style={{ color: "#531700" }}>
                      {option.price}
                    </div>
                    {option.originalPrice && (
                      <div className="text-gray-500 line-through text-xs">{option.originalPrice}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full font-bold rounded-xl text-lg font-sans py-0 leading-4"
            style={{
              backgroundColor: "#E4A830",
              color: "#531700",
              fontWeight: 700,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              border: "2px solid #C8851A",
              background: "linear-gradient(135deg, #F0A825 0%, #EDA21C 30%, #EDA21C 70%, #E09818 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
              borderRadius: "0.75rem",
              height: "42px",
              fontSize: "18px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)"
            }}
            onClick={() => {
              if (selectedOption?.url) {
                window.location.href = selectedOption.url
              }
            }}
          >
            ADD TO CART
          </Button>
        </div>
      </div>

      <div className="mb-6 mt-9">
        <Image
          src="/images/design-mode/pouches-on-ice(2).webp"
          alt="BakeSale Vibes pouches on ice with elegant charcuterie board"
          width={400}
          height={200}
          className="w-full"
          loading="lazy"
        />
      </div>

      <div className="px-6 mb-6 mt-9">
        <h3
          className="font-bold mb-4 text-center text-2xl tracking-tight"
          style={{ color: "#531700" }}
          id="faq-section"
        >
          You're Probably Wondering:
        </h3>
        <div className="space-y-2">
          {faqData.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden" style={{ borderColor: "#E4A830" }}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="flex items-center justify-between p-3 w-full text-left border-0 border-none"
                style={{ color: "#531700" }}
              >
                <span className="text-lg">{faq.question}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`} />
              </button>
              {expandedFaq === index && (
                <div className="px-3 py-3 text-sm border-t" style={{ color: "#531700", borderColor: "#E4A830" }}>
                  {faq.answer === "image" ? (
                    <div className="flex justify-center">
                      <Image
                        src="/images/design-mode/nutritional(2).png"
                        alt="Nutrition Facts"
                        width={300}
                        height={400}
                        className="max-w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{faq.answer}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 mt-0">
        <Image
          src="/images/design-mode/gardening-gradient(2).webp"
          alt="Person gardening with BakeSale Vibes product"
          width={400}
          height={300}
          className="w-full rounded-lg"
          loading="lazy"
        />
      </div>

      <div className="px-6 mb-6 mt-0">
        <div
          className="p-4 rounded-2xl border-2 text-center mb-4"
          style={{ borderColor: "#E4A830", backgroundColor: "#FFF7E6" }}
        >
          <h3 className="font-bold mb-1 text-2xl" style={{ color: "#531700" }}>
            What does Vibes feel like?
          </h3>
          <p className="text-base tracking-tighter" style={{ color: "#531700" }}>
            Hear about the lovely lift and beautiful buzz
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "375/667" }}>
          {!showVideo ? (
            <div className="relative w-full h-full">
              <Image
                src="/images/design-mode/new-video-thumbnail(2).webp"
                alt="What does BakeSale Vibes feel like?"
                width={375}
                height={667}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <button onClick={() => setShowVideo(true)} className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E4A830" }}
                >
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <div style={{ padding: "177.78% 0 0 0", position: "relative" }}>
                <iframe
                  src="https://player.vimeo.com/video/1112971873?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  title="how-does-it-feel"
                />
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity z-10"
                style={{ backgroundColor: "#E4A830" }}
                aria-label="Close video"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 mb-6 mt-9">
        <h3 className="font-bold mb-4 text-center text-2xl" style={{ color: "#531700" }}>
          Perfect for...
        </h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <Image
              src="/images/design-mode/movie-nights(2).webp"
              alt="Movie nights"
              width={80}
              height={80}
              className="w-full aspect-square object-cover rounded-lg mb-2"
              loading="lazy"
            />
            <div className="text-sm font-sans font-medium" style={{ color: "#531700" }}>
              Movie nights
            </div>
          </div>
          <div className="text-center">
            <Image
              src="/images/design-mode/chill(2).png"
              alt="Chill weeknights"
              width={80}
              height={80}
              className="w-full aspect-square object-cover rounded-lg mb-2"
              loading="lazy"
            />
            <div className="font-sans font-semibold text-sm" style={{ color: "#531700" }}>
              Chill weeknights
            </div>
          </div>
          <div className="text-center">
            <Image
              src="/images/design-mode/winding-down(2).webp"
              alt="Winding down"
              width={80}
              height={80}
              className="w-full aspect-square object-cover rounded-lg mb-2"
              loading="lazy"
            />
            <div className="text-sm font-semibold" style={{ color: "#531700" }}>
              Winding down
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <Image
              src="/images/design-mode/book-club(2).webp"
              alt="Book club"
              width={80}
              height={80}
              className="w-full aspect-square object-cover rounded-lg mb-2"
              loading="lazy"
            />
            <div className="font-semibold text-sm font-sans" style={{ color: "#531700" }}>
              Book club
            </div>
          </div>
          <div className="text-center">
            <Image
              src="/images/design-mode/bath(2).png"
              alt="Treating yourself"
              width={80}
              height={80}
              className="w-full aspect-square object-cover rounded-lg mb-2"
              loading="lazy"
            />
            <div className="font-sans text-sm font-semibold" style={{ color: "#531700" }}>
              Treating yourself
            </div>
          </div>
          <div className="text-center">
            <Image
              src="/images/design-mode/resetting(2).png"
              alt="Resetting"
              width={80}
              height={80}
              className="w-full aspect-square object-cover rounded-lg mb-2"
              loading="lazy"
            />
            <div className="text-sm font-semibold" style={{ color: "#531700" }}>
              Resetting
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-24 mb-6 pt-9">
        <Image
          src="/images/design-mode/ways-to-wind-down(2).webp"
          alt="Woman relaxing with art and BakeSale Vibes product"
          width={400}
          height={500}
          className="w-full"
          loading="lazy"
        />
        <div className="absolute top-0 left-0 right-0 p-6 pb-6 pt-0">
          <div className="text-center">
            <h3
              className="font-bold mb-2 leading-tight text-center font-sans text-3xl leading-7"
              style={{ color: "#531700" }}
            >
              Your New Favorite
              <br />
              Way to Wind Down
            </h3>
            <p
              className="text-base leading-relaxed max-w-[280px] mx-auto text-center font-sans leading-5"
              style={{ color: "#531700" }}
            >
              A soft, chocolatey lift that starts in 10 minutes, lasts 90 minutes, and fades with zero fog or hangover.
            </p>
          </div>
        </div>
      </div>

      <section className="px-6 mb-9">
        <h2 className="text-2xl font-bold text-[#531700] text-center mb-6">What People are Saying: </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-[#EDA21C] p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-[#FFF7E6] rounded-full mr-3" />
              <div>
                <p className="font-medium text-[#531700]">Emma T.</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#EDA21C] text-[#EDA21C]" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#531700] leading-relaxed">
              "I love the fact that this will replace a glass of wine or a glass of beer at the end of the day to kind
              of just calm your mind and calm your body."
            </p>
          </div>
          <div className="bg-white rounded-lg border-2 border-[#EDA21C] p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-[#FFF7E6] rounded-full mr-3" />
              <div>
                <p className="font-medium text-[#531700]">Alex J.</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#EDA21C] text-[#EDA21C]" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#531700] leading-relaxed">
              "This is so so good to just like decompress. It really just goes with your mood."
            </p>
          </div>
          <div className="bg-white rounded-lg border-2 border-[#EDA21C] p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-[#FFF7E6] rounded-full mr-3" />
              <div>
                <p className="font-medium text-[#531700]">Maya S.</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#EDA21C] text-[#EDA21C]" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#531700] leading-relaxed">
              "Wait 10 minutes and you are relaxed and ready to go. what better way to end the work week?"
            </p>
          </div>
          <div className="bg-white rounded-lg border-2 border-[#EDA21C] p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-[#FFF7E6] rounded-full mr-3" />
              <div>
                <p className="font-medium text-[#531700]">Ryan P.</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#EDA21C] text-[#EDA21C]" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#531700] leading-relaxed">
              "Honey this is just perfect for unwinding after a day like today. I needed this"
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 mb-9">
        <div className="bg-white rounded-2xl border-2 border-[#EDA21C] p-6 text-center">
          <h2 className="text-2xl font-bold text-[#531700] mb-4 px-5">Ready to try this Chocolatey Chill? </h2>
          <p className="text-base text-[#531700] mb-4 leading-relaxed px-4">
            Brownie flavor. Fast onset. Friendly dose. Get the buzzy treat that's changing how people chill.
          </p>
          <button
            className="font-bold py-3 rounded-lg hover:opacity-90 transition-colors mb-4 w-10/12"
            style={{
              backgroundColor: "#EDA21C",
              color: "#531700",
              fontWeight: 700,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              border: "2px solid #C8851A",
              background: "linear-gradient(135deg, #F0A825 0%, #EDA21C 30%, #EDA21C 70%, #E09818 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
              fontSize: "clamp(10px, 2.8vw, 14px)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)"
            }}
            onClick={() => {
              const el = document.getElementById("pricing-section")
              if (!el) return
              const r = el.getBoundingClientRect()
              const y = (window.pageYOffset || document.documentElement.scrollTop || 0) + r.top
              const vh = window.visualViewport?.height ?? window.innerHeight
              const target = Math.max(0, y - vh / 2 + r.height / 2)
              try {
                window.scrollTo({ top: target, behavior: "smooth" })
              } catch {
                window.scrollTo(0, target)
                ;(document.documentElement as any).scrollTop = target
              }
            }}
          >
            Shop Now
          </button>
          <div
            className="flex text-center justify-evenly mb-0 items-center flex-row text-sm pt-2"
            style={{
              color: "#531700",
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 600,
            }}
          >
            <div className="flex flex-col items-center leading-tight font-sans">
              <div
                className="w-16 h-16 rounded-full mb-2 flex items-center justify-center"
                style={{ backgroundColor: "#F5E6D3" }}
              >
                <Truck className="w-8 h-8" style={{ color: "#531700" }} />
              </div>
              <div className="font-semibold">Free shipping</div>
              <div className="font-semibold">on all orders</div>
            </div>
            <div className="flex flex-col items-center leading-tight font-sans">
              <div
                className="w-16 h-16 rounded-full mb-2 flex items-center justify-center"
                style={{ backgroundColor: "#F5E6D3" }}
              >
                <DollarSign className="w-8 h-8" style={{ color: "#531700" }} />
              </div>
              <div className="font-semibold">Money-back</div>
              <div className="font-semibold">guarantee</div>
            </div>
            <div className="flex flex-col items-center leading-tight font-sans">
              <div
                className="w-16 h-16 rounded-full mb-2 flex items-center justify-center"
                style={{ backgroundColor: "#F5E6D3" }}
              >
                <MapPin className="w-8 h-8" style={{ color: "#531700" }} />
              </div>
              <div className="font-semibold">Ships to</div>
              <div className="font-semibold">42 states</div>
            </div>
          </div>
        </div>
      </section>

      <StickyFooter />
    </div>
  )
}
