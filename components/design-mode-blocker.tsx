"use client"

import { useEffect } from "react"

export function DesignModeBlocker() {
  useEffect(() => {
    // 🚫 Disable all traces of Vercel Design Mode
    ;(window as any).__VERCEL_DESIGN_MODE = false

    // Block any fetch or XHR requests containing "design-mode"
    const origFetch = window.fetch
    window.fetch = async (...args: any[]) => {
      if (args[0]?.toString().includes("design-mode")) {
        console.warn("🚫 Blocked design-mode fetch:", args[0])
        return new Response("", { status: 404 })
      }
      return origFetch(...args)
    }

    const origOpen = window.XMLHttpRequest.prototype.open
    window.XMLHttpRequest.prototype.open = function (...args: any[]) {
      if (args[1] && args[1].includes("design-mode")) {
        console.warn("🚫 Blocked design-mode XHR:", args[1])
        return
      }
      return origOpen.apply(this, args as any)
    }

    // Block <img> tags that point to design-mode URLs
    const observer = new MutationObserver(() => {
      document.querySelectorAll("img").forEach((img) => {
        if (img.src.includes("design-mode")) {
          console.warn("🚫 Blocked design-mode <img>:", img.src)
          img.src = ""
          img.remove()
        }
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
