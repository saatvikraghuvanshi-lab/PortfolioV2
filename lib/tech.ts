export type Tech = {
  name: string;
  /** mask-based logo in /public/logos */
  logo?: string;
  /** brand colour used on hover */
  brand?: string;
  /** monogram used when no official mark exists */
  mark?: string;
};

export type TechGroup = {
  name: string;
  /** one honest line on how the group gets used */
  note: string;
  items: Tech[];
};

const logo = (slug: string) => `/logos/${slug}.svg`;

export const techGroups: TechGroup[] = [
  {
    name: "Languages",
    note: "Typed where correctness pays, scripted where speed does.",
    items: [
      { name: "Java", logo: logo("openjdk"), brand: "#e76f00" },
      { name: "TypeScript", logo: logo("typescript"), brand: "#3178c6" },
      { name: "JavaScript", logo: logo("javascript"), brand: "#f7df1e" },
      { name: "Python", logo: logo("python"), brand: "#3776ab" },
      { name: "C", logo: logo("c"), brand: "#a8b9cc" },
      { name: "SQL", mark: "SQL", brand: "#7c2f27" },
      { name: "HTML", logo: logo("html5"), brand: "#e34f26" },
      { name: "CSS", logo: logo("css"), brand: "#663399" },
    ],
  },
  {
    name: "Frontend",
    note: "React and Next by default; extra tooling only when the interface earns it.",
    items: [
      { name: "React", logo: logo("react"), brand: "#61dafb" },
      { name: "Next.js", logo: logo("nextdotjs"), brand: "#14110e" },
      { name: "Vite", logo: logo("vite"), brand: "#9135ff" },
      { name: "Tailwind CSS", logo: logo("tailwindcss"), brand: "#06b6d4" },
      { name: "shadcn/ui", logo: logo("shadcnui"), brand: "#14110e" },
      { name: "Radix UI", logo: logo("radixui"), brand: "#161618" },
      { name: "Redux", logo: logo("redux"), brand: "#764abc" },
      { name: "Motion", logo: logo("framer"), brand: "#0055ff" },
      { name: "MapLibre GL", logo: logo("maplibre"), brand: "#396cb2" },
      { name: "Leaflet", logo: logo("leaflet"), brand: "#199900" },
    ],
  },
  {
    name: "Backend & data",
    note: "Postgres until something proves it shouldn't be.",
    items: [
      { name: "Node.js", logo: logo("nodedotjs"), brand: "#5fa04e" },
      { name: "PostgreSQL", logo: logo("postgresql"), brand: "#4169e1" },
      { name: "PostGIS", logo: logo("postgresql"), brand: "#336791" },
      { name: "Supabase", logo: logo("supabase"), brand: "#3fcf8e" },
      { name: "Prisma", logo: logo("prisma"), brand: "#2d3748" },
      { name: "Convex", logo: logo("convex"), brand: "#ee342f" },
      { name: "Inngest", mark: "In", brand: "#a98c55" },
      { name: "REST APIs", mark: "API", brand: "#7c2f27" },
      { name: "Gemini API", logo: logo("googlegemini"), brand: "#8e75b2" },
    ],
  },
  {
    name: "Cloud & tooling",
    note: "Free tiers, reproducible builds, automation for the boring parts.",
    items: [
      { name: "Git", logo: logo("git"), brand: "#f03c2e" },
      { name: "GitHub", logo: logo("github"), brand: "#181717" },
      { name: "Vercel", logo: logo("vercel"), brand: "#14110e" },
      { name: "Cloudflare Pages", logo: logo("cloudflare"), brand: "#f38020" },
      { name: "Netlify", logo: logo("netlify"), brand: "#00c7b7" },
      { name: "Google Cloud", logo: logo("googlecloud"), brand: "#4285f4" },
      { name: "Azure", mark: "Az", brand: "#0078d4" },
      { name: "Docker", logo: logo("docker"), brand: "#2496ed" },
      { name: "Linux", logo: logo("linux"), brand: "#fcc624" },
      { name: "CI/CD", mark: "CI", brand: "#7c2f27" },
      { name: "Figma", logo: logo("figma"), brand: "#f24e1e" },
      { name: "AutoCAD", logo: logo("autodesk"), brand: "#0696d7" },
    ],
  },
];

export const techCount = techGroups.reduce((total, group) => total + group.items.length, 0);

/** A tighter selection for the ticker band. */
export const bandLogos: Tech[] = [
  { name: "React", logo: logo("react"), brand: "#61dafb" },
  { name: "Next.js", logo: logo("nextdotjs"), brand: "#f1ece1" },
  { name: "TypeScript", logo: logo("typescript"), brand: "#3178c6" },
  { name: "Java", logo: logo("openjdk"), brand: "#e76f00" },
  { name: "Python", logo: logo("python"), brand: "#3776ab" },
  { name: "PostgreSQL", logo: logo("postgresql"), brand: "#4169e1" },
  { name: "Supabase", logo: logo("supabase"), brand: "#3fcf8e" },
  { name: "Prisma", logo: logo("prisma"), brand: "#f1ece1" },
  { name: "Docker", logo: logo("docker"), brand: "#2496ed" },
  { name: "Linux", logo: logo("linux"), brand: "#fcc624" },
  { name: "Git", logo: logo("git"), brand: "#f03c2e" },
  { name: "GitHub", logo: logo("github"), brand: "#f1ece1" },
  { name: "Vercel", logo: logo("vercel"), brand: "#f1ece1" },
  { name: "Cloudflare", logo: logo("cloudflare"), brand: "#f38020" },
  { name: "Figma", logo: logo("figma"), brand: "#f24e1e" },
  { name: "Tailwind CSS", logo: logo("tailwindcss"), brand: "#06b6d4" },
  { name: "Vite", logo: logo("vite"), brand: "#bd34fe" },
  { name: "Node.js", logo: logo("nodedotjs"), brand: "#5fa04e" },
  { name: "Gemini", logo: logo("googlegemini"), brand: "#a78bfa" },
  { name: "MapLibre", logo: logo("maplibre"), brand: "#4b8ed6" },
];
