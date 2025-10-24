import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense, useEffect } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "BakeSale Vibes - Premium Brownie Beverages",
  description:
    "Premium brownie-flavored beverages with 3mg plant magic. Fast onset, friendly dose.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    // 🚫 Disable all traces of Vercel Design Mode
    window.__VERCEL_DESIGN_MODE = false

    // Block any fetch or XHR requests containing "design-mode"
    const origFetch = window.fetch
    window.fetch = async (...args) => {
      if (args[0]?.toString().includes("design-mode")) {
        console.warn("🚫 Blocked design-mode fetch:", args[0])
        return new Response("", { status: 404 })
      }
      return origFetch(...args)
    }

    const origOpen = window.XMLHttpRequest.prototype.open
    window.XMLHttpRequest.prototype.open = function (...args) {
      if (args[1] && args[1].includes("design-mode")) {
        console.warn("🚫 Blocked design-mode XHR:", args[1])
        return
      }
      return origOpen.apply(this, args)
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
  }, [])

  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
body { margin: 0; padding: 0; background-color: #fff; }
.min-h-screen { min-height: 100vh; }
.relative { position: relative; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.text-center { text-align: center; }
.w-full { width: 100%; }
.h-auto { height: auto; }
.max-w-md { max-width: 28rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.text-lg { font-size: 1.125rem; }
.font-bold { font-weight: 700; }
.rounded-lg { border-radius: 0.5rem; }
.transition-colors { 
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
        `}</style>

        <link rel="preconnect" href="https://edge.fullstory.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              // ⏰ Cart prefetch script (unchanged)
              function waitForEverything() {
                return new Promise((resolve) => {
                  let isResolved = false;
                  const checkpoints = {
                    domReady: false,
                    imagesLoaded: false,
                    scriptsLoaded: false,
                    timeoutReached: false
                  };
                  function checkCompletion() {
                    if (isResolved) return;
                    const allReady = Object.values(checkpoints).every(Boolean) || checkpoints.timeoutReached;
                    if (allReady) { isResolved = true; resolve(); }
                  }
                  if (document.readyState === 'complete') {
                    checkpoints.domReady = true; checkCompletion();
                  } else {
                    window.addEventListener('load', () => { checkpoints.domReady = true; checkCompletion(); });
                  }
                  setTimeout(() => {
                    const lazy = document.querySelectorAll('img[loading="lazy"], img[data-src]');
                    let remaining = lazy.length;
                    if (remaining === 0) { checkpoints.imagesLoaded = true; checkCompletion(); return; }
                    lazy.forEach(img => {
                      if (img.complete) { remaining--; if (remaining===0){checkpoints.imagesLoaded=true;checkCompletion();}}
                      else img.addEventListener('load', ()=>{remaining--;if(remaining===0){checkpoints.imagesLoaded=true;checkCompletion();}});
                    });
                  },1000);
                  setTimeout(()=>{checkpoints.scriptsLoaded=true;checkCompletion();},2000);
                  setTimeout(()=>{checkpoints.timeoutReached=true;console.log('⏰ Product page timeout reached, proceeding with prefetch');checkCompletion();},8000);
                });
              }
              waitForEverything().then(prefetchCartPages);
              function prefetchCartPages() {
                if ('connection' in navigator) {
                  const c = navigator.connection;
                  if (c.saveData || c.effectiveType==='slow-2g' || c.effectiveType==='2g') {
                    console.log('⚠️ Skipping cart prefetch due to slow connection'); return;
                  }
                }
                ['https://landing.bakesalevibes.com/cart?qty=1',
                 'https://landing.bakesalevibes.com/cart?qty=2',
                 'https://landing.bakesalevibes.com/cart?qty=3']
                 .forEach(u=>{const l=document.createElement('link');l.rel='prefetch';l.href=u;document.head.appendChild(l);});
                console.log('✅ Cart pages safely prefetched from product page');
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
