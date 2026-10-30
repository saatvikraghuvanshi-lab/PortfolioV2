export type Shot = {
  src: string;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  kind: string;
  year: string;
  tagline: string;
  summary: string;
  role: string;
  stack: string[];
  context?: string;
  live?: string;
  repo?: string;
  report?: string;
  cover: string | null;
  accent?: string;
  overview: string[];
  highlights: string[];
  gallery: Shot[];
};

const P = "/projects";

export const projects: Project[] = [
  {
    slug: "orbitalquery",
    title: "OrbitalQuery V2.0",
    shortTitle: "OrbitalQuery",
    kind: "Earth observation · Geospatial AI",
    year: "2026",
    tagline:
      "Ask a question in plain English. Get matched Sentinel-2 scenes, a before/after map, and the change measured.",
    summary:
      "A multi-temporal analysis console for satellite imagery, built around plain-language queries and quantified change.",
    role: "Product design, front-end, API layer, analysis interface",
    stack: ["Next.js 15", "TypeScript", "MapLibre GL", "FastAPI", "rasterio", "STAC", "Cloud Run"],
    context:
      "Evolved from OrbitalQuery, the Space Technology prototype shortlisted at the SIH 2026 internal stage.",
    live: "https://orbital-query-v2-0.vercel.app",
    repo: "https://github.com/saatvikraghuvanshi-lab/OrbitalQuery.V2.0",
    report: `${P}/orbitalquery/orbitalquery-report.pdf`,
    cover: `${P}/orbitalquery/console-swipe.webp`,
    overview: [
      "OrbitalQuery treats a sentence as a query against the planet. Type “urban expansion in Hyderabad between 2018 and 2026” and it parses the location, the period and the analysis, finds the matching Sentinel-2 scenes on the Planetary Computer, then puts before and after imagery on one map.",
      "The interesting part is what happens after the map loads. Change is isolated to actual regions rather than a flat image diff, each region is clickable, and the console reports the numbers behind it — changed area and the NDVI shift per region — so a claim about the ground comes with evidence attached.",
      "The pipeline is split so nothing expensive runs in the browser. Next.js routes talk to STAC for scene discovery and a Python service on Cloud Run for analysis. That service clips to the requested area of interest before any raster work and streams only that window of each band via COG range requests, so the client never downloads a full scene.",
    ],
    highlights: [
      "Natural-language queries parsed into location, period, analysis type and dataset.",
      "Four map modes: BEFORE, AFTER, a seasonally matched SWIPE with a draggable divider, and CHANGE with clickable polygons.",
      "Change detection backed by numbers — changed area and per-region NDVI shift, not just colour overlay.",
      "Python analysis service (rasterio, NDVI) deployed on Cloud Run, never called directly by the browser.",
      "Area-of-interest clipping and COG range reads keep raster traffic to the window actually being viewed.",
      "A deliberate honesty panel: results are labelled evidence for review, not validated ground truth.",
    ],
    gallery: [
      { src: `${P}/orbitalquery/home.webp`, caption: "Entry point — the query is the interface" },
      { src: `${P}/orbitalquery/console-before.webp`, caption: "BEFORE — earlier scene with the parsed query in the sidebar" },
      { src: `${P}/orbitalquery/console-swipe.webp`, caption: "SWIPE — seasonally matched scenes on a synced divider" },
      { src: `${P}/orbitalquery/console-change.webp`, caption: "CHANGE — isolated change regions as vector polygons" },
      { src: `${P}/orbitalquery/console-analysis.webp`, caption: "ANALYSIS — per-region statistics and NDVI shift" },
    ],
  },
  {
    slug: "lunar-ice",
    title: "Lunar Ice Intelligence",
    shortTitle: "Lunar Ice",
    kind: "Space · Mission planning",
    year: "2026",
    tagline:
      "Ranking subsurface-ice targets at the lunar south pole from Chandrayaan-2 radar, terrain and illumination data.",
    summary:
      "A mission-planning prototype that fuses radar, terrain and illumination evidence to rank candidate ice targets and route to them.",
    role: "Interface design, full-stack build, geospatial data pipeline",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Python", "DFSAR", "LOLA", "Render"],
    context:
      "Built for ISRO's Bharatiya Antariksh Hackathon 2026 — Problem Statement 8, subsurface ice detection in the lunar south polar region.",
    live: "https://lunar-ice-intelligence.onrender.com",
    repo: "https://github.com/saatvikraghuvanshi-lab/Lunar-Ice-Intelligence",
    cover: `${P}/lunar-ice/lunar-ice-console.webp`,
    overview: [
      "The brief was deceptively specific: use Chandrayaan-2 radar and imagery to find subsurface ice in the lunar south polar region. The hard part is not rendering a map — it is deciding which pixels deserve to be called a target, and being able to defend that decision.",
      "The prototype fuses five evidence streams: DFSAR radar returns, TMC-2 terrain products, OHRC footprint and hazard readiness, illumination and cold-trap proxies, and NASA LOLA elevation for validation. A candidate only surfaces after passing radar gating (circular polarisation ratio above 1, degree of polarisation below 0.13) and a terrain check, and every candidate carries its evidence with it.",
      "Planning happens on top of that: a solar-aware A* traverse routes from a landing zone to a science target, ice volume is modelled as top-five-metre scenarios at 3%, 8% and 15% assumed fractions, and the interface keeps a confidence and source ledger visible so a reviewer can see how much of the conclusion is inference.",
      "It ran as a two-month project-based build and became the place I learned Prisma, Python geospatial processing and server-rendered dashboard work properly.",
    ],
    highlights: [
      "Five-source evidence fusion: DFSAR radar, TMC-2 terrain, OHRC hazard readiness, illumination proxies and LOLA validation.",
      "CPR/DOP threshold gating (CPR above 1, DOP below 0.13) before any candidate is allowed onto the map.",
      "Solar-aware A* traverse routing from landing zone to science target, with terrain cost.",
      "Top-five-metre ice volume modelled at 3%, 8% and 15% assumed ice fractions rather than a single false-precision number.",
      "Confidence, source and evidence ledgers that expose how each target was derived.",
      "Next.js auth shell with a Prisma data layer and JSON fallback so the demo stays usable without a database.",
    ],
    gallery: [
      { src: `${P}/lunar-ice/lunar-ice-landing.webp`, caption: "Landing — the problem stated in one screen" },
      { src: `${P}/lunar-ice/lunar-ice-signin.webp`, caption: "Sign in — auth shell around the mission console" },
      { src: `${P}/lunar-ice/lunar-ice-console.webp`, caption: "Mission console — candidate targets and evidence summary" },
      { src: `${P}/lunar-ice/lunar-ice-traverse.webp`, caption: "Traverse — solar-aware route from landing zone to target" },
      { src: `${P}/lunar-ice/lunar-ice-hazard.webp`, caption: "Hazard — terrain readiness for each candidate site" },
      { src: `${P}/lunar-ice/lunar-ice-evidence-ledger.webp`, caption: "Evidence ledger — every claim traced to its source" },
      { src: `${P}/lunar-ice/lunar-ice-source-ledger.webp`, caption: "Source ledger — dataset provenance per layer" },
      { src: `${P}/lunar-ice/lunar-ice-confidence.webp`, caption: "Confidence — what is measured and what is assumed" },
      { src: `${P}/lunar-ice/lunar-ice-imagery.webp`, caption: "Imagery — optical context around the radar anomalies" },
    ],
  },
  {
    slug: "airport-management",
    title: "Airport Management System",
    shortTitle: "Airport System",
    kind: "Software engineering · Java",
    year: "2026",
    tagline:
      "A desktop airline reservation system built on a real relational schema, not a list of objects in memory.",
    summary:
      "A Java Swing and MySQL booking system: search, seat maps, payments, check-in, boarding passes and an admin side.",
    role: "Schema design, data access layer, desktop interface",
    stack: ["Java", "Swing", "JDBC", "MySQL", "SQL"],
    repo: "https://github.com/saatvikraghuvanshi-lab/JIA-Management-System",
    cover: `${P}/airport/dashboard.webp`,
    overview: [
      "Most student database projects stop at a form and a table. This one starts at the schema: eleven tables with foreign keys, enum status columns and real constraints across airports, terminals, gates, flights, passengers, bookings, payments and baggage.",
      "The constraint that shaped everything is a unique key on flight and seat number. Double-booking becomes impossible at the database level rather than something the interface politely hopes to avoid. Seat maps follow the aircraft actually assigned to the route — a 3-3 narrowbody cabin for a domestic A320, a 3-4-3 widebody for the 777 flying to Dubai.",
      "On top of that sits the passenger journey: search a route, pick a seat, cabin and meal, pay, check in, and print a boarding pass with QR and barcode panels. A parallel admin surface handles baggage belts, gate state and flight status, with live departure and arrival boards for the terminal screens.",
      "A DAO layer keeps SQL out of the interface, so the Swing frames ask for flights and bookings rather than assembling queries.",
    ],
    highlights: [
      "Eleven-table MySQL schema with foreign keys, enum state columns and a unique (flight, seat) constraint that prevents double-booking outright.",
      "Seat maps generated from the aircraft assigned to each route — 3-3 narrowbody versus 3-4-3 widebody layouts.",
      "Full passenger journey: route search, seat, cabin and meal selection, payment, check-in and a printable boarding pass.",
      "Boarding pass rendered with both QR and barcode panels, plus cabin and meal details carried from the booking.",
      "Live departure and arrival boards alongside an admin dashboard for baggage belts and gate status.",
      "DAO layer for flights, bookings, passengers, payments and baggage keeps persistence out of the UI.",
    ],
    gallery: [
      {
        src: `${P}/airport/dashboard.webp`,
        caption: "Dashboard — KPIs, today's schedule and the live booking log",
      },
      {
        src: `${P}/airport/boarding-pass.webp`,
        caption: "Boarding pass — JAI to BOM, with QR and barcode stub",
      },
      {
        src: `${P}/airport/seat-map.webp`,
        caption: "Seat selection — live seat map with cabin and meal choice",
      },
      {
        src: `${P}/airport/flight-search.webp`,
        caption: "Flight search — Jaipur to Delhi with fares, gates and status",
      },
      {
        src: `${P}/airport/e-ticket.webp`,
        caption: "E-ticket — reservation, flight, booking and payment in one view",
      },
      {
        src: `${P}/airport/check-in.webp`,
        caption: "Check-in — baggage allowance, seat and boarding details",
      },
      {
        src: `${P}/airport/operations-control.webp`,
        caption: "Operations control — flight status and gate management",
      },
      {
        src: `${P}/airport/baggage-operations.webp`,
        caption: "Baggage operations — belt assignment and loading state",
      },
      {
        src: `${P}/airport/reports.webp`,
        caption: "Reports — revenue, load factor and route performance",
      },
      {
        src: `${P}/airport/baggage-tracking.webp`,
        caption: "Baggage tracking — piece status from check-in to collection",
      },
      {
        src: `${P}/airport/er-diagram.webp`,
        caption: "Entity-relationship diagram — eleven tables and their relationships",
      },
      {
        src: `${P}/airport/schema.webp`,
        caption: "Relational schema — every key and constraint",
      },
    ],
  },
  {
    slug: "s2c",
    title: "S2C / FramePilot",
    shortTitle: "S2C",
    kind: "AI SaaS · Learning build",
    year: "2026",
    tagline:
      "A sketch-to-design AI tool rebuilt end to end — auth, infinite canvas, generation flows and autosave.",
    summary:
      "A full-stack rebuild of an AI design SaaS: project dashboards, infinite canvas editing, AI generation and exports.",
    role: "Full-stack implementation and interface work",
    stack: ["Next.js", "Convex", "Convex Auth", "Inngest", "Redux", "Gemini"],
    context:
      "A project-based learning rebuild inspired by the Web Prodigies AI SaaS build. Not a commercial product.",
    live: "https://ai-saa-s-sketch-to-design.vercel.app",
    repo: "https://github.com/saatvikraghuvanshi-lab/Ai-SaaS-Sketch-To-Design",
    cover: `${P}/s2c/s2c-canvas.webp`,
    overview: [
      "S2C was built to answer a single question: what does it actually take to ship a product with a canvas in it? The answer turned out to be auth, a realtime database, storage, background jobs, AI routes and a state model for zoom, pan, selection and history — all at once.",
      "The editor is an infinite canvas with frames, shapes, text, arrows, lines and free drawing, plus layers, selection, eraser, zoom and pan. Projects are created from a dashboard, autosaved through Inngest workflows, and export as PNG or JSON.",
      "The generation side chains the canvas to Gemini: a moodboard becomes a style guide, a wireframe becomes a generated interface, and a workflow description becomes a page — each result landing back on the canvas as editable frames rather than a flat image.",
    ],
    highlights: [
      "Infinite canvas with frames, shapes, text, arrows, lines, free drawing, eraser, layers, selection, zoom and pan.",
      "Project dashboard with creation, rename and grouping, backed by Convex.",
      "Inngest workflows driving autosave, so edits survive a closed tab without blocking the canvas.",
      "Gemini generation flows: moodboard to style guide, wireframe to interface, workflow to page.",
      "Generated output returns to the canvas as editable frames, keeping the result workable rather than frozen.",
      "PNG and JSON export paths, Redux canvas state, and auth-scoped storage for uploaded assets.",
    ],
    gallery: [
      { src: `${P}/s2c/s2c-signin.webp`, caption: "Sign in" },
      { src: `${P}/s2c/s2c-projects.webp`, caption: "Projects — the dashboard" },
      { src: `${P}/s2c/s2c-wireframe.webp`, caption: "Wireframe input" },
      { src: `${P}/s2c/s2c-generated-ui.webp`, caption: "Generated interface from the wireframe" },
      { src: `${P}/s2c/s2c-canvas.webp`, caption: "Infinite canvas with layers and selection" },
      { src: `${P}/s2c/s2c-moodboard.webp`, caption: "Moodboard to style guide" },
      { src: `${P}/s2c/s2c-style-guide.webp`, caption: "Generated style guide" },
    ],
  },
  {
    slug: "resilienceos",
    title: "ResilienceOS",
    shortTitle: "ResilienceOS",
    kind: "Disaster response · Interface design",
    year: "2026",
    tagline:
      "Role-based emergency simulation for the golden hour — command, responders and civilians in one system.",
    summary:
      "A disaster-response platform with separate command, responder, civilian and training surfaces, built for a 36-hour ideathon.",
    role: "Interface design and front-end",
    stack: ["React", "Vite", "TypeScript", "Design system"],
    context: "Built with team Codoholics at a college ideathon, January 2026 — placed 4th overall.",
    live: "https://resilienceos.vercel.app",
    repo: "https://github.com/saatvikraghuvanshi-lab/RESILIENCEOS",
    cover: `${P}/resilienceos/resilienceos-admin-map.webp`,
    overview: [
      "The premise is the information blackout in the first hour of a disaster. Authorities, responders and civilians all hold part of the picture and none of them can see the others' — so the product is not one dashboard but four, each written for a different person under pressure.",
      "Command gets a tactical map with deployment state and resilience scoring. Responders get assigned tasks and a field view. Civilians get an SOS path that works when the user is panicking. Training and strategy views let a district rehearse before anything happens.",
      "The whole thing was designed and built inside a 36-hour ideathon, which forces decisions: a dark tactical palette for legibility on a command screen, one consistent severity scale across every role, and no screen that needs a manual.",
    ],
    highlights: [
      "Four role-specific surfaces: command, responder, civilian and training — not one dashboard with hidden tabs.",
      "Tactical dark-mode map with deployment state, live incident severity and resilience scoring.",
      "Civilian SOS flow designed for a stressed user: one primary action, no form walls.",
      "Training and strategy modules for pre-incident rehearsal and district-level planning.",
      "Single severity scale and component language shared across every role.",
      "Designed and shipped in 36 hours; placed 4th overall.",
    ],
    gallery: [
      { src: `${P}/resilienceos/resilienceos-login.webp`, caption: "Entry — role selection" },
      { src: `${P}/resilienceos/resilienceos-admin-map.webp`, caption: "Command — tactical map and deployment state" },
      { src: `${P}/resilienceos/resilienceos-civilian-sos.webp`, caption: "Civilian — SOS reporting under stress" },
      { src: `${P}/resilienceos/resilienceos-responder.webp`, caption: "Responder — assigned tasks in the field" },
      { src: `${P}/resilienceos/resilienceos-training.webp`, caption: "Training — rehearsal before the incident" },
      { src: `${P}/resilienceos/resilienceos-strategy.webp`, caption: "Strategy — district-level planning" },
      { src: `${P}/resilienceos/resilienceos-report.webp`, caption: "Report — post-incident summary" },
    ],
  },
  {
    slug: "jansahayak",
    title: "JanSahayak",
    shortTitle: "JanSahayak",
    kind: "Civic tech · AI assistant",
    year: "2025",
    tagline:
      "Government schemes translated into something a first-time user can actually act on.",
    summary:
      "A civic-tech assistant that finds schemes, checks eligibility and explains benefits in plain language.",
    role: "Front-end, UI/UX, accessibility",
    stack: ["React", "Vite", "TypeScript", "Gemini", "Netlify"],
    context: "Built at Rewind & Recode, a national-level hackathon — finished in the top 5.",
    live: "https://jansahayak1.netlify.app",
    repo: "https://github.com/saatvikraghuvanshi-lab/jan-sahayak-voice",
    cover: `${P}/jansahayak/jansahayak-create-account.webp`,
    overview: [
      "Scheme portals assume the user already knows what they are looking for. The people who need them most usually do not. JanSahayak flips the order: start from a situation — a farmer with two acres, a student who has just turned eighteen — and work outwards to what applies.",
      "The interface is deliberately plain. Large type, one decision per screen, filters that read like questions, and an assistant that answers in the same register instead of quoting policy language. Eligibility is presented as a checklist the user can verify rather than a verdict.",
      "It was built during a national hackathon and then polished afterwards — login, discovery, filters, dashboard and assistant flow were all reworked once the demo pressure was gone.",
    ],
    highlights: [
      "Discovery built around life situations rather than scheme names.",
      "Eligibility shown as a verifiable checklist instead of a yes/no verdict.",
      "AI assistant that answers in plain language and cites the scheme it came from.",
      "Accessibility-first layout: large type, single decision per screen, keyboard-navigable filters.",
      "Reached the top 5 at the Rewind & Recode national hackathon.",
    ],
    gallery: [
      { src: `${P}/jansahayak/jansahayak-create-account.webp`, caption: "Sign up — the promise and the form on one screen" },
      { src: `${P}/jansahayak/jansahayak-login.webp`, caption: "Sign in" },
      { src: `${P}/jansahayak/jansahayak-home.webp`, caption: "Home — starting from a situation" },
      { src: `${P}/jansahayak/jansahayak-explore.webp`, caption: "Explore — filters written as questions" },
      { src: `${P}/jansahayak/jansahayak-ai-assistant.webp`, caption: "Assistant — plain-language guidance" },
      { src: `${P}/jansahayak/jansahayak-rewind-recode-certificate.webp`, caption: "Rewind & Recode — top 5 certificate" },
    ],
  },
  {
    slug: "shockproof",
    title: "ShockProof",
    shortTitle: "ShockProof",
    kind: "AI · Household energy",
    year: "2026",
    tagline:
      "A tariff guard that reads your meter and tells you when a slab jump is about to cost you.",
    summary:
      "Photograph your electricity meter; get projected usage, bill risk and the specific actions that avoid the next slab.",
    role: "Product design, full-stack, AI integration",
    stack: ["Next.js", "Supabase", "Gemini", "PostgreSQL", "Vercel"],
    context: "Built for INDIA RUNS 2026, Challenge 3 — Improve Everyday Life with AI. Team Noble Dawn.",
    live: "https://shockproof.vercel.app",
    repo: "https://github.com/saatvikraghuvanshi-lab/ShockProof",
    cover: `${P}/shockproof/shockproof-dashboard.webp`,
    overview: [
      "Indian electricity bills are progressive: cross a slab and every subsequent unit costs more. Most households only discover this on the bill. ShockProof turns the meter into a forecast.",
      "A user photographs the meter; Gemini OCR extracts the cumulative reading, and the app computes current usage, month-end projection, distance to the next slab, estimated bill and a risk level. The advice is generated against those actual numbers and the Rajasthan tariff table rather than generic tips.",
      "Under the hood it is a full Supabase product: auth, database, storage for captures, realtime history and row-level security scoping every reading to its owner.",
    ],
    highlights: [
      "Meter photo capture with Gemini OCR extracting the cumulative kWh reading.",
      "Projection engine for month-end usage, next-slab distance, estimated bill and bill-risk level.",
      "Advice generated against the user's own numbers and the Rajasthan tariff slabs, not generic savings tips.",
      "Reading history with realtime updates so the projection moves as the month does.",
      "Supabase auth, database, storage and row-level security scoping every capture to its owner.",
      "Delivered as a complete AI product workflow in an ideathon window.",
    ],
    gallery: [
      { src: `${P}/shockproof/shockproof-dashboard.webp`, caption: "Dashboard — risk, projection and next slab" },
      { src: `${P}/shockproof/shockproof-capture.webp`, caption: "Capture — meter photo to reading" },
      { src: `${P}/shockproof/shockproof-projection.webp`, caption: "Projection — month-end estimate" },
      { src: `${P}/shockproof/shockproof-history.webp`, caption: "History — readings over time" },
      { src: `${P}/shockproof/shockproof-advice.webp`, caption: "Advice — actions tied to actual numbers" },
    ],
  },
  {
    slug: "vibebatch",
    title: "VibeBatch",
    shortTitle: "VibeBatch",
    kind: "Social product · Freelance build",
    year: "2026",
    tagline:
      "Friends vote on your traits. You get a profile, a title and a card worth posting.",
    summary:
      "A social personality product where long-term followers vote anonymously on traits, and results become shareable identity cards.",
    role: "Freelance full-stack — schema, auth, interface, deployment",
    stack: ["React", "Vite", "Supabase", "PostgreSQL", "Gemini", "Vercel"],
    live: "https://vibebatch.net",
    repo: "https://github.com/saatvikraghuvanshi-lab/VibeBatch",
    cover: `${P}/vibebatch/vibebatch-login.webp`,
    overview: [
      "VibeBatch is built on one rule that makes it interesting: only people who have followed you for six months or more can vote, and they vote anonymously. That single constraint turns a personality quiz into something closer to reputation among people who actually know you.",
      "Designing the database meant modelling people, relationships, trait votes, invite flows, messages and premium entitlements as separate concerns — with row-level security so nobody can read a vote that was not meant for them.",
      "The output is the product. Your top three traits become a profile, an AI-generated title, and a set of cards — including fifteen story backgrounds chosen by colour theory against the trait profile — built to be posted, not just viewed.",
    ],
    highlights: [
      "Six-month follower eligibility rule plus anonymous voting, enforced in the data layer.",
      "Relational PostgreSQL schema for profiles, relationships, votes, invites, messages and premium flows.",
      "Row-level security scoping every profile, relationship, message and vote to its owner.",
      "Top-three traits surfaced as a public profile with an AI-generated title.",
      "Fifteen story-card backgrounds selected by colour theory against the user's trait profile.",
      "Premium identity cards, invite and share flows, and a Gemini help assistant for support.",
    ],
    gallery: [
      { src: `${P}/vibebatch/vibebatch-login.webp`, caption: "Sign in — the product's first impression" },
      { src: `${P}/vibebatch/vibebatch-signup.webp`, caption: "Sign up" },
      { src: `${P}/vibebatch/vibebatch-dashboard.webp`, caption: "Dashboard" },
      { src: `${P}/vibebatch/vibebatch-invite.webp`, caption: "Invite — bringing in eligible voters" },
      { src: `${P}/vibebatch/vibebatch-friends.webp`, caption: "Friends and eligibility state" },
      { src: `${P}/vibebatch/vibebatch-traits.webp`, caption: "Traits — voting surface" },
      { src: `${P}/vibebatch/vibebatch-vote-tracker.webp`, caption: "Vote tracker" },
      { src: `${P}/vibebatch/vibebatch-story-card.webp`, caption: "Story card — built for sharing" },
      { src: `${P}/vibebatch/vibebatch-premium.webp`, caption: "Premium" },
      { src: `${P}/vibebatch/vibebatch-premium-card-blue.webp`, caption: "Premium card — blue" },
      { src: `${P}/vibebatch/vibebatch-premium-card-mono.webp`, caption: "Premium card — mono" },
      { src: `${P}/vibebatch/vibebatch-settings.webp`, caption: "Settings" },
      { src: `${P}/vibebatch/vibebatch-help-support.webp`, caption: "Help and support" },
    ],
  },
];

export const archive = [
  {
    title: "EcoCity Heat Planner",
    note: "Urban heat island simulation — Leaflet, PostGIS, Supabase. Craft N Code, round 00.",
    href: "https://ecocity-heat-planner.vercel.app",
    repo: "https://github.com/saatvikraghuvanshi-lab/ecocity-heat-planner",
  },
  {
    title: "TerraPulse Pro",
    note: "GIS field dashboard — map layers, satellite views, analytics.",
    href: "https://github.com/saatvikraghuvanshi-lab/field-advisor-pro",
  },
  {
    title: "OrbitalQuery (v1)",
    note: "Sentinel-2 scene search — SIH 2026 internal stage, Space Technology.",
    href: "https://github.com/saatvikraghuvanshi-lab/OrbitalQuery",
  },
  {
    title: "Student Marks & Result Manager",
    note: "Java console application for records, results and reports.",
    href: "https://github.com/saatvikraghuvanshi-lab/Student_Marks-Result_Manager",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
