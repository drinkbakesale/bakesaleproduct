# Quick Setup Instructions

## Step 1: Environment Variables

### Local Development
Create `.env.local` in your project root:
\`\`\`bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY
NEXT_PUBLIC_DOMAIN=product.bakesalevibes.com
\`\`\`

### Vercel Production
Add to project settings (Settings → Environment Variables):
\`\`\`
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_MgHzzPN2s9iXRl0b_9H9pIHbJGKGhhTbE8I7sDHmz1B0TVY
NEXT_PUBLIC_DOMAIN=product.bakesalevibes.com
\`\`\`

## Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Step 3: Build and Upload Assets

### Automatic (Recommended)
\`\`\`bash
npm run build
\`\`\`
Assets will automatically upload after build via the `postbuild` script.

### Manual Upload
\`\`\`bash
npm run upload-assets
\`\`\`

## Step 4: Deploy

\`\`\`bash
vercel --prod
\`\`\`

## Step 5: Configure Landing Domain

On `landing.bakesalevibes.com`, ensure you have this `vercel.json`:

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

## Step 6: Verify

1. Visit `https://product.bakesalevibes.com` - should work
2. Visit `https://landing.bakesalevibes.com/product` - should also work
3. Check that images load on both domains

## Troubleshooting

### Assets Not Uploading
\`\`\`bash
# Check if token is set
echo $BLOB_READ_WRITE_TOKEN

# Try manual upload
npm run upload-assets
\`\`\`

### Images Still 404
1. Check Vercel Blob dashboard: https://vercel.com/dashboard/stores
2. Verify files were uploaded with prefix `product/`
3. Check browser console for actual failing URLs

### Redirect Loop
- Make sure `vercel.json` is ONLY on `landing.bakesalevibes.com`
- Make sure `product.bakesalevibes.com` has NO `vercel.json`

## Success Checklist

- [ ] `.env.local` created with token
- [ ] Dependencies installed (`npm install`)
- [ ] Project builds successfully (`npm run build`)
- [ ] Assets uploaded to Blob (check logs)
- [ ] Deployed to Vercel (`vercel --prod`)
- [ ] Images load on `product.bakesalevibes.com`
- [ ] Images load on `landing.bakesalevibes.com/product`
- [ ] No redirect loops
