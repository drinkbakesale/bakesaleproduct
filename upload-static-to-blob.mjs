import fs from "fs";
import path from "path";
import crypto from "crypto";
import mime from "mime";
import { put, list } from "@vercel/blob";

// folders to include
const FOLDERS = [
  ".next/static",
  "public/images",
  "public/videos",
  "public/fonts",
];

const ROOT = process.cwd();
const PREFIX = "product/";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!TOKEN) {
  console.error("❌  Missing BLOB_READ_WRITE_TOKEN environment variable.");
  process.exit(1);
}

function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(data).digest("hex");
}

async function main() {
  console.log("🚀 Uploading assets to Vercel Blob…");

  let uploaded = 0,
    skipped = 0,
    failed = 0;

  // fetch existing blobs (with short timeout protection)
  const existing = new Map();
  try {
    const { blobs } = await list({ token: TOKEN, prefix: PREFIX });
    for (const b of blobs) existing.set(b.pathname, b);
    console.log(`📋 Found ${existing.size} existing blobs`);
  } catch (e) {
    console.warn("⚠️  Could not list existing blobs, uploading all");
  }

  for (const folder of FOLDERS) {
    const abs = path.join(ROOT, folder);
    if (!fs.existsSync(abs)) {
      console.log(`⚠️  Skipping missing folder: ${folder}`);
      continue;
    }

    const files = (function listAll(dir) {
      return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? listAll(path.join(dir, d.name)) : path.join(dir, d.name)
      );
    })(abs);

    for (const file of files) {
      const rel = file.replace(ROOT + "/", "").replace(/^public\//, "");
      const dest = PREFIX + rel;
      const hash = hashFile(file);
      const contentType = mime.getType(file) || "application/octet-stream";

      const existingBlob = existing.get(dest);
      if (existingBlob && existingBlob.md5Hash && existingBlob.md5Hash === hash) {
        console.log(`⏭️  ${rel} (unchanged)`);
        skipped++;
        continue;
      }

      try {
        const buffer = fs.readFileSync(file);
        const { url } = await put(dest, buffer, {
          token: TOKEN,
          access: "public",
          contentType,
          cacheControlMaxAge: 31536000, // 1 year
          addRandomSuffix: false,
        });
        console.log(`✅  ${rel} → ${url}`);
        uploaded++;
      } catch (err) {
        console.error(`❌  ${rel}: ${err.message}`);
        failed++;
      }
    }
  }

  console.log("\n───────────────────────────────────────────────");
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`⏭️  Skipped : ${skipped}`);
  console.log(`❌ Failed  : ${failed}`);
  console.log("───────────────────────────────────────────────\n");
}

main().catch((e) => {
  console.error("❌ Upload failed:", e);
  process.exit(1);
});
