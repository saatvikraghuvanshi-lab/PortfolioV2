/**
 * Converts the source screenshots to webp at display resolution.
 * Run once after adding new screenshots: node scripts/optimize-images.mjs
 */
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const roots = [
  { dir: "public/projects", width: 1600 },
  { dir: "public/profile", width: 900 },
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

let saved = 0;

for (const { dir, width } of roots) {
  let files = [];
  try {
    files = await walk(dir);
  } catch {
    continue;
  }

  for (const file of files) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;

    const before = (await stat(file)).size;
    const target = file.replace(/\.(png|jpe?g)$/i, ".webp");

    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(target);

    const after = (await stat(target)).size;
    saved += before - after;
    await unlink(file);

    console.log(
      `${file} → ${path.basename(target)}  ${(before / 1024).toFixed(0)}kB → ${(after / 1024).toFixed(0)}kB`,
    );
  }
}

console.log(`\nSaved ${(saved / 1024 / 1024).toFixed(1)} MB`);
