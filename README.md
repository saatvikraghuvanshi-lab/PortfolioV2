# Saatvik Raghuvanshi — Portfolio

An editorial portfolio built for the 2026 design submission. Bone paper, ink, a single oxblood
accent, brass hairlines, Instrument Serif display type and a hand-written CSS system — no UI kit,
no template.

Every screenshot is from a running application — twelve of them for the Airport Management System,
including its boarding pass, seat map, operations console and the database schema. Projects without
reliable screenshots fall back to a designed cover rather than an empty frame.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Hand-written CSS (`app/globals.css`) |
| Motion | `motion` (Framer Motion) |
| Hosting | Any static host — Vercel, Cloudflare Pages, Netlify |

`output: "export"` means the build is plain HTML/CSS/JS in `out/`. There is no server, no
database and no runtime dependency.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # writes ./out
```

Serve the export locally to check the production build:

```bash
npx serve out
```

## Deploy

**Vercel** — import the repository, set the root directory to `portfolio/`. Vercel detects
Next.js and the static export automatically.

**Cloudflare Pages** — build command `npm run build`, output directory `out`. Framework preset:
Next.js (Static HTML Export).

After deploying, update `site.url` in `lib/site.ts` so canonical URLs, the sitemap-free metadata
and the Open Graph tags point at the live domain.

## Structure

```
app/
  layout.tsx           fonts, metadata, nav/footer, cursor, intro
  page.tsx             homepage composition
  work/[slug]/page.tsx case study pages (statically generated)
  globals.css          the whole design system
components/
  home/                hero, work list, about, background, skills, archive, contact
  case/                gallery + lightbox, boarding-pass poster
  motion/              reveal, intro curtain, cursor, scroll progress
  site/                nav, footer
lib/
  projects.ts          all project content — edit here
  site.ts              identity, links, availability
public/
  projects/<slug>/     optimised screenshots
  profile/             portrait
  resume.pdf           generated from resume.html, ATS-checked
  og.png               1200×630 social card
```

## Editing content

All copy for the eight case studies lives in [`lib/projects.ts`](lib/projects.ts). Add a project
to the `projects` array and its page is generated at build time; the homepage list, the next-project
link and the metadata all follow automatically.

Order of the array is the order on the homepage and in the next-project chain.

## Work showcase

The homepage pairs an index (left) with a single framed plate (right) instead of dragging a
thumbnail behind the cursor. Pointing at a line selects that project: the plate is wiped over by
the next cover from the direction you moved, a red edge line traces the wipe, and the caption
re-sets underneath. The plate tilts a couple of degrees with the pointer and settles from 1.045×
as it is revealed. After the pointer leaves, the selected line keeps a small accent index, so the
plate always belongs to something visible. Below 1040px the plate is dropped and rows carry their
own thumbnail; `prefers-reduced-motion` removes the wipe, tilt and settle.

## About

The About section is a statement sheet rather than a bio: a sticky rail (portrait plate, a small
ledger of facts, a running head) beside four numbered positions. The running head names whichever
claim has crossed the middle of the viewport — measured on scroll rather than via
`IntersectionObserver`, so a hash link or a Lenis jump still settles on the right one — and the
active position grows a red segment along its top rule.

Every line of that copy comes from Saatvik's own answers to a questionnaire rather than from
inference, so treat `components/home/About.tsx` as authored text, not placeholder.

## Capabilities board

The technology section uses real brand marks. Each mark is a local SVG in `public/logos` applied
as a CSS mask, so it inherits the ink colour at rest and switches to the brand colour on hover.
Nothing is fetched from a CDN and no icon library ships to the browser.

The section has three layers: a CSS-only counter-scrolling ticker (marks name themselves on hover),
four capability columns with a one-line "why" each, and a cursor-following specimen card that
enlarges the hovered mark in its brand colour. Hovering a column recedes the other three behind a
paper veil; keyboard users get the static board, since the card is a pointer-only flourish.

```bash
node scripts/copy-logos.mjs   # refresh marks after upgrading simple-icons
```

Tools without an official mark (SQL, REST APIs, Azure, Inngest, CI/CD) render as small monograms
instead of invented logos. Brand marks come from [Simple Icons](https://simpleicons.org) (CC0);
all trademarks belong to their owners.

## Images

Source screenshots are stored at 1600px wide as webp (4 MB total). To rebuild them from new PNGs
dropped into `public/projects/`:

```bash
node scripts/optimize-images.mjs
```

The script resizes, converts to webp at quality 82 and deletes the originals.

## Resume

The resume is generated from `resume.html` with true A4 page size, then scored the way an
applicant tracking system sees it — by reading the PDF text layer, not the rendered page:

```bash
npm run resume        # resume.html -> public/resume.pdf
npm run resume:check  # scores the PDF, exits 1 below the threshold
```

Chrome's `--print-to-pdf` flag ignores the CSS page size and uses Letter, which is why the script
drives `Page.printToPDF` over the DevTools protocol instead. Set `CHROME_PATH` if Chrome is not at
the default Windows location.

**ATS rules the document follows.** One column, no floats, grids, tables or icons. Standard
Arial/Helvetica only, with no letter-spacing, so extractors do not read `E X P E R I E N C E`.
Bullets are real text through `li::before`, because CSS list markers are dropped from the text layer
entirely. Separators are ASCII (`|`, `-`), since `·` printed as `�`. Headings use the plain names
extractors match: Summary, Technical Skills, Experience, Projects, Education, Certifications,
Achievements.

`scripts/ats-check.mjs` weights six groups: text-layer integrity (20), contact block (10), standard
headings (15), keyword coverage (25), formatting safety (15) and content quality (15), and verifies
the result with `pdftotext`. It is a local rubric, not a vendor score — a clean 100 here means the
PDF survives extraction and keyword matching, not that a specific ATS ranks it top.

## Accessibility and motion

Skip link, semantic landmarks, visible focus rings, alt text on every screenshot, keyboard-operable
lightbox (arrow keys, Escape) and `prefers-reduced-motion` honoured throughout — the intro, cursor,
marquee, reveals and parallax all disable cleanly.

## Credits

Design, build and copy: Saatvik Raghuvanshi. Typefaces: Instrument Serif, Inter and JetBrains Mono
(Google Fonts).
