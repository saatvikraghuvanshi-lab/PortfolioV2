/**
 * Copies the brand marks used by the capability board from simple-icons
 * into public/logos. They are served as local assets and used as CSS masks,
 * so no icon library ships to the browser.
 *
 * Run after upgrading simple-icons: node scripts/copy-logos.mjs
 */
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const slugs = [
  "openjdk",
  "typescript",
  "javascript",
  "python",
  "c",
  "html5",
  "css",
  "react",
  "nextdotjs",
  "vite",
  "tailwindcss",
  "shadcnui",
  "radixui",
  "redux",
  "framer",
  "maplibre",
  "leaflet",
  "nodedotjs",
  "postgresql",
  "supabase",
  "prisma",
  "convex",
  "googlegemini",
  "git",
  "github",
  "vercel",
  "cloudflare",
  "netlify",
  "googlecloud",
  "docker",
  "linux",
  "figma",
  "autodesk",
];

await mkdir("public/logos", { recursive: true });

for (const slug of slugs) {
  const source = path.join("node_modules", "simple-icons", "icons", `${slug}.svg`);
  await copyFile(source, path.join("public/logos", `${slug}.svg`));
}

console.log(`Copied ${slugs.length} logos to public/logos`);
