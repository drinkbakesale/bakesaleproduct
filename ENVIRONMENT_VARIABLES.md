# Environment Variables Guide

## Required Variables

### BLOB_READ_WRITE_TOKEN
**Value:** `vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY`

**Purpose:** Allows uploading and accessing files in Vercel Blob storage

**Where to add:**
- Local: Add to `.env.local`
- Vercel: Add in Project Settings → Environment Variables
- Scope: Production, Preview, Development

---

### NEXT_PUBLIC_DOMAIN
**Value:** `product.bakesalevibes.com`

**Purpose:** Tells the app which domain it's deployed on

**Where to add:**
- Local: Add to `.env.local`
- Vercel: Add in Project Settings → Environment Variables
- Scope: Production, Preview, Development

**Why this value?**
- Your Next.js app is deployed to `product.bakesalevibes.com`
- The `landing.bakesalevibes.com/product` URL just **rewrites** to the product domain
- There's only ONE deployment, so use the primary domain

---

## How to Add to Vercel

### Method 1: Via Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

\`\`\`
Name: BLOB_READ_WRITE_TOKEN
Value: vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY
Environments: ✅ Production ✅ Preview ✅ Development
\`\`\`

\`\`\`
Name: NEXT_PUBLIC_DOMAIN
Value: product.bakesalevibes.com
Environments: ✅ Production ✅ Preview ✅ Development
\`\`\`

5. Click **Save**
6. **Redeploy** your project for changes to take effect

### Method 2: Via CLI
\`\`\`bash
# Add BLOB_READ_WRITE_TOKEN
vercel env add BLOB_READ_WRITE_TOKEN production
# Paste: vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY

# Add NEXT_PUBLIC_DOMAIN
vercel env add NEXT_PUBLIC_DOMAIN production
# Paste: product.bakesalevibes.com

# Add to preview environments too
vercel env add BLOB_READ_WRITE_TOKEN preview
vercel env add NEXT_PUBLIC_DOMAIN preview
\`\`\`

---

## Quick Setup Checklist

### Local Development
- [ ] Create `.env.local` file in project root
- [ ] Add `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY`
- [ ] Add `NEXT_PUBLIC_DOMAIN=product.bakesalevibes.com`
- [ ] Run `npm install`
- [ ] Run `npm run verify-blob` to test connection

### Vercel Production
- [ ] Add `BLOB_READ_WRITE_TOKEN` to environment variables
- [ ] Add `NEXT_PUBLIC_DOMAIN` to environment variables
- [ ] Select all environments (Production, Preview, Development)
- [ ] Redeploy the project
- [ ] Test at `https://product.bakesalevibes.com`
- [ ] Test at `https://landing.bakesalevibes.com/product`

---

## Verification

### Test Blob Connection Locally
\`\`\`bash
npm run verify-blob
\`\`\`

Expected output:
\`\`\`
🔍 Checking Vercel Blob storage...
📦 Total files in storage: X
📸 Images: X
🎥 Videos: X
\`\`\`

### Test in Production
After deploying, check Vercel deployment logs:
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check **Build Logs** for upload confirmation
4. Should see: `✅ Uploaded: X files`

---

## Troubleshooting

### "BLOB_READ_WRITE_TOKEN is not set"
- Check `.env.local` exists in project root (for local)
- Check Vercel environment variables (for production)
- Restart your dev server: `npm run dev`

### "Cannot connect to Blob storage"
- Verify token is correct (no extra spaces)
- Check token hasn't expired
- Try regenerating token in Vercel Blob dashboard

### Changes Not Taking Effect in Production
- Environment variable changes require a **redeploy**
- Simply adding variables doesn't update existing deployments
- Click "Redeploy" in Vercel dashboard
\`\`\`

---

## Summary

**For your setup:**

\`\`\`bash
# .env.local (local development)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY
NEXT_PUBLIC_DOMAIN=product.bakesalevibes.com
\`\`\`

**Vercel Environment Variables (production):**
- `BLOB_READ_WRITE_TOKEN` = `vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY`
- `NEXT_PUBLIC_DOMAIN` = `product.bakesalevibes.com`
