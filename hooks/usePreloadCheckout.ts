"use client"

import { useEffect } from "react"

export function usePreloadCheckout(selectedQuantity: number, fbclid: string) {
  useEffect(() => {
    const checkoutUrls = [
      `https://bakesalevibes.com/cart/51082491363541:1?checkout${fbclid ? `&fbclid=${fbclid}` : ""}`,
      `https://bakesalevibes.com/cart/51082491363541:2?checkout${fbclid ? `&fbclid=${fbclid}` : ""}`,
      `https://bakesalevibes.com/cart/51082491363541:3?checkout${fbclid ? `&fbclid=${fbclid}` : ""}`,
    ]

    const shopifyAssets = [
      "https://cdn.shopify.com/s/checkout/checkout-1.0.css",
      "https://cdn.shopify.com/s/checkout/checkout-1.0.js",
      "https://cdn.shopify.com/shopifycloud/checkout-web/assets/inputs-13a57105af.css",
      "https://checkout.pci.shopifycs.com/field-boot-277ecd71f5.js",
      "https://checkout.pci.shopifycs.com/frame_ant.js",
      "https://cdn.shopify.com/shopifycloud/checkout-web/assets/treemapper.js",
    ]

    const handleLoad = () => {
      // Prefetch the selected quantity URL immediately
      const selectedUrl = checkoutUrls[selectedQuantity - 1]
      if (selectedUrl) {
        const priorityLink = document.createElement("link")
        priorityLink.rel = "prefetch"
        priorityLink.href = selectedUrl
        priorityLink.as = "document"
        document.head.appendChild(priorityLink)
      }

      // Prefetch other checkout URLs with lower priority
      setTimeout(() => {
        checkoutUrls.forEach((url, index) => {
          if (index !== selectedQuantity - 1) {
            const link = document.createElement("link")
            link.rel = "prefetch"
            link.href = url
            link.as = "document"
            document.head.appendChild(link)
          }
        })
      }, 1000)

      // Prefetch Shopify core assets
      shopifyAssets.forEach((url) => {
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = url
        document.head.appendChild(link)
      })
    }

    window.addEventListener("load", handleLoad)
    return () => window.removeEventListener("load", handleLoad)
  }, [selectedQuantity, fbclid])
}
