// scripts/resize-images.mjs
import fs from "fs";
import sharp from "sharp";
import path from "path";

const targets = [
  { name: "icon-", maxWidth: 64 }, // retina version for 32px icons
  { name: "box-thumb-", maxWidth: 150 }, // for 70px thumbs
  { name: "bakesale-vibes-logo", maxWidth: 500 },
  { name: "movie-nights", maxWidth: 500 },
  { name: "book-club", maxWidth: 500 },
  { name: "bath-square", maxWidth: 500 },
  { name: "resetting", maxWidth: 500 },
];

const inputDir = "public/images";
const outputDir = "public/images/optimized";

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

for (const file of fs.readdirSync(inputDir)) {
  const filePath = path.join(inputDir, file);
  const match = targets.find(t => file.includes(t.name));
  if (!match) continue;

  await sharp(filePath)
    .resize({ width: match.maxWidth })
    .toFormat("webp", { quality: 70 })
    .toFile(path.join(outputDir, file.replace(/\.[^.]+$/, ".webp")));

  console.log(`✅ Optimized ${file} → width ${match.maxWidth}px`);
}
