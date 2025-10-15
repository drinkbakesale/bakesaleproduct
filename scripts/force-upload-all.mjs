import fs from "fs";
import path from "path";
import { put, del, list } from "@vercel/blob";

const ROOT = process.cwd();

async function forceUploadAll() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN is not set!");
    process.exit(1);
  }

  console.log("🗑️  Clearing old product files from Blob storage...");
  
  try {
    const { blobs } = await list({ 
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix: 'product/'
    });
    
    console.log(`   Found ${blobs.length} files to delete`);
    
    for (const blob of blobs) {
      await del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
      console.log(`   🗑️  Deleted: ${blob.pathname}`);
    }
    
    console.log("✅ Cleared old files\n");
  } catch (error) {
    console.warn(`⚠️  Could not clear old files: ${error.message}\n`);
  }

  console.log("📤 Uploading all files...\n");
  
  // Now run the normal upload
  const { default: upload } = await import('../upload-static-to-blob.mjs');
}

forceUploadAll();
