import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

/* ─── PALETTE — v1 colors, tuned for WCAG-AA contrast ──────────────────── */
const C = {
  bg: "#030712",
  bgCard: "rgba(13,31,45,0.5)",
  bgHover: "rgba(0,212,255,0.04)",
  border: "#0d1f2d",
  borderHi: "#00d4ff44",

  cyan: "#00d4ff",
  cyanDim: "#00d4ff33",
  cyanGlow: "#00d4ff15",
  green: "#00ff88",
  greenDim: "#00ff8833",

  textPrimary: "#f0f6ff",
  textBody: "#c8d8e8",
  textMuted: "#9fb1c4", // lifted for contrast
  textDim: "#6b86a0", // lifted from #3a5570 to pass AA on small text
};

/* ─── DATA ─────────────────────────────────────────────────────────────── */
const SKILLS = {
  Frontend: ["Next.js", "Nuxt.js", "React.js", "Vue.js", "Angular.js", "TypeScript", "JavaScript", "Tailwind CSS", "Alpine.js"],
  Backend: ["Node.js", "Nest.js", "Express.js", "PHP", "Laravel", "Symfony", "Python", "Django"],
  "Data & APIs": ["PostgreSQL", "MySQL", "MongoDB", "REST APIs", "Prisma", "Postman"],
  "Infra & Tools": ["Docker", "Git", "CI/CD", "Bitbucket", "WordPress", "Prismic CMS", "Typo3"],
  Leadership: ["Tech Team Lead", "Scrum Master", "Code Reviews", "Sprint Planning", "Mentoring", "AI Integration", "AI Automation", "Agile / Scrum"],
};

const EXPERIENCE = [
  { company: "Ringana", role: "Full Stack Engineer", period: "Sep 2025 – Present", location: "Austria · Full Remote", color: C.cyan, points: ["End-to-end feature ownership across two product teams", "Led legacy PHP → modern stack migrations", "Rebuilt frontends: Nuxt.js, Next.js, Vue.js, WordPress", "TypeScript, PHP, Docker · Agile with Git & Bitbucket"] },
  { company: "the eksperts", role: "Full Stack Engineer & Tech Team Lead", period: "Mar 2023 – Sep 2025", location: "Switzerland · Remote", color: C.green, points: ["Led technical team 2+ years while staying fully hands-on", "Architected REST APIs powering high-traffic client platforms", "Ran sprint planning, backlog, daily standups", "Established code reviews that cut production incidents significantly"] },
  { company: "StarLabs", role: "Full Stack Engineer", period: "2021 – 2023", location: "Kosovo", color: C.cyan, points: ["Built high-performance apps for multiple clients concurrently", "Introduced code reviews that reduced bugs significantly", "WCAG accessibility compliance across all products", "Daily Agile standups, Git workflows, designer & QA collaboration"] },
  { company: "MakerMinds GmbH", role: "Full Stack Engineer & Project Leader", period: "2019 – 2021", location: "Germany · Remote", color: C.green, points: ["Delivered 7 full-stack applications from scratch", "Trained 80+ students in Full Stack Web Development: HTML, CSS, JS, Node.js, React, APIs, databases", "Mentored interns through live projects, and several progressed into junior engineer roles", "Set technical direction, worked directly with stakeholders on delivery"] },
  { company: "SignSoft", role: "Full Stack Engineer & Project Manager", period: "2018 – 2019", location: "Germany & Kosovo", color: C.cyan, points: ["Built production apps: React, Vue, Angular, Node, Laravel", "Increased user engagement by 60%", "EEA-compliant websites built to EU data protection standards", "API testing with Postman, direct client communication"] },
];

/* Featured case studies — the "how I work" proof. */
const CASE_STUDIES = [
  {
    title: "IP3 · Custom CRM",
    client: "Client project · German-speaking market",
    category: "SaaS · CRM",
    img: "/shots/ip3-crm.jpg",
    url: "https://crm-frontend-xi-three.vercel.app/login",
    context:
      "A German-speaking business had outgrown its mix of spreadsheets and off-the-shelf tools. They wanted one CRM built around how they actually work, and they wanted to own it outright.",
    role: "Sole engineer. I scoped it, built it, and delivered it.",
    challenge:
      "One person covering the whole thing, from data model to UI, while keeping it simple enough to live in daily without a manual. And it all had to work in German.",
    did: [
      "Built the full stack: React on the front, a Nest.js API behind it, PostgreSQL underneath.",
      "Modelled the full workflow, from clients moving through the pipeline to the freelancers the business contracts for different jobs, so the whole team works in one place instead of five.",
      "Set up role-based access so each person sees only what their job needs, nothing more.",
      "Added a reporting dashboard and a secure password-recovery flow, with the whole interface in German.",
    ],
    outcome:
      "It's live, and a team of 12 runs on it every day. They track around 40 clients plus the freelancers they contract for different jobs, all in one system they own instead of renting one that almost fits.",
    metrics: [
      { v: "12", l: "team members use it daily" },
      { v: "~40", l: "clients managed" },
      { v: "100%", l: "German-language UI" },
    ],
    stack: ["React.js", "Nest.js", "PostgreSQL", "RBAC"],
  },
  {
    title: "Loyalito · Loyalty & Rewards SaaS",
    client: "Client project",
    category: "SaaS",
    img: "/shots/loyalito.jpg",
    url: "https://layoutynextjs.vercel.app",
    context:
      "Loyalito is a loyalty and rewards platform. Businesses run their own points programmes on it and stay in touch with their customers.",
    role: "Engineer on the core product features.",
    challenge:
      "Keeping every business's data cleanly isolated on shared infrastructure, while the points logic stayed correct and easy to reason about.",
    did: [
      "Built the multi-tenant business dashboard so each company's data stays walled off from the rest.",
      "Wrote the points engine that tracks earning and redemption.",
      "Added Google one-tap sign-in so people get in without friction.",
      "Built the notifications system that lets businesses reach their customers.",
    ],
    outcome:
      "It's a dark-themed production app, live in active use. It runs at two MrBurger venues in Prague, where customers earn rewards and get push notifications, with each business isolated on its own tenant.",
    metrics: [
      { v: "2", l: "live MrBurger venues · Prague" },
      { v: "1-tap", l: "Google sign-in" },
      { v: "Push", l: "rewards + notifications" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Google OAuth"],
  },
  {
    title: "AI Features & n8n Automation",
    client: "How I work · across projects",
    category: "AI · Automation",
    img: null,
    visual: "ai",
    context:
      "I use AI a lot in how I build, but I read everything it produces before it goes near the codebase. A fast model with a loose prompt writes code that works and is structured badly, so for me AI always comes with a review.",
    role: "Engineer who uses AI hands-on and reviews every line of it.",
    challenge:
      "Getting the speed AI gives you without letting the structure of the codebase slip, and automating the right steps rather than every step.",
    did: [
      "Wire up n8n automations that move data between tools and trigger routine work on their own.",
      "Review what AI generates and refactor it, pulling shared calls, queries and error handling into one place a component can reuse.",
      "Build AI into products only where it genuinely helps the people using them.",
      "Automate the repetitive parts of delivery so they stop eating real time.",
    ],
    outcome:
      "Time saved on the repetitive work, and a codebase that stays structured because nothing AI writes goes in without a review.",
    stack: ["AI / LLMs", "n8n", "Automation", "APIs"],
  },
  {
    title: "Leading & Collaborating Across Teams",
    client: "How I work · every project",
    category: "Leadership · Collaboration",
    img: null,
    visual: "collab",
    context:
      "I don't build in isolation. Every project runs through designers, product owners, QA and stakeholders, and the work is better for it.",
    role: "Tech lead who keeps the team moving and the code honest.",
    challenge:
      "Keeping a team aligned across different functions and locations while holding a high bar on quality.",
    did: [
      "Run sprint planning, code reviews, and the shared standards everyone codes against.",
      "Travel to teams for workshops, planning, and on-site delivery when it counts.",
      "Mentor developers, several of whom have grown into much stronger engineers.",
      "Set up review processes and standards that cut production incidents sharply.",
    ],
    outcome:
      "Fewer incidents in production, developers who got better at their craft, and steady, strong feedback from the people I work with.",
    stack: ["Agile / Scrum", "Code Reviews", "Mentoring", "Workshops"],
  },
  {
    title: "Legacy Migration, Zero Downtime",
    client: "Enterprise · confidential",
    category: "Migration · Modernisation",
    img: null,
    visual: "migration",
    context:
      "A large, long-lived application had become hard to change. Years of features sat on an ageing stack, and every new request took longer than it should. It needed to move to a modern stack, without taking the product offline or losing a single record.",
    role: "Lead on the migration: planning, execution, and the data.",
    challenge:
      "Replace the foundation under a live application while real users keep using it, with no maintenance window and no data loss.",
    did: [
      "Audited the old codebase first, finding what was actually used, what was dead, and where the data really lived, before writing any new code.",
      "Migrated slice by slice, strangler-style: the new stack ran in front of the old one and took over a piece of traffic at a time.",
      "Ran old and new side by side for weeks, with instant rollback if anything looked off.",
      "Wrote checks that compared old and new data on every run, and didn't move a slice until the numbers matched exactly.",
    ],
    outcome:
      "It rolled out in phases with zero downtime and no data loss. The team got a codebase they could work in again, and the users never noticed it happened.",
    metrics: [
      { v: "0", l: "downtime during cutover" },
      { v: "Phased", l: "slice-by-slice rollout" },
      { v: "100%", l: "data integrity preserved" },
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  },
];

const PROJECTS = [
  // ── Featured (company work) ──────────────────────────────────────────────
  { title: "Enterprise E-Commerce Platform", client: "Confidential · Swiss Client", desc: "A large e-commerce platform with a custom CMS, product and inventory management, and payment integration. Built to stay fast when the traffic spikes.", stack: ["Next.js", "Node.js", "PostgreSQL", "Prismic"], featured: true, category: "E-Commerce", url: null, img: null },
  { title: "Hospital Management System", client: "Confidential · Enterprise", desc: "A healthcare platform for patient records, appointments, and scheduling, with role-based access for clinical staff and strict data-privacy rules throughout.", stack: ["Vue.js", "Nest.js", "PostgreSQL", "Docker"], featured: true, category: "Healthcare", url: null, img: null },
  { title: "Translations Management Platform", client: "Confidential · Enterprise", desc: "A SaaS for running translation work end to end: projects, translator assignments, a review pipeline, and a client delivery portal. Multi-language and multi-tenant.", stack: ["React.js", "Node.js", "PostgreSQL"], featured: true, category: "SaaS", url: null, img: null },
  { title: "Gaming Platform", client: "Confidential · Enterprise", desc: "A gaming web platform with real-time features, user accounts, and leaderboards, with an API built to hold up when a lot of players are on at once.", stack: ["Next.js", "Nest.js", "PostgreSQL", "Redis"], featured: true, category: "Gaming", url: null, img: null },
  { title: "Hospitality Management Platform", client: "Confidential · Swiss Client", desc: "A hospitality SaaS for the Swiss market: a booking engine, room and property management, payments, a guest portal, and staff workflows. Wired up to outside payment providers and channel managers.", stack: ["Next.js", "Nest.js", "PostgreSQL", "Docker", "Stripe"], featured: true, category: "Hospitality", url: null, img: null },
  { title: "Architecture CRM", client: "Confidential · Swiss Client", desc: "A CRM built for architecture firms. It runs projects start to finish, with a client portal, tender tracking, document and drawing management, team collaboration, and billing.", stack: ["Vue.js", "Node.js", "PostgreSQL", "Docker"], featured: true, category: "CRM", url: null, img: null },
  { title: "Legacy Stack Migration", client: "Confidential · Enterprise", desc: "Modernised a large legacy app. I audited the old codebase, planned the migration, and moved it to a modern stack in phases with zero downtime. It came out faster and far easier to work on.", stack: ["Next.js", "TypeScript", "Node.js", "Docker", "PostgreSQL"], featured: true, category: "Migration", url: null, img: null },
  { title: "CRM Replacement & Data Migration", client: "Confidential · Enterprise", desc: "Replaced a third-party CRM with a fully custom build. Migrated all the client data, rebuilt the workflows, and switched everyone over with no data loss. Team trained and handed over on schedule.", stack: ["React.js", "Nest.js", "PostgreSQL", "Docker"], featured: true, category: "Migration", url: null, img: null },
  { title: "SaaS Analytics Dashboard", client: "Austrian Tech Company", desc: "A real-time analytics dashboard with role-based access, clear data visualisation, and a tuned REST API behind it.", stack: ["Vue.js", "Nest.js", "PostgreSQL", "Docker"], featured: true, category: "SaaS", url: null, img: null },
  { title: "B2B Client Portal", client: "Swiss B2B Client", desc: "Secure portal with document management, custom approval workflows, and multi-tenant architecture.", stack: ["React.js", "Express.js", "PostgreSQL"], featured: true, category: "Web App", url: null, img: null },
  // ── Freelance / independent (live, with screenshots) ──────────────────────
  { title: "Erblin3 · Fashion E-Commerce", client: "Personal · Client Project", desc: "Full WooCommerce fashion e-commerce for a luxury clothing brand, with 15+ collections (Bridal, VIVIDÉRA, DOMINA, Perla di Fuoco…), worldwide free shipping, product catalogue, cart, account system, and a video-led homepage. Live and selling.", stack: ["WordPress", "WooCommerce", "PHP", "Elementor"], featured: false, category: "E-Commerce", url: "https://erblin3.com", img: "/shots/erblin3.jpg" },
  { title: "MrBurger · QR Code Menu", client: "Personal · Client Project", desc: "Digital QR scan menu for Prague restaurant MrBurger Holešovice, part of the B&C restaurant ecosystem. Multilingual (CS/EN), full menu with allergen labelling, food photography, and mobile-first design. Scanned daily by guests.", stack: ["Next.js", "Tailwind CSS", "Vercel"], featured: false, category: "Website", url: "https://mrburgermenu.vercel.app", img: "/shots/mrburger.jpg" },
  { title: "Loyalito Platform", client: "Personal · Client Project", desc: "Business loyalty & rewards SaaS with a secure business dashboard, client sign-in, points engine, and multi-tenant architecture. Dark-themed production app, live and in active use.", stack: ["Next.js", "Node.js", "PostgreSQL"], featured: false, cased: true, category: "SaaS", url: "https://layoutynextjs.vercel.app", img: "/shots/loyalito.jpg" },
  { title: "Gazeta Demos", client: "Personal · Client Project", desc: "Albanian-language news portal with a full editorial CMS: breaking news, categories, live search, and ad integration. Live platform serving Kosovo readership daily.", stack: ["WordPress", "PHP", "MySQL"], featured: false, category: "Media", url: "https://gazetademos.com", img: "/shots/gazeta-demos.jpg" },
  { title: "Virton Invest · River Residence", client: "Personal · Client Project", desc: "Real estate investment platform showcasing a luxury riverside development: listings, investment calculator, inquiry system.", stack: ["Next.js", "Node.js", "PostgreSQL"], featured: false, category: "Real Estate", url: null, img: null },
  { title: "IP3 CRM System", client: "Personal · Client Project", desc: "Full custom CRM built for the German-speaking market: customer lifecycle management, pipeline tracking, reporting dashboard, role-based access control, and password recovery flow. Live and in active use.", stack: ["React.js", "Nest.js", "PostgreSQL"], featured: false, cased: true, category: "SaaS", url: "https://crm-frontend-xi-three.vercel.app/login", img: "/shots/ip3-crm.jpg" },
  { title: "B&C · Be Brave and Creative", client: "Personal · Client Project", desc: "Brand website for the Prague F&B company behind MrBurger and Pizzaiolo: company identity, concept presentation for both restaurant brands, and contact. Part of a 3-site delivery for one client.", stack: ["Next.js", "Tailwind CSS"], featured: false, category: "Branding", url: "https://www.by-bc.com", img: "/shots/bc.jpg" },
  { title: "Muha Investments", client: "Personal · Client Project", desc: "Business website for a transport & property development company in Blantyre, Malawi: passenger transport, goods logistics, and property development. Live in Africa.", stack: ["Next.js", "Tailwind CSS", "Node.js"], featured: false, category: "Website", url: "https://www.muha-investments.com", img: "/shots/muha.jpg" },
  { title: "Idon Inžinering", client: "Personal · Client Project", desc: "Slovenian engineering & construction company website with 20+ years of experience, service pages, project gallery, and lead generation. Built in Slovenian.", stack: ["WordPress", "PHP", "Elementor"], featured: false, category: "Website", url: "https://idon.si", img: "/shots/idon.jpg" },
  { title: "Dizajn Group", client: "Personal · Client Project", desc: "Product showcase website for a Kosovo doors & kitchens company: wholesale & retail since 2015, 75+ sales points across Kosovo, product catalogue with PDF download, inspiration gallery, and dealer contact.", stack: ["WordPress", "Elementor", "PHP"], featured: false, category: "Website", url: "https://dizajn-group.com", img: "/shots/dizajn-group.jpg" },
  { title: "Pizzaiolo · Restaurant Website", client: "Personal · Client Project", desc: "Full restaurant website for an Italian pizzeria in Prague Žižkov: multilingual (CZ/EN), online menu with ordering integration (Bolt Food & Wolt), blog, lunch menu, and SEO optimisation. 500+ reviews, live and in active use.", stack: ["Next.js", "Vercel", "Tailwind CSS"], featured: false, category: "Website", url: "https://pizzaiolo-sigma.vercel.app", img: "/shots/pizzaiolo.jpg" },
  { title: "Orama Transport", client: "Personal · Client Project", desc: "Full business website for Cape Town's premier transport company: bus services, same-day courier, car hire, and accommodation under one platform. Quote system, multi-service pages, 24/7 support, 5,000+ clients. Live in South Africa.", stack: ["Next.js", "Tailwind CSS", "Node.js"], featured: false, category: "Website", url: "https://oramatransport.com", img: "/shots/orama.jpg" },
];

/* ─── ABOUT / LANGUAGES ─────────────────────────────────────────────────── */
const ABOUT_PARAS = [
  "I'm Edita. A full-stack engineer and tech lead based in Pristina, Kosovo, working with teams across Austria, Switzerland, and Germany.",
  "I write code every day, and I'm close to the rest of the team through dailies, sprint planning, code reviews and workshops. I work with designers, product owners, QA and DevOps, help test tickets before they're merged, and keep an eye on hotfixes through releases. Most of it is remote, and I'm open to relocating if a company needs me on-site.",
  "I work hard, and I do it honestly. I take a project from the first line of code to the day it goes live, and I own it the whole way. I care where I put that work, so I'm picky about the teams I say yes to.",
];

const BRINGS = [
  "End-to-end feature ownership",
  "Technical leadership & mentoring",
  "Cross-functional collaboration",
  "Legacy migration & modernisation",
  "On-site workshops & delivery",
  "Full-stack architecture & APIs",
];

/* Playful reputation tags the team gave her. */
const KNOWN_AS = ["The Pixel-Perfect Lady", "The Energy", "The Reminder"];

const WORKS_ACROSS = ["Kosovo", "Germany", "Switzerland", "Austria", "Czechia", "Slovenia", "France", "Netherlands", "South Africa"];

const LANGUAGES = [
  { name: "Albanian", level: "Native" },
  { name: "English", level: "Full Professional" },
];

/* ─── HOW I HELP / HOW I WORK ───────────────────────────────────────────── */
const SERVICES = [
  {
    n: "01",
    title: "Product, built end to end",
    desc: "From an empty repo to something live: architecture, frontend, backend, database, all of it. You get one person who owns the whole thing, not a hand-off chain.",
    tags: ["React / Next", "Node / Nest", "PostgreSQL"],
  },
  {
    n: "02",
    title: "Tech leadership for your team",
    desc: "I lead and mentor the developers, run code reviews, set the standards, and keep delivery moving. I've trained 80+ developers and helped juniors grow into stronger engineers.",
    tags: ["Code review", "Mentoring", "Agile / Scrum"],
  },
  {
    n: "03",
    title: "AI features & automation",
    desc: "AI built into products where it genuinely helps, with everything it writes reviewed. Plus the repetitive work around delivery automated with n8n and a bit of custom tooling.",
    tags: ["AI / LLMs", "n8n", "APIs"],
  },
];

const PROCESS = [
  { n: "01", title: "Scope", desc: "We get clear on the problem, the constraints, and what “done” actually means." },
  { n: "02", title: "Build", desc: "I work in small increments, in the open, so you watch it take shape. No big-bang reveal." },
  { n: "03", title: "Review", desc: "Code review, QA, and your feedback baked in along the way, not bolted on at the end." },
  { n: "04", title: "Deliver", desc: "It goes live, it's documented, and your team can own it without me in the room." },
];

const COURSES = ["Arra Academy", "Probit Academy", "University of the People"];

/* ─── CURRENTLY BUILDING — Edita updates this list + the date ───────────── */
const NOW_UPDATED = "June 2026";
const BUILDING = [
  {
    title: "GTM Automation",
    tag: "GTM · Platform",
    status: "In progress",
    desc: "A GTM engineer runs on about ten separate tools. I'm automating that whole stack into one all-in-one platform, with a real app on top: dashboards and everything in a single place. I'm starting with it for my own use.",
  },
  {
    title: "n8n Workflow Project",
    tag: "n8n · Automation",
    status: "In progress",
    desc: "An n8n automation for the processes that eat my time. I hand the repetitive parts to it and stay more flexible for the work that actually needs me.",
  },
  {
    title: "ORBIT · AgentOS",
    tag: "AI · Product",
    status: "In progress",
    desc: "An AI operating system for business. One layer that sits on top of the tools a company already uses, connects them, learns from their data, and runs the work on its own: named AI operators, each owning a department, all coordinated from a single workspace. The most ambitious thing I'm building.",
    highlight: true,
  },
  {
    title: "RoleAI",
    tag: "AI · Collaboration",
    status: "In discussion",
    desc: "An intelligent job-application platform for developers. Millions apply every day and get filtered out by an ATS before a human ever sees them. RoleAI reads each job post, tailors your CV to get past the ATS, and applies only where you have a real shot, instead of firing off blind applications. A collaboration, and one I'm excited about. Stay tuned.",
  },
];

/* ─── FAQ ───────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Do you work remotely?", a: "Yes. I work remotely day to day, and I'm open to relocating if a company needs me on-site. I already work with teams in Austria, Switzerland and Germany." },
  { q: "How do you usually work with teams?", a: "On contract, embedded in the team, either building hands-on as a full-stack engineer or leading as a tech lead. I take on a few teams at a time so each one gets real attention." },
  { q: "What's your stack?", a: "React and Next.js, Vue and Nuxt, Node and Nest.js, PostgreSQL, TypeScript, Docker. I'm comfortable picking up your stack too. The principles carry over." },
  { q: "Are you available right now?", a: "I'm open to both: a full-time role (remote, or relocating if it's the right fit) and a few select contract projects. The fastest way to find out if we're a fit is to book a short call." },
  { q: "Do you lead teams or build hands-on?", a: "Both, every day. I write production code daily and I'm in the dailies, sprint planning, code reviews and workshops. I help QA when a ticket is being tested, setting it up and checking it through to merge and done. I keep an eye on hotfixes during releases, and work closely with DevOps." },
  { q: "What languages do you work in?", a: "Albanian natively and English at a full professional level. Standups, docs, and client calls all run in English." },
];

/* ─── WRITING / NOTES (drafts — Edita to review & edit) ─────────────────── */
const NOTES = [
  {
    title: "Migrating a legacy app with zero downtime",
    date: "2026",
    read: "4 min read",
    excerpt: "Replacing the system underneath an app while people keep using it is one of those jobs where the only acceptable result is that nobody notices.",
    body: [
      "No downtime, no lost data, no “we'll be back in an hour” page. Just a modern stack where an old one used to be.",
      "I didn't rewrite it from scratch. A full rewrite sounds clean, but it's where these projects go to die. You spend months rebuilding things nobody remembers needing, and you find out what you missed once it's already in production. So I started by reading the old code and the data, working out what was actually used and what was just sitting there.",
      "Then I moved it over in pieces. The new stack went in front of the old one and took over one part at a time. For a while both were running together, and if something didn't look right I could send traffic back to the old path in seconds. No big switch-over day.",
      "The data took the most care. You're not done when the new code runs. You're done when every record and every relation, including the strange ones someone entered years ago, lands in the new database exactly as it was. I kept checks running that compared old and new on every pass, and I didn't move a piece until the numbers lined up.",
      "It went out in stages, with no downtime and nothing lost. The team got a codebase they could work in again, and the people using it never knew anything had changed.",
    ],
  },
  {
    title: "RBAC in practice: the roles people actually use",
    date: "2026",
    read: "3 min read",
    excerpt: "Access control looks simple until you watch a real team use the thing you built.",
    body: [
      "On paper it's “admin” and “user.” In practice there's the person who does everything, the one who only opens a single screen, the contractor who should see one client and not the others, and the manager who wants to see all of it but shouldn't change a thing.",
      "On the IP3 CRM, nobody asked me about permissions. But it's the part that decides whether people trust the system. The first time someone sees a number they shouldn't, you've lost them.",
      "I built the roles around the actual jobs people do, not around an abstract list of permissions. Who creates, who approves, who only looks. A few clear roles that each match how a real person works, so anyone on the team can reason about who sees what.",
      "I kept the checks on the server, next to the data. When permissions are spread through the UI, one of them is wrong and you won't find it until it matters. And the default is no: a new screen or field stays hidden until someone decides a role should have it. Opening access up later is easy. Taking it back after everyone has already seen everything is not.",
    ],
  },
  {
    title: "Using AI without letting the codebase slip",
    date: "2026",
    read: "3 min read",
    excerpt: "I use AI a lot and I like working with it. But I read everything it gives me before it goes anywhere near the codebase.",
    body: [
      "A good model with a sloppy prompt will hand you code that works and is put together badly: components sitting where they don't belong, the same logic pasted in three places, no structure you'd want to maintain.",
      "So I treat what AI writes like a pull request from someone fast but junior. It gets reviewed. The first thing I look at is structure: is this component going to be needed elsewhere, and if it is, should it be reusable now instead of duplicated later? Same with API calls, queries, and error handling, the things that quietly get rewritten in five slightly different ways if nobody stops to pull them into one.",
      "That's the part I care about most. It's not whether AI can produce a feature. It can. The question is whether what comes out is something the team can build on: one reusable component, one shared query, one place errors are handled, instead of the same thing scattered around with small differences.",
      "And the time AI actually saves me usually isn't a feature at all. It's the repetitive work around delivery: automations that move data between tools, routine checks, setup that used to eat a morning. I let it take that, I review what it does, and I keep the structure of the product something a person decided on.",
    ],
  },
];

/* ─── CONTACT / IDENTITY CONSTANTS ──────────────────────────────────────── */
const CV_URL = "/Edita-Latifi-CV.pdf";
const EMAIL = "editalatifi1996@gmail.com";
const PHONE = "+383 49 178 050";
const LINKEDIN = "https://www.linkedin.com/in/edita-latifi";
const GITHUB = "https://github.com/EditaLatifi";
const GITHUB_REPO = "https://github.com/EditaLatifi/editadev";
const CALENDLY = "https://calendly.com/editalatifi1996/30min";

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const downloadCV = () => {
  const a = document.createElement("a");
  a.href = CV_URL;
  a.download = "Edita-Latifi-CV.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const STATS = [
  { n: 6, suffix: "+", label: "Years Experience" },
  { n: 20, suffix: "+", label: "Apps Delivered" },
  { n: 9, suffix: "+", label: "Countries" },
  { n: 80, suffix: "+", label: "Developers Trained" },
];

const COMMANDS = [
  { id: "about", label: "Go to About", hint: "section", action: () => scrollToId("about") },
  { id: "now", label: "Go to Currently Building", hint: "section", action: () => scrollToId("now") },
  { id: "services", label: "Go to How I Help", hint: "section", action: () => scrollToId("services") },
  { id: "stack", label: "Go to Tech Stack", hint: "section", action: () => scrollToId("stack") },
  { id: "experience", label: "Go to Experience", hint: "section", action: () => scrollToId("experience") },
  { id: "projects", label: "Go to Projects", hint: "section", action: () => scrollToId("projects") },
  { id: "writing", label: "Go to Writing", hint: "section", action: () => scrollToId("writing") },
  { id: "faq", label: "Go to FAQ", hint: "section", action: () => scrollToId("faq") },
  { id: "contact", label: "Go to Contact", hint: "section", action: () => scrollToId("contact") },
  { id: "cv", label: "Download CV (PDF)", hint: "download", action: downloadCV },
  { id: "email", label: "Email Edita", hint: "link", action: () => { window.location.href = `mailto:${EMAIL}`; } },
  { id: "linkedin", label: "Open LinkedIn", hint: "link", action: () => window.open(LINKEDIN, "_blank") },
  { id: "github", label: "Open GitHub", hint: "link", action: () => window.open(GITHUB, "_blank") },
  { id: "call", label: "Book a 30-min call", hint: "calendly", action: () => window.open(CALENDLY, "_blank") },
];

/* ─── SHARED UI HELPERS ─────────────────────────────────────────────────── */
const sec = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "6rem clamp(1.5rem,6vw,6rem)",
  position: "relative",
  zIndex: 1,
};

function Label({ n, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: "1.4rem" }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".74rem", color: C.cyan, letterSpacing: ".22em" }}>{n}</span>
      <span style={{ width: 34, height: 1, background: C.cyanDim }} />
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.textMuted, letterSpacing: ".22em", textTransform: "uppercase" }}>{t}</span>
    </div>
  );
}

function H2({ children, nm }) {
  return (
    <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3.2rem)", color: C.textPrimary, margin: nm ? 0 : "0 0 .3rem", lineHeight: 1.05, letterSpacing: "-.025em" }}>
      {children}
    </h2>
  );
}

function Ac({ children }) {
  return <span style={{ color: C.cyan }}>{children}</span>;
}

function Chip({ children, sm }) {
  return (
    <span
      style={{
        fontFamily: "'DM Mono',monospace",
        fontSize: sm ? ".62rem" : ".7rem",
        color: C.textBody,
        background: C.cyanGlow,
        border: `1px solid ${C.border}`,
        padding: sm ? ".22rem .52rem" : ".3rem .62rem",
        borderRadius: 2,
        letterSpacing: ".03em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ─── HOOKS ─────────────────────────────────────────────────────────────── */
function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    // threshold 0 + rootMargin so it fires when a section's top enters view —
    // a fixed threshold never triggers on sections taller than the viewport (mobile).
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);
  return reduced;
}

function useIsMobile() {
  const q = "(max-width: 820px)";
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const h = (e) => setM(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);
  return m;
}

function useCountUp(target, run, duration = 1400) {
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return undefined;
    if (reduced) { setN(target); return undefined; }
    let raf, start;
    const step = (ts) => {
      if (start === undefined) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration, reduced]);
  return n;
}

/* ─── PARTICLE CANVAS ───────────────────────────────────────────────────── */
function ParticleCanvas({ explode, onExplodeDone, reduced }) {
  const cv = useRef(null);
  const st = useRef({ phase: "idle", parts: [] });

  useEffect(() => {
    const c = cv.current, ctx = c.getContext("2d");
    let W, H, raf = 0, hidden = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + "px"; c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = W < 700 ? 26 : 55;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00028, vy: (Math.random() - 0.5) * 0.00028,
      r: Math.random() * 1.3 + 0.3,
      op: Math.random() * 0.35 + 0.08,
      col: Math.random() > 0.55 ? C.cyan : C.green,
    }));

    const drawField = (move) => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        if (move) { d.x = (d.x + d.vx + 1) % 1; d.y = (d.y + d.vy + 1) % 1; }
        ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.col + Math.floor(d.op * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
        const dx = (dots[i].x - dots[j].x) * W, dy = (dots[i].y - dots[j].y) * H;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 115) {
          ctx.beginPath(); ctx.moveTo(dots[i].x * W, dots[i].y * H); ctx.lineTo(dots[j].x * W, dots[j].y * H);
          ctx.strokeStyle = C.cyan + Math.floor((1 - dist / 115) * 20).toString(16).padStart(2, "0");
          ctx.lineWidth = 0.4; ctx.stroke();
        }
      }
    };

    // Reduced motion: paint a single static frame, no loop.
    if (reduced) {
      drawField(false);
      return () => window.removeEventListener("resize", resize);
    }

    const draw = () => {
      if (hidden) { raf = 0; return; }
      drawField(true);
      const s = st.current;
      if (s.phase === "exploding") {
        let alive = false;
        s.parts.forEach((p) => {
          p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.life -= 0.013;
          if (p.life > 0) {
            alive = true;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.col + Math.floor(p.life * 210).toString(16).padStart(2, "0");
            ctx.fill();
          }
        });
        if (!alive) { s.phase = "idle"; onExplodeDone?.(); }
      }
      raf = requestAnimationFrame(draw);
    };
    const onVis = () => {
      hidden = document.hidden;
      if (!hidden && !raf) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  useEffect(() => {
    if (!explode || reduced) return;
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    st.current.parts = Array.from({ length: 220 }, () => {
      const a = Math.random() * Math.PI * 2, sp = Math.random() * 14 + 2;
      return { x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: Math.random() * 3 + 1, life: Math.random() * 0.6 + 0.7, col: Math.random() > 0.45 ? C.cyan : C.green };
    });
    st.current.phase = "exploding";
  }, [explode, reduced]);

  return <canvas ref={cv} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ─── TERMINAL (intro gate — skippable) ─────────────────────────────────── */
const BOOT = [
  { t: "INITIALISING...", d: 0, c: C.textMuted },
  { t: "LOADING PROFILE: EDITA_LATIFI.DAT", d: 450, c: C.cyan },
  { t: "STACK: FULL STACK + TECH LEAD · VERIFIED", d: 950, c: C.green },
  { t: "RECORD: 6+ YEARS · 4 COUNTRIES · 20+ APPS", d: 1450, c: C.green },
  { t: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%", d: 2000, c: C.cyan },
  { t: "READY.", d: 2500, c: C.textPrimary },
];

function Terminal({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [btn, setBtn] = useState(false);
  const [out, setOut] = useState(false);
  const done = useRef(false);

  const go = () => {
    if (done.current) return;
    done.current = true;
    setOut(true);
    setTimeout(onComplete, 600);
  };

  useEffect(() => {
    const timers = BOOT.map(({ t, d, c }) => setTimeout(() => setLines((l) => [...l, { t, c }]), d));
    timers.push(setTimeout(() => setBtn(true), 2900));
    timers.push(setTimeout(go, 5200)); // auto-advance if the visitor is idle
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div role="dialog" aria-label="Intro" style={{ position: "fixed", inset: 0, zIndex: 50, background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", opacity: out ? 0 : 1, transition: "opacity .6s ease", pointerEvents: out ? "none" : "auto" }}>
      <button onClick={go} style={{ position: "absolute", top: 22, right: 24, background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: "'DM Mono',monospace", fontSize: ".68rem", letterSpacing: ".14em", textTransform: "uppercase", padding: ".4rem .9rem", borderRadius: 2, cursor: "pointer", transition: "all .2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.cyan; e.currentTarget.style.borderColor = C.cyan; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
      >skip →</button>

      <div style={{ width: "min(600px,92vw)", background: C.bgCard, border: `1px solid ${C.borderHi}`, borderRadius: 4, padding: "2.4rem", fontFamily: "'DM Mono',monospace", boxShadow: `0 0 60px ${C.cyan}18, 0 0 120px ${C.cyan}08` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: "1.8rem" }}>
          {["#ff5f57", "#ffbd2e", "#28ca41"].map((col) => <div key={col} style={{ width: 12, height: 12, borderRadius: "50%", background: col, opacity: 0.8 }} />)}
        </div>
        <div style={{ minHeight: 190 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: ".8rem", fontSize: ".78rem", letterSpacing: ".06em", lineHeight: 2.1 }}>
              <span style={{ color: C.cyan, opacity: 0.45 }}>$</span>
              <span style={{ color: l.c }}>{l.t}</span>
            </div>
          ))}
          {lines.length < BOOT.length && <span style={{ display: "inline-block", width: 8, height: "1em", background: C.cyan, animation: "blink .9s step-end infinite", verticalAlign: "middle" }} />}
        </div>
        {btn && (
          <button onClick={go} autoFocus style={{ marginTop: "2rem", width: "100%", padding: ".95rem", background: "transparent", border: `1px solid ${C.cyan}`, color: C.cyan, fontFamily: "'DM Mono',monospace", fontSize: ".82rem", letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s", animation: "glow 1.6s ease-in-out infinite", borderRadius: 2 }}
            onMouseEnter={(e) => { e.target.style.background = C.cyanGlow; e.target.style.color = C.textPrimary; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = C.cyan; }}
          >[ ENTER ]</button>
        )}
      </div>
    </div>
  );
}

/* ─── NAV ───────────────────────────────────────────────────────────────── */
function Nav({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(1rem,5vw,5rem)", background: scrolled ? `${C.bg}f0` : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all .4s" }}>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: ".05em", color: C.textPrimary }}>EL<span style={{ color: C.cyan }}>.</span></button>
      <div style={{ display: "flex", gap: "clamp(1rem,3vw,2rem)", alignItems: "center" }}>
        <div className="nav-links" style={{ display: "flex", gap: "clamp(1rem,3vw,2rem)", alignItems: "center" }}>
          {["About", "Now", "Services", "Experience", "Projects", "Writing", "Contact"].map((s) => (
            <button key={s} onClick={() => scrollToId(s.toLowerCase())}
              style={{ color: C.textMuted, background: "none", border: "none", fontFamily: "'DM Mono',monospace", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", transition: "color .2s", cursor: "pointer" }}
              onMouseEnter={(e) => (e.target.style.color = C.cyan)}
              onMouseLeave={(e) => (e.target.style.color = C.textMuted)}
            >{s}</button>
          ))}
        </div>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub profile"
          style={{ display: "inline-flex", alignItems: "center", color: C.textMuted, transition: "color .2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>
          <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        </a>
        <button onClick={onOpenPalette} title="Command palette (Ctrl/⌘ + K)" aria-label="Open command palette"
          style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".35rem .6rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 3, color: C.textMuted, fontFamily: "'DM Mono',monospace", fontSize: ".62rem", letterSpacing: ".06em", cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
        >⌘K</button>
        <button onClick={downloadCV}
          style={{ padding: ".45rem 1rem", background: C.cyan, color: "#030712", border: "none", fontFamily: "'DM Mono',monospace", fontSize: ".66rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, borderRadius: 2, cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f6ff")}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.cyan)}
        >CV ↓</button>
      </div>
    </nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────────────────────── */
function Hero({ ready }) {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, [ready]);

  // Parallax via CSS custom properties (no React re-render per mousemove).
  useEffect(() => {
    if (reduced) return undefined;
    const el = sectionRef.current;
    let raf = 0, mx = 0, my = 0;
    const apply = () => { raf = 0; if (el) { el.style.setProperty("--mx", mx.toFixed(2)); el.style.setProperty("--my", my.toFixed(2)); } };
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 22;
      my = (e.clientY / window.innerHeight - 0.5) * 13;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <section ref={sectionRef} aria-label="Intro" style={{ "--mx": 0, "--my": 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "80px clamp(1.5rem,6vw,6rem) 4rem", position: "relative", zIndex: 1 }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 60% 50% at calc(50% + (var(--mx) * 0.4%)) calc(42% + (var(--my) * 0.4%)), ${C.cyan}0b 0%, transparent 68%)` }} />

      {/* Availability badge */}
      <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", marginBottom: "1.6rem", padding: ".4rem .9rem", border: `1px solid ${C.greenDim}`, borderRadius: 999, background: `${C.green}0a`, textDecoration: "none", fontFamily: "'DM Mono',monospace", fontSize: ".68rem", letterSpacing: ".1em", textTransform: "uppercase", color: C.textBody, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(10px)", transition: "all .8s ease .15s, border-color .2s, color .2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.greenDim; e.currentTarget.style.color = C.textBody; }}>
        <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: reduced ? "none" : "glow 2s ease-in-out infinite" }} />
        Open to roles &amp; select projects
      </a>

      {/* Name */}
      <div style={{ position: "relative", marginBottom: "2rem", opacity: vis ? 1 : 0, transform: vis ? "none" : "scale(.9)", transition: "all .9s cubic-bezier(.16,1,.3,1) .05s" }}>
        <h1 aria-hidden="true" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(4rem,13vw,11rem)", lineHeight: 0.88, letterSpacing: "-.03em", WebkitTextStroke: `1px ${C.cyan}1a`, color: "transparent", position: "absolute", inset: 0, transform: "translate(calc(var(--mx) * 0.65px), calc(var(--my) * 0.65px))", transition: "transform .1s linear", userSelect: "none", whiteSpace: "nowrap" }}>EDITA<br />LATIFI</h1>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(4rem,13vw,11rem)", lineHeight: 0.88, letterSpacing: "-.03em", margin: 0, transform: "translate(calc(var(--mx) * 0.2px), calc(var(--my) * 0.2px))", transition: "transform .12s linear", position: "relative", zIndex: 1, whiteSpace: "nowrap" }}>
          <span style={{ color: C.textPrimary }}>EDITA</span><br />
          <span style={{ WebkitTextStroke: `2px ${C.cyan}`, color: "transparent" }}>LATIFI</span>
        </h1>
      </div>

      {/* Role */}
      <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: "all .8s ease .3s", marginBottom: "1.6rem" }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "clamp(.8rem,1.6vw,1rem)", color: C.textBody, letterSpacing: ".08em", lineHeight: 1.9 }}>
          Full Stack Engineer &amp; Tech Team Lead
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "clamp(.72rem,1.3vw,.88rem)", color: C.textMuted, letterSpacing: ".06em" }}>
          6+ years &nbsp;·&nbsp; Austria · Switzerland · Germany · Kosovo
        </div>
      </div>

      {/* Statement */}
      <p style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: "all .8s ease .45s", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.1rem,2.5vw,1.55rem)", color: C.textPrimary, letterSpacing: "-.01em", margin: "0 0 3rem", lineHeight: 1.4 }}>
        I build it. I lead it. I deliver it.<br />
        <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 400, fontSize: "clamp(.75rem,1.6vw,.9rem)", color: C.textMuted, letterSpacing: ".04em" }}>
          I take on a few teams at a time, and I own what I build for them.
        </span>
      </p>

      {/* CTAs */}
      <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: "all .8s ease .58s", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => scrollToId("projects")}
          style={{ padding: ".88rem 2.2rem", background: C.cyan, color: "#030712", border: "none", fontFamily: "'DM Mono',monospace", fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, borderRadius: 2, transition: "all .2s", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f6ff")}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.cyan)}
        >View Work</button>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
          style={{ padding: ".88rem 2.2rem", border: `1px solid ${C.greenDim}`, color: C.green, background: "transparent", fontFamily: "'DM Mono',monospace", fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", borderRadius: 2, transition: "all .2s", cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = `${C.green}12`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.greenDim; e.currentTarget.style.background = "transparent"; }}
        >Book a Call</a>
        <button onClick={() => scrollToId("contact")}
          style={{ padding: ".88rem 2.2rem", border: `1px solid ${C.border}`, color: C.textBody, background: "transparent", fontFamily: "'DM Mono',monospace", fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", borderRadius: 2, transition: "all .2s", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textBody; }}
        >Contact</button>
      </div>

      <div aria-hidden="true" style={{ position: "absolute", bottom: "2.2rem", left: "50%", transform: "translateX(-50%)", opacity: vis ? 0.35 : 0, transition: "opacity 1s ease 1.3s" }}>
        <div style={{ width: 1, height: 40, background: `linear-gradient(${C.cyan},transparent)`, animation: "drop 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────────────────────── */
function About() {
  const [ref, v] = useInView();
  const [imgOk, setImgOk] = useState(true);
  return (
    <section id="about" ref={ref} style={sec}>
      <Label n="01" t="About" />
      <H2>Who I <Ac>Am</Ac></H2>
      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "min(300px,100%) 1fr", gap: "2.4rem", marginTop: "3rem", alignItems: "start", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: "all .6s ease" }}>
        {/* Photo / monogram */}
        <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}`, background: `linear-gradient(135deg, ${C.cyan}12, ${C.green}08)` }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.cyan},${C.green})`, zIndex: 2 }} />
          {imgOk ? (
            <img src="/edita.jpg?v=2" alt="Edita Latifi — Full Stack Engineer & Tech Lead" loading="lazy" onError={() => setImgOk(false)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 18%" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".6rem" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "4rem", color: C.textPrimary, letterSpacing: "-.03em" }}>EL<span style={{ color: C.cyan }}>.</span></div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textDim, letterSpacing: ".18em", textTransform: "uppercase" }}>Pristina, Kosovo</div>
            </div>
          )}
        </div>

        {/* Text + brings + edu */}
        <div>
          {ABOUT_PARAS.map((p, i) => (
            <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.02rem", color: C.textBody, lineHeight: 1.8, margin: "0 0 1rem" }}>{p}</p>
          ))}

          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: C.cyan, letterSpacing: ".16em", textTransform: "uppercase", margin: "1.8rem 0 1rem" }}>What I bring</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: ".55rem .9rem", marginBottom: "2rem" }}>
            {BRINGS.map((b) => (
              <div key={b} style={{ display: "flex", gap: ".6rem", alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ color: C.green, flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".9rem", color: C.textBody }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: C.green, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: "1rem" }}>Known on the team as</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
              {KNOWN_AS.map((k, i) => (
                <span key={k} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".85rem", fontStyle: "italic", color: C.textPrimary, background: `${i % 2 === 0 ? C.cyan : C.green}0e`, border: `1px solid ${i % 2 === 0 ? C.cyan : C.green}33`, borderRadius: 999, padding: ".4rem .95rem" }}>&ldquo;{k}&rdquo;</span>
              ))}
            </div>
          </div>

          <div className="edu-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.6rem", borderTop: `1px solid ${C.border}`, paddingTop: "1.6rem" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".9rem" }}>Clients &amp; teams across</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
                {WORKS_ACROSS.map((w) => <Chip key={w} sm>{w}</Chip>)}
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textDim, marginTop: ".9rem", letterSpacing: ".04em" }}>Remote · open to relocation</div>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".9rem" }}>Languages</div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
                {LANGUAGES.map((l) => (
                  <div key={l.name}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".86rem", color: C.textPrimary, fontWeight: 500 }}>{l.name}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.green, marginTop: 2 }}>{l.level}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS (animated count-up) ─────────────────────────────────────────── */
function StatItem({ s, i, run }) {
  const n = useCountUp(s.n, run);
  return (
    <div style={{ textAlign: "center", opacity: run ? 1 : 0, transform: run ? "none" : "translateY(16px)", transition: `all .6s ease ${i * 0.08}s` }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem,6vw,3.6rem)", lineHeight: 1, color: i % 2 === 0 ? C.cyan : C.green }}>
        {n}{s.suffix}
      </div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: C.textMuted, letterSpacing: ".16em", textTransform: "uppercase", marginTop: ".6rem" }}>{s.label}</div>
    </div>
  );
}

function Stats() {
  const [ref, v] = useInView(0.3);
  return (
    <section ref={ref} aria-label="Key numbers" style={{ ...sec, paddingTop: "1rem", paddingBottom: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1.5rem", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "2.6rem 0" }}>
        {STATS.map((s, i) => <StatItem key={s.label} s={s} i={i} run={v} />)}
      </div>
    </section>
  );
}

/* ─── STACK ─────────────────────────────────────────────────────────────── */
function Stack() {
  const [ref, v] = useInView();
  const tech = Object.entries(SKILLS).filter(([cat]) => cat !== "Leadership");
  const leadership = SKILLS.Leadership || [];
  return (
    <section id="stack" ref={ref} style={sec}>
      <Label n="03" t="Tech Stack" />
      <H2>What I <Ac>Build With</Ac></H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.2rem", marginTop: "3.5rem", alignItems: "start" }}>
        {tech.map(([cat, items], ci) => (
          <div key={cat} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `opacity .55s ease ${ci * 0.1}s,transform .55s ease ${ci * 0.1}s`, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "1.7rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ci % 2 === 0 ? C.cyan : C.green},transparent)` }} />
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: ci % 2 === 0 ? C.cyan : C.green, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>{cat}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
              {items.map((s) => <Chip key={s}>{s}</Chip>)}
            </div>
          </div>
        ))}
      </div>

      {leadership.length > 0 && (
        <div style={{ marginTop: "1.2rem", background: C.bgCard, border: `1px solid ${C.greenDim}`, borderRadius: 4, padding: "1.7rem", position: "relative", overflow: "hidden", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: "all .55s ease .35s" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.green},${C.cyan})` }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: ".8rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: C.green, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 500 }}>Leadership</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", color: C.textMuted }}>How I run a team, not just a codebase.</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
            {leadership.map((s) => <Chip key={s}>{s}</Chip>)}
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── EXPERIENCE ────────────────────────────────────────────────────────── */
function Experience() {
  const [ref, v] = useInView();
  const [active, setActive] = useState(0);
  const e = EXPERIENCE[active];
  return (
    <section id="experience" ref={ref} style={sec}>
      <Label n="04" t="Experience" />
      <H2>Where I've <Ac>Delivered</Ac></H2>
      <div style={{ display: "grid", gridTemplateColumns: "min(240px, 100%) 1fr", gap: "1.5rem", marginTop: "3.5rem" }} className="exp-grid">
        <div className="exp-tabs" style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
          {EXPERIENCE.map((ex, i) => (
            <button key={ex.company} onClick={() => setActive(i)} aria-pressed={active === i} style={{ background: active === i ? C.cyanGlow : "transparent", border: "none", borderLeft: `2px solid ${active === i ? C.cyan : C.border}`, padding: ".9rem 1.4rem", textAlign: "left", cursor: "pointer", transition: "all .2s", opacity: v ? 1 : 0, transform: v ? "none" : "translateX(-18px)", transitionDelay: `${i * 0.08}s` }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".88rem", color: active === i ? C.cyan : C.textBody }}>{ex.company}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, marginTop: 3 }}>{ex.period}</div>
            </button>
          ))}
        </div>
        <div key={active} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2.2rem", position: "relative", overflow: "hidden", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(18px)", transition: "all .5s ease .2s" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${e.color},transparent)` }} />
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".65rem", color: C.textMuted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>{e.location}</div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 700, color: C.textPrimary, margin: ".3rem 0 .2rem" }}>{e.role}</h3>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".95rem", color: e.color, marginBottom: "1.6rem", fontWeight: 600 }}>{e.company}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {e.points.map((pt, i) => (
              <li key={i} style={{ display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ color: C.cyan, flexShrink: 0, marginTop: 2 }}>▸</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".93rem", color: C.textBody, lineHeight: 1.65 }}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─── CURRENTLY BUILDING / NOW ──────────────────────────────────────────── */
function Now() {
  const [ref, v] = useInView();
  return (
    <section id="now" ref={ref} style={sec}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.4rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: ".6rem" }}>
          <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: C.green, boxShadow: `0 0 10px ${C.green}`, animation: "glow 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.green, letterSpacing: ".22em", textTransform: "uppercase" }}>Currently Building</span>
        </div>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textDim, letterSpacing: ".1em" }}>Updated {NOW_UPDATED}</span>
      </div>
      <H2>Things I'm <Ac>Building Now</Ac></H2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".95rem", color: C.textBody, lineHeight: 1.7, maxWidth: 560, margin: "1.2rem 0 0" }}>
        What I'm building right now, and what's coming next. I keep this updated as things move.
      </p>
      <div className="now-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "1.2rem", marginTop: "2.5rem", alignItems: "start" }}>
        {BUILDING.map((b, i) => (
          <div key={b.title} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `all .5s ease ${i * 0.08}s`, background: C.bgCard, border: `1px solid ${b.highlight ? C.green + "55" : C.border}`, borderRadius: 4, padding: "1.7rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${b.highlight ? C.green : C.cyan},transparent)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".7rem", gap: ".5rem" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: b.highlight ? C.green : C.cyan, letterSpacing: ".14em", textTransform: "uppercase" }}>{b.tag}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".56rem", color: C.textDim, border: `1px solid ${C.border}`, padding: ".12rem .45rem", borderRadius: 2, letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{b.status}</span>
            </div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.12rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 .5rem" }}>{b.title}</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".88rem", color: C.textBody, lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── HOW I HELP / HOW I WORK ───────────────────────────────────────────── */
function Services() {
  const [ref, v] = useInView();
  return (
    <section id="services" ref={ref} style={sec}>
      <Label n="02" t="How I Help" />
      <H2>What I <Ac>Do</Ac></H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.2rem", marginTop: "3.5rem" }}>
        {SERVICES.map((s, i) => (
          <div key={s.title} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `opacity .55s ease ${i * 0.1}s,transform .55s ease ${i * 0.1}s`, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "1.9rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${i % 2 === 0 ? C.cyan : C.green},transparent)` }} />
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: i % 2 === 0 ? C.cyan : C.green, letterSpacing: ".12em" }}>{s.n}</div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.15rem", fontWeight: 700, color: C.textPrimary, margin: ".5rem 0 .6rem" }}>{s.title}</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".9rem", color: C.textBody, lineHeight: 1.65, margin: "0 0 1.1rem" }}>{s.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
              {s.tags.map((t) => <Chip key={t} sm>{t}</Chip>)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: C.cyan, letterSpacing: ".16em", textTransform: "uppercase", margin: "3.2rem 0 1.4rem" }}>How I work</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "1.4rem" }}>
        {PROCESS.map((p, i) => (
          <div key={p.title} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: `all .5s ease ${i * 0.08}s`, paddingLeft: "1rem", borderLeft: `2px solid ${C.border}` }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.6rem", color: i === 3 ? C.green : C.cyan, lineHeight: 1 }}>{p.n}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".98rem", color: C.textPrimary, margin: ".4rem 0 .3rem" }}>{p.title}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".84rem", color: C.textBody, lineHeight: 1.55 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── TEACHING & CREDENTIALS ────────────────────────────────────────────── */
function Teaching() {
  const [ref, v] = useInView(0.2);
  return (
    <section ref={ref} aria-label="Teaching and credentials" style={{ ...sec, paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2rem", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "2.6rem 0", alignItems: "center", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(18px)", transition: "all .6s ease" }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)", color: C.green, lineHeight: 1 }}>80+ trained</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".92rem", color: C.textBody, lineHeight: 1.65, margin: ".8rem 0 0", maxWidth: 440 }}>
            I've taught full-stack development to 80+ people (HTML, CSS, JavaScript, Node, React, APIs and databases) and mentored juniors into stronger engineers. Leading people is part of how I work, not a side note.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".9rem" }}>Courses & training</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
            {COURSES.map((c) => <Chip key={c} sm>{c}</Chip>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── WRITING / NOTES ───────────────────────────────────────────────────── */
function NoteCard({ note, i, v }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `all .5s ease ${i * 0.08}s`, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "1.7rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${i % 2 === 0 ? C.cyan : C.green},transparent)` }} />
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, letterSpacing: ".08em" }}>{note.date} · {note.read}</div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.12rem", fontWeight: 700, color: C.textPrimary, margin: ".5rem 0 .6rem" }}>{note.title}</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".9rem", color: C.textBody, lineHeight: 1.7, margin: 0 }}>{note.excerpt}</p>
      {open && note.body.map((para, k) => (
        <p key={k} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".9rem", color: C.textBody, lineHeight: 1.75, margin: "1rem 0 0" }}>{para}</p>
      ))}
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
        style={{ marginTop: "1.1rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase", padding: 0 }}>
        {open ? "Close ↑" : "Read ↓"}
      </button>
    </div>
  );
}

function Writing() {
  const [ref, v] = useInView();
  return (
    <section id="writing" ref={ref} style={sec}>
      <Label n="07" t="Writing" />
      <H2>Notes on the <Ac>Craft</Ac></H2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".95rem", color: C.textBody, lineHeight: 1.7, maxWidth: 560, margin: "1.2rem 0 0" }}>
        Short pieces on how I actually build. The decisions behind the work, not the buzzwords.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.2rem", marginTop: "2.5rem", alignItems: "start" }}>
        {NOTES.map((note, i) => <NoteCard key={note.title} note={note} i={i} v={v} />)}
      </div>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────────────────── */
function FaqItem({ item, i, v }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <div style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(16px)", transition: `all .45s ease ${i * 0.06}s`, borderBottom: `1px solid ${C.border}` }}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", background: "none", border: "none", cursor: "pointer", padding: "1.2rem 0", textAlign: "left" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: C.textPrimary }}>{item.q}</span>
        <span aria-hidden="true" style={{ color: C.cyan, fontFamily: "'DM Mono',monospace", fontSize: "1.2rem", flexShrink: 0 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".92rem", color: C.textBody, lineHeight: 1.7, margin: "0 0 1.3rem", maxWidth: 640 }}>{item.a}</p>}
    </div>
  );
}

function Faq() {
  const [ref, v] = useInView();
  return (
    <section id="faq" ref={ref} style={sec}>
      <Label n="08" t="FAQ" />
      <H2>Good to <Ac>Know</Ac></H2>
      <div style={{ marginTop: "2.5rem", borderTop: `1px solid ${C.border}` }}>
        {FAQS.map((item, i) => <FaqItem key={item.q} item={item} i={i} v={v} />)}
      </div>
    </section>
  );
}

/* ─── CASE STUDIES ──────────────────────────────────────────────────────── */
const visualWrap = {
  position: "relative", height: "100%", minHeight: 200, display: "flex",
  flexDirection: "column", alignItems: "center", justifyContent: "center",
  gap: "1.4rem", padding: "2rem", textAlign: "center",
  background: `linear-gradient(135deg, ${C.cyan}0c, ${C.green}08)`,
};

const nodeStyle = (accent) => ({
  fontFamily: "'DM Mono',monospace", fontSize: ".74rem", color: C.textPrimary,
  letterSpacing: ".04em", padding: ".5rem .8rem", borderRadius: 4,
  border: `1px solid ${accent}`, background: `${accent}14`, whiteSpace: "nowrap",
});

function AIVisual() {
  const steps = [{ t: "Trigger", a: C.border }, { t: "AI", a: C.cyan }, { t: "n8n", a: C.green }, { t: "Deliver", a: C.cyan }];
  return (
    <div style={visualWrap}>
      <div style={{ display: "flex", alignItems: "center", gap: ".55rem", flexWrap: "wrap", justifyContent: "center" }}>
        {steps.map((s, i) => (
          <div key={s.t} style={{ display: "flex", alignItems: "center", gap: ".55rem" }}>
            <div style={nodeStyle(s.a === C.border ? C.cyanDim : s.a)}>{s.t}</div>
            {i < steps.length - 1 && <span aria-hidden="true" style={{ color: C.cyan }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".74rem", color: C.textMuted, letterSpacing: ".06em" }}>AI&nbsp;+&nbsp;automation, wired into delivery</div>
    </div>
  );
}

function CollabVisual() {
  const roles = ["Designers", "Product", "QA", "Stakeholders"];
  return (
    <div style={visualWrap}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", justifyContent: "center", maxWidth: 290 }}>
        {roles.map((r) => <div key={r} style={nodeStyle(C.cyanDim)}>{r}</div>)}
      </div>
      <span aria-hidden="true" style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", color: C.cyan }}>↓</span>
      <div style={{ ...nodeStyle(C.green), fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: 0, color: C.green }}>Delivered, together</div>
    </div>
  );
}

function MigrationVisual() {
  return (
    <div style={visualWrap}>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".6rem", color: C.textMuted, letterSpacing: ".16em", textTransform: "uppercase" }}>Phased migration</div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ ...nodeStyle(C.textDim), opacity: 0.7, textDecoration: "line-through", color: C.textMuted }}>Legacy stack</div>
        <span aria-hidden="true" style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", color: C.cyan }}>→</span>
        <div style={{ ...nodeStyle(C.green), fontWeight: 700, color: C.green }}>Modern stack</div>
      </div>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 300 }}>
        {["Audit", "Slice", "Verify", "Cut over"].map((s, i) => (
          <div key={s} style={nodeStyle(i === 3 ? C.green : C.cyanDim)}>{s}</div>
        ))}
      </div>
      <div style={{ ...nodeStyle(C.green), fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: 0, color: C.green }}>Zero downtime</div>
    </div>
  );
}

function CaseVisual({ cs }) {
  if (cs.img) {
    return <img src={cs.img} alt={`${cs.title} — screenshot`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />;
  }
  if (cs.visual === "ai") return <AIVisual />;
  if (cs.visual === "collab") return <CollabVisual />;
  if (cs.visual === "migration") return <MigrationVisual />;
  return null;
}

function CaseRow({ label, text }) {
  return (
    <div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".6rem", color: C.textMuted, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".35rem" }}>{label}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".9rem", color: C.textBody, lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function CaseStudy({ cs, i }) {
  const [ref, v] = useInView(0.12);
  const isMobile = useIsMobile();
  // On desktop the first case study opens by default; on mobile nothing auto-opens.
  const [open, setOpen] = useState(() => i === 0 && !(typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches));
  const imageLeft = i % 2 === 0;
  return (
    <div ref={ref} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", position: "relative", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(28px)", transition: `all .6s ease ${i * 0.12}s`, marginBottom: "1.4rem" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.cyan},${C.green})`, zIndex: 2 }} />
      <div className="case-grid" style={{ display: "grid", gridTemplateColumns: imageLeft ? "minmax(0,1.05fr) minmax(0,1fr)" : "minmax(0,1fr) minmax(0,1.05fr)", alignItems: "stretch" }}>
        {/* Visual */}
        <div style={{ order: imageLeft ? 0 : 1, minHeight: isMobile ? 170 : 260, position: "relative", overflow: "hidden" }}>
          <CaseVisual cs={cs} />
        </div>

        {/* Story */}
        <div style={{ order: imageLeft ? 1 : 0, padding: isMobile ? "1.4rem 1.4rem" : "2rem 2.2rem", borderLeft: imageLeft ? `1px solid ${C.border}` : "none", borderRight: imageLeft ? "none" : `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.cyan, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".7rem" }}>Featured Case Study · {cs.category}</div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? "1.2rem" : "1.45rem", fontWeight: 800, color: C.textPrimary, margin: "0 0 .25rem", letterSpacing: "-.01em" }}>{cs.title}</h3>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: C.textMuted, marginBottom: "1.1rem" }}>{cs.client}</div>
          {(!isMobile || open) && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".92rem", color: C.textBody, lineHeight: 1.7, margin: "0 0 1.2rem" }}>{cs.context}</p>
          )}

          {cs.metrics && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", margin: "0 0 1.3rem" }}>
              {cs.metrics.map((m) => (
                <div key={m.l} style={{ flex: "1 1 0", minWidth: 92, background: `${C.cyan}08`, border: `1px solid ${C.border}`, borderRadius: 4, padding: ".7rem .8rem" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.25rem", color: C.cyan, lineHeight: 1, letterSpacing: "-.01em" }}>{m.v}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".58rem", color: C.textMuted, letterSpacing: ".08em", textTransform: "uppercase", marginTop: ".35rem", lineHeight: 1.3 }}>{m.l}</div>
                </div>
              ))}
            </div>
          )}

          {open && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "1.3rem" }}>
              <CaseRow label="My role" text={cs.role} />
              <CaseRow label="The challenge" text={cs.challenge} />
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".6rem", color: C.green, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".6rem" }}>What I did</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".55rem" }}>
                  {cs.did.map((d, k) => (
                    <li key={k} style={{ display: "flex", gap: ".6rem", alignItems: "flex-start" }}>
                      <span aria-hidden="true" style={{ color: C.cyan, flexShrink: 0, marginTop: 2 }}>▸</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".88rem", color: C.textBody, lineHeight: 1.6 }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ background: `${C.green}08`, borderLeft: `3px solid ${C.green}`, borderRadius: 2, padding: ".8rem 1rem" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".6rem", color: C.green, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".35rem" }}>Outcome</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".9rem", color: C.textBody, lineHeight: 1.6 }}>{cs.outcome}</div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginBottom: "1.1rem" }}>
            {cs.stack.map((s) => <Chip key={s} sm>{s}</Chip>)}
          </div>

          <div style={{ display: "flex", gap: "1.4rem", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase", padding: 0 }}>
              {open ? "Hide details ↑" : "Read case study ↓"}
            </button>
            {cs.url && (
              <a href={cs.url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.textMuted, textDecoration: "none", letterSpacing: ".08em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}`, paddingBottom: 1, transition: "all .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.green; e.currentTarget.style.borderColor = C.green; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
              >Live Site →</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PROJECTS ──────────────────────────────────────────────────────────── */
function Projects() {
  const [ref, v] = useInView();
  const [tab, setTab] = useState("featured");
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 3;

  const categories = ["All", "Website", "E-Commerce", "Real Estate", "Branding", "Media"];
  const freelance = PROJECTS.filter((p) => !p.featured && !p.cased);
  const featured = PROJECTS.filter((p) => p.featured);

  const filtered = tab === "featured"
    ? featured
    : cat === "All" ? freelance : freelance.filter((p) => p.category === cat);
  const shown = expanded ? filtered : filtered.slice(0, LIMIT);

  return (
    <section id="projects" ref={ref} style={sec}>
      <Label n="05" t="Projects" />
      <H2>Things I've <Ac>Delivered</Ac></H2>

      {/* Featured case studies */}
      <div style={{ marginTop: "3rem" }}>
        {CASE_STUDIES.map((cs, i) => <CaseStudy key={cs.title} cs={cs} i={i} />)}
      </div>

      {/* All work header + tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginTop: "3.5rem" }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.textPrimary, margin: 0 }}>More <Ac>Work</Ac></h3>
        <div style={{ display: "flex", gap: ".3rem" }}>
          {["featured", "freelance"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setCat("All"); setExpanded(false); }} aria-pressed={tab === t}
              style={{ padding: ".45rem 1.2rem", background: tab === t ? C.cyan : "transparent", border: `1px solid ${tab === t ? C.cyan : C.border}`, color: tab === t ? C.bg : C.textMuted, fontFamily: "'DM Mono',monospace", fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "all .2s", fontWeight: tab === t ? 700 : 400 }}>
              {t === "featured" ? "Company" : "Freelance"}
            </button>
          ))}
        </div>
      </div>

      {tab === "featured" && (
        <div style={{ marginTop: "1.3rem", padding: ".7rem 1.1rem", background: `${C.cyan}06`, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.cyan}`, borderRadius: 2 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.textBody }}>
            <span style={{ color: C.cyan }}>note: </span>
            Client names withheld for confidentiality. Work delivered during employment at Ringana, the eksperts, StarLabs, and MakerMinds GmbH.
          </span>
        </div>
      )}
      {tab === "freelance" && (
        <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          {categories.map((c) => (
            <button key={c} onClick={() => { setCat(c); setExpanded(false); }} aria-pressed={cat === c}
              style={{ padding: ".32rem .85rem", background: cat === c ? `${C.cyan}22` : "transparent", border: `1px solid ${cat === c ? C.cyan : C.border}`, color: cat === c ? C.cyan : C.textMuted, fontFamily: "'DM Mono',monospace", fontSize: ".66rem", letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "all .2s" }}>
              {c}
            </button>
          ))}
        </div>
      )}
      {tab === "freelance" && (
        <div style={{ marginTop: "1rem", padding: ".7rem 1.1rem", background: `${C.green}06`, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 2 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.textBody }}>
            <span style={{ color: C.green }}>note: </span>
            Independent freelance work. Unaffiliated with any employer.
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "1.2rem", marginTop: "1.5rem" }}>
        {shown.map((p, i) => <PCard key={p.title} p={p} i={i} v={v} />)}
      </div>

      {filtered.length > LIMIT && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <button onClick={() => setExpanded((e) => !e)}
            style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".7rem 1.6rem", background: "transparent", border: `1px solid ${C.border}`, color: C.textBody, fontFamily: "'DM Mono',monospace", fontSize: ".7rem", letterSpacing: ".12em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textBody; }}>
            {expanded ? "Show less ↑" : `Show all ${filtered.length} ↓`}
          </button>
        </div>
      )}
    </section>
  );
}

/* Maps a stack token to its architecture layer, for the anonymized company diagrams. */
const STACK_LAYER = {
  "React.js": "ui", React: "ui", "Next.js": "ui", "Vue.js": "ui", Vue: "ui", Angular: "ui", "Tailwind CSS": "ui", Tailwind: "ui", Elementor: "ui",
  "Node.js": "api", Node: "api", "Nest.js": "api", "Express.js": "api", Express: "api", Laravel: "api", PHP: "api", Python: "api", APIs: "api",
  PostgreSQL: "data", MySQL: "data", MongoDB: "data", Prisma: "data", Redis: "data",
  Docker: "infra", Vercel: "infra", Stripe: "infra", Prismic: "infra", RBAC: "infra", WordPress: "infra", WooCommerce: "infra", TypeScript: "infra",
};

/* Abstract, NDA-safe architecture diagram built from a project's real stack. */
function ArchDiagram({ p }) {
  const W = 320, H = 168, nodeH = 21;
  const layerOf = (s) => STACK_LAYER[s] || "api";
  const ui = p.stack.filter((s) => layerOf(s) === "ui");
  const api = p.stack.filter((s) => layerOf(s) === "api");
  const data = p.stack.filter((s) => ["data", "infra"].includes(layerOf(s)));
  let bands = [
    { label: "Client", items: ui, color: C.cyan },
    { label: "Services", items: api, color: C.cyan },
    { label: "Data · Infra", items: data, color: C.green },
  ].filter((b) => b.items.length);
  if (!bands.length) bands = [{ label: "Stack", items: p.stack, color: C.cyan }];
  const n = bands.length;
  const topY = 32, botY = H - 28;
  const yAt = (i) => (n === 1 ? H / 2 : topY + (i * (botY - topY)) / (n - 1));
  const measure = (s) => Math.max(44, s.length * 6.2 + 16);
  const layout = bands.map((b, i) => {
    const ws = b.items.map(measure);
    const gx = 10;
    const total = ws.reduce((a, c) => a + c, 0) + gx * (b.items.length - 1);
    let x = (W - total) / 2;
    const nodes = b.items.map((s, j) => { const node = { s, x, w: ws[j], y: yAt(i) }; x += ws[j] + gx; return node; });
    return { ...b, y: yAt(i), nodes };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label={`${p.title} — architecture: ${bands.map((b) => `${b.label} (${b.items.join(", ")})`).join("; ")}`} style={{ display: "block" }}>
      <defs>
        <pattern id="archgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill={`${C.cyan}1a`} />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill="url(#archgrid)" />
      <line x1={W / 2} y1={layout[0].y} x2={W / 2} y2={layout[n - 1].y} stroke={`${C.cyan}22`} strokeWidth="1" />
      {layout.map((b, i) => (i < n - 1 ? b.nodes.map((nd, j) => (
        <line key={`c${i}-${j}`} x1={nd.x + nd.w / 2} y1={nd.y + nodeH / 2} x2={W / 2} y2={layout[i + 1].y - nodeH / 2} stroke={`${b.color}20`} strokeWidth="1" />
      )) : null))}
      {layout.map((b, i) => (
        <g key={`b${i}`}>
          <text x="12" y={b.y - nodeH / 2 - 5} fill={C.textDim} fontFamily="'DM Mono',monospace" fontSize="7" letterSpacing="1.5">{b.label.toUpperCase()}</text>
          {b.nodes.map((nd, j) => (
            <g key={`n${i}-${j}`}>
              <rect x={nd.x} y={nd.y - nodeH / 2} width={nd.w} height={nodeH} rx="3" fill={`${b.color}12`} stroke={`${b.color}55`} strokeWidth="1" />
              <text x={nd.x + nd.w / 2} y={nd.y + 3.5} textAnchor="middle" fill={C.textBody} fontFamily="'DM Mono',monospace" fontSize="9.5">{nd.s}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function PCard({ p, i, v }) {
  const [h, setH] = useState(false);
  const [imgOk, setImgOk] = useState(Boolean(p.img));
  const showImg = p.img && imgOk;
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(28px)", transition: `opacity .55s ease ${i * 0.07}s,transform .55s ease ${i * 0.07}s,background .22s,border-color .22s`, background: h ? C.bgHover : C.bgCard, border: `1px solid ${h ? C.cyan + "44" : C.border}`, borderRadius: 4, overflow: "hidden", position: "relative" }}>

      {/* Image / placeholder */}
      <div style={{ height: 168, background: `linear-gradient(135deg, ${C.cyan}0a, ${C.green}06)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}` }}>
        {showImg ? (
          <img src={p.img} alt={`${p.title} — screenshot`} loading="lazy" onError={() => setImgOk(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: h ? "scale(1.05)" : "scale(1)", transition: "transform .5s ease" }} />
        ) : p.featured ? (
          <ArchDiagram p={p} />
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.9rem", fontWeight: 800, WebkitTextStroke: `1px ${C.cyan}55`, color: "transparent", letterSpacing: "-.02em" }}>{p.title.slice(0, 2).toUpperCase()}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textDim, letterSpacing: ".15em", textTransform: "uppercase", marginTop: 4 }}>{p.category}</div>
          </div>
        )}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, height: 2, background: `linear-gradient(90deg,${C.cyan},${C.green})`, width: h ? "100%" : "30%", transition: "width .4s ease", zIndex: 2 }} />
      </div>

      <div style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.cyan, letterSpacing: ".15em", textTransform: "uppercase" }}>{p.category}</span>
          {!p.featured && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".6rem", color: C.green, border: `1px solid ${C.greenDim}`, padding: ".12rem .45rem", borderRadius: 2 }}>freelance</span>}
        </div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 .25rem" }}>{p.title}</h3>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".64rem", color: C.textMuted, marginBottom: ".8rem" }}>{p.client}</div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".86rem", color: C.textBody, lineHeight: 1.65, margin: "0 0 1.1rem" }}>{p.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginBottom: p.url ? "1rem" : 0 }}>
          {p.stack.map((s) => <Chip key={s} sm>{s}</Chip>)}
        </div>
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.cyan, textDecoration: "none", letterSpacing: ".08em", textTransform: "uppercase", borderBottom: `1px solid ${C.cyan}33`, paddingBottom: 1, transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.green; e.currentTarget.style.borderColor = C.green; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.cyan; e.currentTarget.style.borderColor = `${C.cyan}33`; }}
          >Live Site →</a>
        )}
      </div>
    </div>
  );
}

/* ─── TESTIMONIALS ──────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "G.H.",
    role: "Junior Web Developer · MakerMinds Graduate",
    text: "Dua të shpreh një falënderim të ngrohtë për kohën dhe përkushtimin gjatë trajnimit tim. Përvojën e konsideroj jashtëzakonisht të vlefshme. Ndihma dhe mbështetja gjatë kësaj periudhe ka qenë e jashtëzakonshme. Me bindje, do t'i rekomandoja këto trajnime të gjithë atyre që duan të fillojnë karrierë në web development.",
    en: "I want to express warm thanks for the time and dedication during my training. I consider the experience extremely valuable, and the help and support throughout was exceptional. I'd confidently recommend this training to anyone who wants to start a career in web development.",
    stars: 5,
    source: "MakerMinds · March 2024",
  },
  {
    name: "G.U.",
    role: "Web Developer · MakerMinds Graduate",
    text: "Trajnerja Edita Latifi nuk ka hezituar të ndajë njohuritë dhe eksperiencën e saj, duke ofruar këshilla të vlefshme gjatë çdo faze të trajnimit. Përvoja ka përmirësuar jo vetëm njohuritë e mia teknike, por edhe aftësitë në menaxhimin e projekteve dhe bashkëpunimin në ekip.",
    en: "Trainer Edita Latifi never hesitated to share her knowledge and experience, offering valuable advice at every stage of the training. It improved not only my technical knowledge but also my project-management and teamwork skills.",
    stars: 5,
    source: "MakerMinds · January 2024",
  },
  {
    name: "S.H.",
    role: "Engineer · Ringana, Austria",
    text: "You are the best literally! It's the fastest delivery I ever did I think haha, thank you so much!",
    en: null,
    stars: 5,
    source: "Microsoft Teams · Ringana · April 2026",
  },
];

function Testimonials() {
  const [ref, v] = useInView();
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];
  const touchX = useRef(null);
  const go = (dir) => setActive((a) => (a + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <section id="testimonials" ref={ref} style={sec}>
      <Label n="06" t="Testimonials" />
      <H2>What People <Ac>Say</Ac></H2>

      <div
        className="testimonial-grid"
        style={{
          marginTop: "3.5rem",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) min(340px,100%)",
          gap: "2rem",
          alignItems: "start",
          maxWidth: 1100,
          opacity: v ? 1 : 0,
          transform: v ? "none" : "translateY(28px)",
          transition: "all .7s ease",
        }}
      >
        <div>
          <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "clamp(1.4rem,5vw,2.5rem)", position: "relative", overflow: "hidden", boxShadow: `0 0 40px ${C.cyan}08`, touchAction: "pan-y" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.cyan},${C.green})` }} />
            <div aria-hidden="true" style={{ fontFamily: "'Syne',sans-serif", fontSize: "5rem", lineHeight: 0.8, color: `${C.cyan}25`, fontWeight: 800, marginBottom: "1rem", userSelect: "none" }}>&ldquo;</div>
            <div style={{ display: "flex", gap: 4, marginBottom: "1.2rem" }} aria-label={`${t.stars} out of 5 stars`}>
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} aria-hidden="true" style={{ color: "#ffd700", fontSize: "1rem" }}>★</span>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".95rem", color: C.textBody, lineHeight: 1.8, margin: t.en ? "0 0 .8rem" : "0 0 2rem", fontStyle: "italic" }}>
              &ldquo;{t.text}&rdquo;
            </p>
            {t.en && (
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".84rem", color: C.textMuted, lineHeight: 1.7, margin: "0 0 2rem" }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".6rem", color: C.cyan, letterSpacing: ".14em", textTransform: "uppercase", marginRight: ".5rem" }}>EN</span>
                {t.en}
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan}33,${C.green}22)`, border: `2px solid ${C.cyan}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: ".9rem", color: C.cyan }}>{t.name[0]}</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: C.textPrimary }}>{t.name}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, marginTop: 2 }}>{t.role}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".6rem", color: C.textDim, marginTop: 2 }}>{t.source}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: ".8rem", marginTop: "1.5rem", alignItems: "center" }}>
            <button onClick={() => go(-1)} aria-label="Previous testimonial"
              style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.border}`, background: "transparent", color: C.cyan, fontSize: "1.1rem", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}>‹</button>
            <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Show testimonial ${i + 1}`} style={{ width: active === i ? 24 : 8, height: 8, borderRadius: 4, border: "none", background: active === i ? C.cyan : C.border, cursor: "pointer", transition: "all .3s", padding: 0 }} />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Next testimonial"
              style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.border}`, background: "transparent", color: C.cyan, fontSize: "1.1rem", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}>›</button>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".58rem", color: C.textDim, letterSpacing: ".12em", textTransform: "uppercase", marginLeft: ".2rem" }}>swipe</span>
          </div>
        </div>

        {/* Trainer proof */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.green},${C.cyan})` }} />
          <div style={{ background: `linear-gradient(135deg,${C.green}12,${C.cyan}08)`, height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.8rem", padding: "1.5rem" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2.5rem", WebkitTextStroke: `1px ${C.green}55`, color: "transparent", letterSpacing: "-.02em", textAlign: "center" }}>80+</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.green, letterSpacing: ".15em", textTransform: "uppercase", textAlign: "center" }}>Students Trained</div>
          </div>
          <div style={{ padding: "1.2rem" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.green, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: ".4rem" }}>Live Training Session</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".9rem", color: C.textPrimary, marginBottom: ".3rem" }}>Edita Latifi · Trainer MMKS Web</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", color: C.textMuted }}>CSS, HTML &amp; JavaScript at MakerMinds, Kosovo.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── COMMAND PALETTE (⌘K) ──────────────────────────────────────────────── */
function CommandPalette({ open, setOpen }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  const items = COMMANDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  const run = (item) => { setOpen(false); item.action(); };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (items[sel]) run(items[sel]); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
  };

  if (!open) return null;
  return (
    <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(3,7,18,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette" style={{ width: "min(560px,92vw)", background: C.bgCard, border: `1px solid ${C.borderHi}`, borderRadius: 6, overflow: "hidden", boxShadow: `0 0 80px ${C.cyan}22`, fontFamily: "'DM Mono',monospace" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".7rem", padding: "1rem 1.2rem", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ color: C.cyan }}>$</span>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="type a command…" aria-label="Command search"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.textPrimary, fontFamily: "'DM Mono',monospace", fontSize: ".9rem", letterSpacing: ".04em" }} />
          <span style={{ fontSize: ".6rem", color: C.textDim, border: `1px solid ${C.border}`, padding: ".15rem .4rem", borderRadius: 3 }}>ESC</span>
        </div>
        <div style={{ maxHeight: 320, overflowY: "auto", padding: ".5rem" }}>
          {items.length === 0 && <div style={{ padding: "1rem 1.2rem", color: C.textMuted, fontSize: ".8rem" }}>no matches</div>}
          {items.map((c, i) => (
            <button key={c.id} onClick={() => run(c)} onMouseEnter={() => setSel(i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: ".7rem .9rem", background: sel === i ? C.cyanGlow : "transparent", border: "none", borderLeft: `2px solid ${sel === i ? C.cyan : "transparent"}`, color: sel === i ? C.textPrimary : C.textBody, cursor: "pointer", textAlign: "left", borderRadius: 2, transition: "all .12s" }}>
              <span style={{ fontSize: ".82rem" }}>{c.label}</span>
              <span style={{ fontSize: ".58rem", color: c.hint === "download" ? C.green : C.textMuted, letterSpacing: ".12em", textTransform: "uppercase" }}>{c.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CONTACT ───────────────────────────────────────────────────────────── */
const CONTACT_LINKS = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "Phone", value: PHONE, href: "tel:+38349178050" },
  { label: "LinkedIn", value: "linkedin.com/in/edita-latifi", href: LINKEDIN },
  { label: "GitHub", value: "github.com/EditaLatifi", href: GITHUB },
  { label: "Book a call", value: "30-min intro · Calendly", href: CALENDLY },
];

function Contact() {
  const [ref, v] = useInView();
  return (
    <section id="contact" ref={ref} style={{ ...sec, paddingBottom: "8rem" }}>
      <Label n="09" t="Contact" />
      <H2>Let's <Ac>Build Something</Ac></H2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", color: C.textBody, lineHeight: 1.7, maxWidth: 580, margin: "1.4rem 0 2.4rem" }}>
        I partner with teams who care about doing it properly, and I'm selective about where I put my energy.
        If you're building something that deserves to be owned end to end, tell me about it.
        <br />
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".8rem", color: C.textMuted }}>Based in Pristina, Kosovo · Working with teams worldwide</span>
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(18px)", transition: "all .6s ease" }}>
        <button onClick={downloadCV}
          style={{ display: "inline-flex", alignItems: "center", gap: ".6rem", padding: ".95rem 2rem", background: C.cyan, color: "#030712", border: "none", fontFamily: "'DM Mono',monospace", fontSize: ".8rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, borderRadius: 2, cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f6ff")}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.cyan)}
        >↓ Download CV</button>
        <a href={`mailto:${EMAIL}`}
          style={{ display: "inline-flex", alignItems: "center", gap: ".6rem", padding: ".95rem 2rem", border: `1px solid ${C.border}`, color: C.textBody, background: "transparent", fontFamily: "'DM Mono',monospace", fontSize: ".8rem", letterSpacing: ".12em", textTransform: "uppercase", borderRadius: 2, textDecoration: "none", transition: "all .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textBody; }}
        >✉ Email Me</a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.2rem" }}>
        {CONTACT_LINKS.map((l, i) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            style={{
              display: "block", textDecoration: "none", background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: 4, padding: "1.6rem", position: "relative", overflow: "hidden",
              opacity: v ? 1 : 0, transform: v ? "none" : "translateY(22px)",
              transition: `opacity .5s ease ${i * 0.1}s,transform .5s ease ${i * 0.1}s,border-color .2s`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${C.cyan}66`)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${i % 2 === 0 ? C.cyan : C.green},transparent)` }} />
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: ".6rem" }}>{l.label}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: C.textPrimary, wordBreak: "break-word" }}>{l.value}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.cyan, marginTop: ".8rem", letterSpacing: ".08em" }}>Open →</div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "2.4rem clamp(1.5rem,6vw,6rem)", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", color: C.textPrimary }}>EDITA LATIFI<span style={{ color: C.cyan }}>.</span></div>
        <a href={`mailto:${EMAIL}`} style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: C.textMuted, letterSpacing: ".04em", textDecoration: "none", transition: "color .2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
        >{EMAIL}</a>
        <div style={{ display: "flex", gap: "1rem", marginTop: ".6rem" }}>
          {[{ l: "GitHub", h: GITHUB }, { l: "LinkedIn", h: LINKEDIN }, { l: "Source ↗", h: GITHUB_REPO }, { l: "Book a call", h: CALENDLY }].map((s) => (
            <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'DM Mono',monospace", fontSize: ".64rem", color: C.textMuted, letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>{s.l}</a>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: C.textMuted, letterSpacing: ".06em" }}>
          Full Stack Engineer · Full Stack Entwicklerin · Développeuse Full Stack
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textDim, letterSpacing: ".06em", marginTop: 4 }}>
          Tech Team Lead · Frontend &amp; Backend · React · Node · TypeScript · © 2026 Edita Latifi
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ROOT ──────────────────────────────────────────────────────────── */
export default function App() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(() => {
    try { return localStorage.getItem("el_intro_seen") === "1"; } catch { return false; }
  });
  const [explode, setExplode] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = ready ? "auto" : "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [ready]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleComplete = () => {
    try { localStorage.setItem("el_intro_seen", "1"); } catch { /* ignore */ }
    setReady(true);
    if (!reduced) setExplode(true);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.textPrimary, position: "relative", overflowX: "hidden" }}>
      <ParticleCanvas explode={explode} onExplodeDone={() => setExplode(false)} reduced={reduced} />

      {!ready && <Terminal onComplete={handleComplete} />}

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />

      <header><Nav onOpenPalette={() => setPaletteOpen(true)} /></header>
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero ready={ready} />
        <About />
        <Stats />
        <Now />
        <Services />
        <Stack />
        <Experience />
        <Teaching />
        <Projects />
        <Testimonials />
        <Writing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
