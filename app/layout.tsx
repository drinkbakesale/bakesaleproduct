import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "BakeSale Vibes - Premium Brownie Beverages",
  description: "Premium brownie-flavored beverages with 3mg plant magic. Fast onset, friendly dose.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Critical CSS - loads immediately */}
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}

/* Critical styles for above-the-fold content */
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

        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://edge.fullstory.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Delayed Analytics Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Delay all analytics until after page loads
              window.addEventListener('load', function() {
                setTimeout(function() {
                  // Load FullStory
                  window._fs_debug = false;
                  window._fs_host = 'fullstory.com';
                  window._fs_script = 'edge.fullstory.com/s/fs.js';
                  window._fs_org = 'o-23VPPF-na1';
                  window._fs_namespace = 'FS';
                  (function(m,n,e,t,l,o,g,y){
                      if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                      g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                      o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+l;
                      y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                      g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                      g.anonymize=function(){g.identify(!!0)};
                      g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                      g.log = function(a,b){g("log",[a,b])};
                      g.consent=function(a){g("consent",!arguments.length||a)};
                      g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                      g.clearUserCookie=function(){};
                      g.setVars=function(n, p){g('setVars',[n,p]);};
                      g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                      if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                      g._v="1.3.0";
                  })(window,document,window._fs_namespace,'script',window._fs_script);
                }, 1000);

                // Load Google Tag Manager with delay
                setTimeout(function() {
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-M9LHLSBR');
                }, 500);
              });
            `,
          }}
        />
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>

        {/* Vercel Analytics - loads after everything else */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                setTimeout(function() {
                  // Vercel Analytics will load here after delay
                }, 1500);
              });
            `,
          }}
        />
        <Analytics />

        {/* Cart Prefetch Script - loads after everything else */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
                    
                    const allReady = Object.values(checkpoints).every(ready => ready) || 
                                    checkpoints.timeoutReached;
                    
                    if (allReady) {
                      isResolved = true;
                      resolve();
                    }
                  }
                  
                  // 1. Wait for DOM and initial resources
                  if (document.readyState === 'complete') {
                    checkpoints.domReady = true;
                    checkCompletion();
                  } else {
                    window.addEventListener('load', () => {
                      checkpoints.domReady = true;
                      checkCompletion();
                    });
                  }
                  
                  // 2. Wait for lazy images
                  setTimeout(() => {
                    const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
                    let remainingImages = lazyImages.length;
                    
                    if (remainingImages === 0) {
                      checkpoints.imagesLoaded = true;
                      checkCompletion();
                      return;
                    }
                    
                    lazyImages.forEach(img => {
                      if (img.complete) {
                        remainingImages--;
                        if (remainingImages === 0) {
                          checkpoints.imagesLoaded = true;
                          checkCompletion();
                        }
                      } else {
                        img.addEventListener('load', () => {
                          remainingImages--;
                          if (remainingImages === 0) {
                            checkpoints.imagesLoaded = true;
                            checkCompletion();
                          }
                        });
                      }
                    });
                  }, 1000);
                  
                  // 3. Wait for any pending scripts
                  setTimeout(() => {
                    checkpoints.scriptsLoaded = true;
                    checkCompletion();
                  }, 2000);
                  
                  // 4. Safety timeout (don't wait forever)
                  setTimeout(() => {
                    checkpoints.timeoutReached = true;
                    console.log('⏰ Product page timeout reached, proceeding with prefetch');
                    checkCompletion();
                  }, 8000); // 8 second max wait
                });
              }

              // Execute prefetch after everything is loaded
              waitForEverything().then(() => {
                prefetchCartPages();
              });

              function prefetchCartPages() {
                // Check connection quality first
                if ('connection' in navigator) {
                  const conn = navigator.connection;
                  if (conn.saveData || 
                      conn.effectiveType === 'slow-2g' || 
                      conn.effectiveType === '2g') {
                    console.log('⚠️ Skipping cart prefetch due to slow connection');
                    return;
                  }
                }
                
                // Only prefetch same-domain cart pages (100% safe)
                const cartUrls = [
                  'https://landing.bakesalevibes.com/cart?qty=1',
                  'https://landing.bakesalevibes.com/cart?qty=2', 
                  'https://landing.bakesalevibes.com/cart?qty=3'
                ];
                
                cartUrls.forEach(url => {
                  const link = document.createElement('link');
                  link.rel = 'prefetch';
                  link.href = url;
                  document.head.appendChild(link);
                });
                
                console.log('✅ Cart pages safely prefetched from product page');
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
