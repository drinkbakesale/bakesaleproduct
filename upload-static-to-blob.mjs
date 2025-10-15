import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

const ROOT = process.cwd();
const foldersToUpload = [
  ".next/static",
  "public/images",
  "public/videos"
];

async function uploadFiles() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN is not set!");
    console.log("Add it to your .env.local file or Vercel environment variables");
    process.exit(1);
  }

  console.log("🚀 Starting asset upload to Vercel Blob...");
  console.log(`📦 Token: ${process.env.BLOB_READ_WRITE_TOKEN.substring(0, 20)}...`);

  let totalUploaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  const existingFiles = new Set();
  try {
    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
    blobs.forEach(blob => existingFiles.add(blob.pathname));
    console.log(`📋 Found ${existingFiles.size} existing files in Blob storage`);
  } catch {
    console.log("⚠️  Could not list existing files, will upload all");
  }

  for (const folder of foldersToUpload) {
    const fullPath = path.join(ROOT, folder);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipping ${folder} (not found)`);
      continue;
    }

    console.log(`\n📁 Processing ${folder}...`);

    const allFiles = (function listAll(dir) {
      return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? listAll(path.join(dir, d.name)) : path.join(dir, d.name)
      );
    })(fullPath);

    console.log(`   Found ${allFiles.length} files`);

    for (const filePath of allFiles) {
      const rel = filePath.replace(ROOT + "/", "");

      // Clean up "public/" so images/videos end up at /product/images/... instead of /product/public/images/...
      const normalizedRel = rel.startsWith("public/")
        ? rel.replace("public/", "")
        : rel;

      const dest = `product/${normalizedRel}`;

      if (existingFiles.has(dest)) {
        console.log(`   ⏭️  ${normalizedRel} (already exists)`);
        totalSkipped++;
        continue;
      }

      try {
        const data = fs.readFileSync(filePath);
        const res = await put(dest, data, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        console.log(`   ✅ ${normalizedRel.padEnd(50)} → ${res.url.substring(0, 60)}...`);
        totalUploaded++;
      } catch (error) {
        console.error(`   ❌ ${normalizedRel}: ${error.message}`);
        totalFailed++;
      }
    }
  }

  console.log(`\n${"=".repeat(80)}`);
  console.log(`🎉 Upload Complete!`);
  console.log(`   ✅ Uploaded: ${totalUploaded}`);
  console.log(`   ⏭️  Skipped: ${totalSkipped}`);
  if (totalFailed > 0) console.log(`   ❌ Failed: ${totalFailed}`);
  console.log(`${"=".repeat(80)}\n`);

  console.log(`\n📸 Verifying uploaded images...`);
  try {
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix: "product/images/"
    });
    console.log(`\n✅ ${blobs.length} images found in Blob storage:`);
    blobs.slice(0, 10).forEach(blob => {
      console.log(`   ${blob.pathname} → ${blob.url}`);
    });
  } catch (error) {
    console.warn(`⚠️  Could not verify images: ${error.message}`);
  }
}

uploadFiles().catch((error) => {
  console.error("\n❌ Upload failed:", error);
  process.exit(1);
});
