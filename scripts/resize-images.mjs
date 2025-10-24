import fs from "fs";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targets = [
  { name: "icon-", maxWidth: 64 }, // retina version for 32px icons
  { name: "box-thumb-", maxWidth: 150 }, // for 70px thumbs
  { name: "bakesale-vibes-logo", maxWidth: 500 },
  { name: "movie-nights", maxWidth: 500 },
  { name: "book-club", maxWidth: 500 },
  { name: "bath-square", maxWidth: 500 },
  { name: "chill-outs", maxWidth: 500 },
  { name: "winding-down", maxWidth: 500 },
  { name: "resetting", maxWidth: 500 },
  { name: "3-boxes-main", maxWidth: 800 },
  { name: "pouches-on-ice", maxWidth: 800 },
  { name: "gardening-gradient", maxWidth: 800 },
  { name: "ways-to-wind-down", maxWidth: 800 },
];

const projectRoot = path.resolve(__dirname, "..");
const inputDir = path.join(projectRoot, "public/images");
const outputDir = path.join(projectRoot, "public/images/optimized");

async function optimizeImages() {
  console.log("🔍 Starting image optimization...");
  console.log(`📂 Input: ${inputDir}`);
  console.log(`📂 Output: ${outputDir}\n`);

  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory not found: ${inputDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created output directory\n`);
  }

  const files = fs.readdirSync(inputDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  console.log(`Found ${files.length} image files\n`);

  let optimized = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const match = targets.find(t => file.includes(t.name));
    
    if (!match) {
      console.log(`⏭️  Skipped: ${file} (no matching rule)`);
      skipped++;
      continue;
    }

    try {
      const outputFile = file.replace(/\.[^.]+$/, ".webp");
      const outputPath = path.join(outputDir, outputFile);

      await sharp(filePath)
        .resize({ width: match.maxWidth, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const inputStats = fs.statSync(filePath);
      const outputStats = fs.statSync(outputPath);
      const savings = Math.round((1 - outputStats.size / inputStats.size) * 100);

      console.log(`✅ ${file} → ${outputFile}`);
      console.log(`   ${match.maxWidth}px wide, ${savings}% smaller\n`);
      optimized++;
    } catch (error) {
      console.error(`❌ Failed to optimize ${file}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Optimized: ${optimized}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log("=".repeat(50));
}

optimizeImages().catch(error => {
  console.error("❌ Optimization failed:", error);
  process.exit(1);
});
