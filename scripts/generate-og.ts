import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { generateOgImage } from "../src/lib/og-image.ts";

const DIGESTS_DIR = path.resolve("src/content/digests");
const OUTPUT_DIR = path.resolve("public/og");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(DIGESTS_DIR, { recursive: true });

const files = fs.readdirSync(DIGESTS_DIR).filter((f) => f.endsWith(".yaml"));

for (const file of files) {
  const date = file.replace(".yaml", "");
  const outputPath = path.join(OUTPUT_DIR, `${date}.png`);

  // Skip if already generated
  if (fs.existsSync(outputPath)) {
    console.log(`  skip ${date} (exists)`);
    continue;
  }

  const content = fs.readFileSync(path.join(DIGESTS_DIR, file), "utf-8");
  const data = parse(content);

  console.log(`  generating ${date}...`);
  const png = await generateOgImage(date, data.stories);
  fs.writeFileSync(outputPath, png);
  console.log(`  ✓ ${date}`);
}

console.log("Done.");
