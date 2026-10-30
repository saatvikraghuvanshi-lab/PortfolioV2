/**
 * Scores a resume PDF the way an applicant tracking system sees it: by reading
 * the extracted text layer, not the rendered page.
 *
 * Usage: node scripts/ats-check.mjs [pdf] [threshold]
 * Default: public/resume.pdf, threshold 80. Exits 1 below the threshold.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pdf = process.argv[2] ?? "public/resume.pdf";
const threshold = Number(process.argv[3] ?? 80);

const pdftotext = (args) =>
  execFileSync("pdftotext", [...args, "-enc", "UTF-8", pdf, "-"], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });

const raw = pdftotext([]);
const layout = pdftotext(["-layout"]);
const bytes = readFileSync(pdf);

const lower = raw.toLowerCase();
const pages = raw.split("\f").filter((page) => page.trim()).length;
// Grammar-agnostic: a bullet is a `•` in the text layer. Extractors that join
// tightly spaced items still keep the glyph, so count items rather than lines.
const bullets = (raw.match(/\u2022/g) ?? []).length;
const layoutItems = layout
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("\u2022"))
  .map((line) => line.slice(1).trim());
const bulletItems = layoutItems.length
  ? layoutItems
  : raw
      .split("\u2022")
      .slice(1)
      .map((item) => item.replace(/\s+/g, " ").trim())
      .filter(Boolean);
const lineBullets = layoutItems.length;

const has = (needle) => lower.includes(needle.toLowerCase());
const count = (regex) => (raw.match(regex) ?? []).length;

const results = [];
const add = (section, label, points, earned, note = "") =>
  results.push({ section, label, points, earned, note });

/* ---------- A. text layer integrity (20) ---------- */

add("Text layer", "Name extracted", 4, has("saatvik raghuvanshi") ? 4 : 0);
add(
  "Text layer",
  "Email as one token",
  4,
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(raw) ? 4 : 0,
);
add("Text layer", "GitHub URL intact", 3, has("github.com/saatvikraghuvanshi-lab") ? 3 : 0);
add(
  "Text layer",
  "LinkedIn URL intact",
  3,
  has("linkedin.com/in/saatvik-raghuvanshi") ? 3 : 0,
);

const broken = count(/\uFFFD/g);
add("Text layer", "No broken glyphs", 3, broken === 0 ? 3 : 0, `${broken} replacement chars`);

const spaced = count(/\b(?:[A-Z]\s){4,}[A-Z]\b/g);
add(
  "Text layer",
  "No letter-spaced words",
  3,
  spaced === 0 ? 3 : 0,
  `${spaced} spaced-out runs`,
);

/* ---------- B. contact block (10) ---------- */

const contactLine = layout
  .split("\n")
  .find((line) => /@/.test(line) || /github\.com/i.test(line));

add("Contact", "Location present", 2, has("jaipur") ? 2 : 0);
add("Contact", "Email present", 2, has("@") ? 2 : 0);
add("Contact", "Profile links present", 2, has("github.com") && has("linkedin.com") ? 2 : 0);
const separated = contactLine ? /\s[|/]\s/.test(contactLine) : false;
add(
  "Contact",
  "Fields separated",
  2,
  separated ? 2 : 0,
  contactLine ? contactLine.trim().slice(0, 72) : "no contact line found",
);
const orphaned = layout.split("\n").filter((line) => /@/.test(line)).length <= 2;
add("Contact", "No orphaned header column", 2, orphaned ? 2 : 0);

/* ---------- C. standard headings (15) ---------- */

for (const [label, pattern] of [
  ["Summary heading", /^\s*(summary|professional summary|profile)\s*$/im],
  ["Experience heading", /^\s*(experience|work experience|professional experience)\s*$/im],
  ["Education heading", /^\s*education\s*$/im],
  ["Skills heading", /^\s*(technical skills|skills)\s*$/im],
  ["Projects heading", /^\s*(projects|selected projects)\s*$/im],
]) {
  add("Headings", label, 3, pattern.test(layout) ? 3 : 0);
}

/* ---------- D. keyword coverage (25) ---------- */

const keywords = [
  "java",
  "typescript",
  "javascript",
  "python",
  "sql",
  "react",
  "next.js",
  "node.js",
  "postgresql",
  "postgis",
  "supabase",
  "prisma",
  "docker",
  "linux",
  "ci/cd",
  "azure",
  "git",
  "github",
  "rest api",
  "geospatial",
  "gis",
  "maplibre",
  "tailwind",
  "figma",
  "cloud run",
  "api",
  "database",
  "full-stack",
];

const found = keywords.filter((keyword) => has(keyword));
const missing = keywords.filter((keyword) => !has(keyword));
const keywordScore = Math.min(25, found.length);
add(
  "Keywords",
  `${found.length} of ${keywords.length} core terms`,
  25,
  keywordScore,
  missing.length ? `missing: ${missing.join(", ")}` : "none missing",
);

/* ---------- E. formatting safety (15) ---------- */

add("Formatting", "One page", 4, pages === 1 ? 4 : pages === 2 ? 2 : 0, `${pages} page(s)`);
add(
  "Formatting",
  "Bullets survive extraction",
  4,
  bullets >= 12 ? 4 : bullets >= 6 ? 2 : 0,
  `${bullets} bullet glyphs, ${lineBullets} at line start`,
);

const fonts = [...bytes.toString("latin1").matchAll(/\/BaseFont\s*\/([A-Za-z0-9+#,-]+)/g)].map(
  (match) => match[1],
);
const standardFont = fonts.some((font) =>
  /arial|helvetica|liberationsans|calibri|times|dejavusans/i.test(font),
);
add("Formatting", "Standard font family", 3, standardFont ? 3 : 0, fonts.join(", ") || "none found");

const longLines = layout.split("\n").filter((line) => line.trim().length > 165).length;
add("Formatting", "No collapsed columns", 2, longLines <= 2 ? 2 : 0, `${longLines} over-long lines`);

// A parseable timeline is ranges plus plain years: ATS parsers read both.
const ranges = count(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+20\d{2}|20\d{2}\s*-\s*(?:present|20\d{2})/gi);
const years = count(/\b20\d{2}\b/g);
add(
  "Formatting",
  "Parseable dates",
  2,
  ranges >= 3 && years >= 8 ? 2 : ranges >= 2 ? 1 : 0,
  `${ranges} ranges, ${years} years`,
);

/* ---------- F. content quality (15) ---------- */

const quantified = bulletItems.filter((item) => /\d/.test(item)).length;
add("Content", "Quantified bullets", 4, quantified >= 8 ? 4 : quantified >= 5 ? 2 : 0, `${quantified} with figures`);

const verbs =
  /^(built|designed|shipped|implemented|completed|split|created|developed|led|deployed|wrote|fused|own|owning|maintain|maintained|architected|automated|delivered|engineered|integrated)\b/i;
const verbHits = bulletItems.filter((item) => verbs.test(item)).length;
add("Content", "Bullets open with action verbs", 4, verbHits >= 8 ? 4 : verbHits >= 4 ? 2 : 0, `${verbHits} verb-first`);

const firstPerson = count(/\b(I|me|my|mine|myself)\b/g);
add("Content", "No first-person pronouns", 3, firstPerson === 0 ? 3 : 0, `${firstPerson} found`);

const exotic = [...raw].filter(
  (character) =>
    character.charCodeAt(0) > 126 && !"•·–—’‘“”·".includes(character) && !/\s/.test(character),
);
add("Content", "ATS-safe characters", 4, exotic.length === 0 ? 4 : 0, `${exotic.length} risky chars: ${[...new Set(exotic)].join(" ")}`);

/* ---------- report ---------- */

const total = results.reduce((sum, result) => sum + result.earned, 0);
const possible = results.reduce((sum, result) => sum + result.points, 0);
const percent = Math.round((total / possible) * 100);

let current = "";
for (const result of results) {
  if (result.section !== current) {
    current = result.section;
    console.log(`\n${current}`);
  }
  const mark = result.earned === result.points ? "  ok " : result.earned > 0 ? " part" : "  -- ";
  const note = result.note ? `  (${result.note})` : "";
  console.log(`${mark} ${result.label.padEnd(34)} ${String(result.earned).padStart(2)}/${result.points}${note}`);
}

console.log(`\nPages: ${pages} | Bullets: ${bullets} | Words: ${raw.trim().split(/\s+/).length}`);
console.log(`ATS score: ${total}/${possible} (${percent}%)  threshold ${threshold}%`);

if (percent < threshold) {
  console.log("FAIL - below threshold");
  process.exit(1);
}
console.log("PASS");
