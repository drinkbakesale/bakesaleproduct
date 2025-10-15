# Deployment Guide

This project uses a dual-domain setup with Vercel Blob for static assets.

## Architecture

- **Product Domain**: `product.bakesalevibes.com` - Hosts the Next.js application
- **Landing Domain**: `landing.bakesalevibes.com/product` - Rewrites to product domain
- **Static Assets**: Stored in Vercel Blob for cross-domain access

## Setup

### 1. Environment Variables

Add to your Vercel project settings:

\`\`\`
BLOB_READ_WRITE_TOKEN=your_token_here
\`\`\`

Get this from: Vercel Dashboard → Storage → Blob → Connect

### 2. Deploy Product Domain

\`\`\`bash
# Deploy to product.bakesalevibes.com
vercel --prod
\`\`\`

The `postbuild` script will automatically upload static assets to Vercel Blob.

### 3. Configure Landing Domain

On `landing.bakesalevibes.com`, add this `vercel.json`:

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

## Manual Asset Upload

If you need to manually upload assets:

\`\`\`bash
npm run upload-assets
\`\`\`

## Vercel Blob Structure

Assets are stored with this structure:
\`\`\`
product/
├── .next/static/
│   ├── chunks/
│   └── css/
└── public/images/
    ├── 3-boxes-main-updated.webp
    └── ...
\`\`\`

## Troubleshooting

### Images Not Loading

1. Check Vercel Blob dashboard for uploaded files
2. Verify `assetPrefix` in `next.config.js`
3. Run `npm run upload-assets` manually
4. Check browser console for 404 errors

### Redirect Loop

- Remove `vercel.json` from `product.bakesalevibes.com`
- Only use rewrites on `landing.bakesalevibes.com`

### CSS Not Loading

- Ensure `.next/static` was uploaded to Blob
- Check Network tab for failed CSS requests
- Verify `assetPrefix` matches Blob URL structure
