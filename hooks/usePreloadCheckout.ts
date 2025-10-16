"use client"

import { useEffect } from "react"

export function usePreloadCheckout(selectedQuantity: number, fbclid: string) {
  useEffect(() => {
    // Only prefetch cart pages (not checkout pages that cause 404s)
    const cartUrls = [
      `https://landing.bakesalevibes.com/checkout?qty=1${fbclid ? `&fbclid=${fbclid}` : ""}`,
      `https://landing.bakesalevibes.com/checkout?qty=2${fbclid ? `&fbclid=${fbclid}` : ""}`,
      `https://landing.bakesalevibes.com/checkout?qty=3${fbclid ? `&fbclid=${fbclid}` : ""}`,
    ]

    const handleLoad = () => {
      // Prefetch the selected quantity URL immediately
      const selectedUrl = cartUrls[selectedQuantity - 1]
      if (selectedUrl) {
        const priorityLink = document.createElement("link")
        priorityLink.rel = "prefetch"
        priorityLink.href = selectedUrl
        priorityLink.as = "document"
        document.head.appendChild(priorityLink)
      }

      // Prefetch other cart URLs with lower priority
      setTimeout(() => {
        cartUrls.forEach((url, index) => {
          if (index !== selectedQuantity - 1) {
            const link = document.createElement("link")
            link.rel = "prefetch"
            link.href = url
            link.as = "document"
            document.head.appendChild(link)
          }
        })
      }, 1000)
    }

    // Only run after page is fully loaded
    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [selectedQuantity, fbclid])
}
