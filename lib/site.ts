export const site = {
  name: "Saatvik Raghuvanshi",
  firstName: "Saatvik",
  lastName: "Raghuvanshi",
  role: "Computer Science undergrad · Full-stack & interface design",
  location: "Jaipur, India",
  email: "raghuvanshisaatvik@gmail.com",
  github: "https://github.com/saatvikraghuvanshi-lab",
  linkedin: "https://www.linkedin.com/in/saatvik-raghuvanshi",
  resume: "/resume.pdf",
  availability: "Open to internships & freelance work",
  url: "https://saatvikraghuvanshi.vercel.app",
  description:
    "Portfolio of Saatvik Raghuvanshi — computer science undergrad building full-stack products, geospatial interfaces and AI-assisted tools. Selected work, case studies and process.",
} as const;

export const social = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", value: "saatvikraghuvanshi-lab", href: site.github },
  { label: "LinkedIn", value: "in/saatvik-raghuvanshi", href: site.linkedin },
] as const;
