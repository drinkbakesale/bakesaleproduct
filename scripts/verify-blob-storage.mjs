import { list } from "@vercel/blob";

async function verifyStorage() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN is not set!");
    process.exit(1);
  }

  console.log("🔍 Checking Vercel Blob storage...\n");

  try {
    // List all files
    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
    
    console.log(`📦 Total files in storage: ${blobs.length}\n`);
    
    // Group by type
    const images = blobs.filter(b => b.pathname.includes('public/images/'));
    const videos = blobs.filter(b => b.pathname.includes('public/videos/'));
    const staticFiles = blobs.filter(b => b.pathname.includes('.next/static/'));
    
    console.log(`📸 Images: ${images.length}`);
    console.log(`🎥 Videos: ${videos.length}`);
    console.log(`📄 Static files: ${staticFiles.length}\n`);
    
    // Show sample URLs
    console.log("📋 Sample URLs:");
    console.log("\nImages:");
    images.slice(0, 5).forEach(blob => {
      console.log(`   ${blob.pathname}`);
      console.log(`   → ${blob.url}\n`);
    });
    
    if (images.length === 0) {
      console.log("⚠️  No images found! Run: npm run upload-assets");
    }
    
    // Check for specific images used in the product page
    const requiredImages = [
      'product/public/images/3-boxes-main-updated.webp',
      'product/public/images/box-thumb-2-new.webp',
      'product/public/images/bakesale-vibes-logo.png',
      'product/public/images/icon-calories-new.png',
    ];
    
    console.log("\n✅ Required images check:");
    requiredImages.forEach(required => {
      const exists = blobs.some(b => b.pathname === required);
      console.log(`   ${exists ? '✅' : '❌'} ${required}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

verifyStorage();
