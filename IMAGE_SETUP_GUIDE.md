# Image Setup Guide for Cross-Domain Access

## How It Works

Images are uploaded to **Vercel Blob Storage** so they can be accessed from both:
- `product.bakesalevibes.com` (direct access)
- `landing.bakesalevibes.com/product` (rewrite access)

## Step-by-Step Setup

### 1. Upload Images to Blob Storage

\`\`\`bash
# Install dependencies
npm install

# Upload all images and assets
npm run upload-assets
\`\`\`

This will upload:
- All files in `public/images/`
- All files in `public/videos/`
- All Next.js static files from `.next/static/`

### 2. Verify Upload

\`\`\`bash
npm run verify-blob
\`\`\`

You should see output like:
\`\`\`
📦 Total files in storage: 45
📸 Images: 30
🎥 Videos: 1
📄 Static files: 14
\`\`\`

### 3. Check Required Images

The verify script will check for required images:
\`\`\`
✅ Required images check:
   ✅ product/public/images/3-boxes-main-updated.webp
   ✅ product/public/images/box-thumb-2-new.webp
   ✅ product/public/images/bakesale-vibes-logo.png
\`\`\`

### 4. Deploy

\`\`\`bash
vercel --prod
\`\`\`

The `postbuild` script automatically uploads assets after every build.

## Troubleshooting

### Images Not Showing

1. **Verify upload succeeded:**
   \`\`\`bash
   npm run verify-blob
   \`\`\`

2. **Check browser console** for 404 errors and note the failing URLs

3. **Force re-upload all files:**
   \`\`\`bash
   npm run force-upload
   \`\`\`

4. **Check Vercel Blob Dashboard:**
   Visit: https://vercel.com/dashboard/stores
   Look for files with prefix `product/public/images/`

### Images Load on One Domain But Not the Other

This means the rewrite isn't configured correctly.

**On `landing.bakesalevibes.com`:**
\`\`\`json
{
  "rewrites": [
    {
      "source": "/product",
      "destination": "https://product.bakesalevibes.com"
    }
  ]
}
\`\`\`

**On `product.bakesalevibes.com`:**
- Should have NO `vercel.json` file

### Blob URLs vs. Local URLs

Current implementation uses hardcoded URLs in the component:
\`\`\`typescript
src="/images/design-mode/3-boxes-main-updated.webp"
\`\`\`

These URLs work because:
1. On `product.bakesalevibes.com` → Next.js serves from `public/`
2. On `landing.bakesalevibes.com/product` → Rewrite makes it work

The Blob storage acts as a **backup/CDN** and ensures files are available even if the rewrite fails.

## Manual Verification

Check if a specific image exists in Blob:
\`\`\`bash
curl -I "https://blob.vercel-storage.com/product/public/images/3-boxes-main-updated.webp"
\`\`\`

Should return `200 OK` if the file exists.

## Best Practices

1. ✅ **Always run upload after adding new images**
2. ✅ **Verify uploads before deploying**
3. ✅ **Use `npm run verify-blob` to check storage**
4. ✅ **Keep blob storage in sync with public folder**
5. ❌ **Don't manually delete blobs** (use `force-upload` to reset)
