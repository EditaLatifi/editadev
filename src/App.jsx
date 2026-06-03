import { useState, useEffect, useRef } from "react";

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
  { company: "the eksperts", role: "Full Stack Engineer & Tech Team Lead", period: "Mar 2023 – Sep 2025", location: "Switzerland · Remote", color: C.green, points: ["Led technical team 2+ years while staying fully hands-on", "Architected REST APIs powering high-traffic client platforms", "Ran sprint planning, backlog, daily standups", "Established code reviews — cut production incidents significantly"] },
  { company: "StarLabs", role: "Full Stack Engineer", period: "2021 – 2023", location: "Kosovo", color: C.cyan, points: ["Built high-performance apps for multiple clients concurrently", "Introduced code reviews — reduced bugs significantly", "WCAG accessibility compliance across all products", "Daily Agile standups, Git workflows, designer & QA collaboration"] },
  { company: "MakerMinds GmbH", role: "Full Stack Engineer & Project Leader", period: "2019 – 2021", location: "Germany · Remote", color: C.green, points: ["Delivered 7 full-stack applications from scratch", "Trained 80+ students in Full Stack Web Development — HTML, CSS, JS, Node.js, React, APIs, databases", "Mentored interns through live projects — several progressed into junior engineer roles", "Set technical direction, worked directly with stakeholders on delivery"] },
  { company: "SignSoft", role: "Full Stack Engineer & Project Manager", period: "2018 – 2019", location: "Germany & Kosovo", color: C.cyan, points: ["Built production apps: React, Vue, Angular, Node, Laravel", "Increased user engagement by 60%", "EEA-compliant websites — EU data protection standards", "API testing with Postman, direct client communication"] },
];

/* Featured case studies — the "how I work" proof. */
const CASE_STUDIES = [
  {
    title: "IP3 — Custom CRM",
    client: "Client project · German-speaking market",
    category: "SaaS · CRM",
    img: "/shots/ip3-crm.jpg",
    url: "https://crm-frontend-xi-three.vercel.app/login",
    context:
      "A German-speaking business had outgrown its mix of spreadsheets and off-the-shelf tools. They wanted one CRM built around how they actually work, and they wanted to own it outright.",
    role: "Sole engineer. I scoped it, built it, and shipped it.",
    challenge:
      "One person covering the whole thing, from data model to UI, while keeping it simple enough to live in daily without a manual. And it all had to work in German.",
    did: [
      "Built the full stack: React on the front, a Nest.js API behind it, PostgreSQL underneath.",
      "Modelled the customer lifecycle, from first lead through the pipeline, so the team works in one place instead of five.",
      "Set up role-based access so each person sees only what their job needs, nothing more.",
      "Added a reporting dashboard and a secure password-recovery flow, with the whole interface in German.",
    ],
    outcome:
      "It's live, and the team uses it every day. They own the system now, instead of renting one that almost fits.",
    stack: ["React.js", "Nest.js", "PostgreSQL", "RBAC"],
  },
  {
    title: "Loyalito — Loyalty & Rewards SaaS",
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
      "It's a dark-themed production app, live and in use, with each business running its own programme on it.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Google OAuth"],
  },
  {
    title: "AI Features & n8n Automation",
    client: "How I work · across projects",
    category: "AI · Automation",
    img: null,
    visual: "ai",
    context:
      "Across the products I work on, two things keep paying off: building AI into the product where it earns its place, and automating the dull machinery around delivery.",
    role: "The engineer who treats AI as a tool, not a sales pitch.",
    challenge:
      "Using AI where it genuinely speeds things up without letting quality slip, and automating the right steps rather than every step.",
    did: [
      "Wire up n8n automations that connect tools, sync data between them, and trigger actions on their own.",
      "Automate the repetitive parts of delivery: content, data handling, routine checks.",
      "Build AI features into products where they actually help the people using them.",
      "Reach for AI deliberately to move faster and hold the quality bar.",
    ],
    outcome:
      "Less time lost to busywork, and AI used as a working part of the toolkit rather than a gimmick bolted on top.",
    stack: ["AI / LLMs", "n8n", "Automation", "APIs"],
  },
  {
    title: "Leading & Collaborating Across Teams",
    client: "How I work · every project",
    category: "Leadership · Collaboration",
    img: null,
    visual: "collab",
    context:
      "I don't work in a corner. Every project runs through designers, product owners, QA and stakeholders, and the work is better for it.",
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
];

const PROJECTS = [
  // ── Featured (company work) ──────────────────────────────────────────────
  { title: "Enterprise E-Commerce Platform", client: "Confidential · Swiss Client", desc: "Large-scale e-commerce platform — custom CMS, product management, inventory, payment integration, and performance optimisation. Built to handle high traffic and scale.", stack: ["Next.js", "Node.js", "PostgreSQL", "Prismic"], featured: true, category: "E-Commerce", url: null, img: null },
  { title: "Hospital Management System", client: "Confidential · Enterprise", desc: "Full-stack healthcare platform — patient management, appointment scheduling, medical records, and role-based access for clinical staff. Built to strict data privacy standards.", stack: ["Vue.js", "Nest.js", "PostgreSQL", "Docker"], featured: true, category: "Healthcare", url: null, img: null },
  { title: "Translations Management Platform", client: "Confidential · Enterprise", desc: "End-to-end translations workflow SaaS — project management, translator assignments, review pipeline, and client delivery portal. Multi-language, multi-tenant.", stack: ["React.js", "Node.js", "PostgreSQL"], featured: true, category: "SaaS", url: null, img: null },
  { title: "Gaming Platform", client: "Confidential · Enterprise", desc: "High-performance gaming web platform — real-time features, user management, leaderboards, and optimised API architecture built for concurrent load.", stack: ["Next.js", "Nest.js", "PostgreSQL", "Redis"], featured: true, category: "Gaming", url: null, img: null },
  { title: "Hospitality Management Platform", client: "Confidential · Swiss Client", desc: "Full hospitality SaaS for Swiss market — end-to-end booking engine, room & property management, payment processing, guest portal, and staff workflow. Integrated with third-party payment providers and channel management.", stack: ["Next.js", "Nest.js", "PostgreSQL", "Docker", "Stripe"], featured: true, category: "Hospitality", url: null, img: null },
  { title: "Architecture CRM", client: "Confidential · Swiss Client", desc: "Custom CRM built for architecture firms — project lifecycle management, client portal, tender tracking, document & drawing management, team collaboration, and billing integration.", stack: ["Vue.js", "Node.js", "PostgreSQL", "Docker"], featured: true, category: "CRM", url: null, img: null },
  { title: "Legacy Stack Migration", client: "Confidential · Enterprise", desc: "Full modernisation of a large-scale legacy application — audited outdated codebase, planned and executed phased migration to modern stack, zero downtime delivery. Improved performance, maintainability, and developer experience significantly.", stack: ["Next.js", "TypeScript", "Node.js", "Docker", "PostgreSQL"], featured: true, category: "Migration", url: null, img: null },
  { title: "CRM Replacement & Data Migration", client: "Confidential · Enterprise", desc: "Replaced an existing third-party CRM with a fully custom-built solution — migrated all client data, rebuilt workflows, and delivered a seamless cutover with no data loss. Team trained and handed over on schedule.", stack: ["React.js", "Nest.js", "PostgreSQL", "Docker"], featured: true, category: "Migration", url: null, img: null },
  { title: "SaaS Analytics Dashboard", client: "Austrian Tech Company", desc: "Real-time analytics dashboard with role-based access, data visualisation, and optimised REST API architecture.", stack: ["Vue.js", "Nest.js", "PostgreSQL", "Docker"], featured: true, category: "SaaS", url: null, img: null },
  { title: "B2B Client Portal", client: "Swiss B2B Client", desc: "Secure portal with document management, custom approval workflows, and multi-tenant architecture.", stack: ["React.js", "Express.js", "PostgreSQL"], featured: true, category: "Web App", url: null, img: null },
  // ── Freelance / independent (live, with screenshots) ──────────────────────
  { title: "Erblin3 — Fashion E-Commerce", client: "Personal · Client Project", desc: "Full WooCommerce fashion e-commerce for luxury clothing brand — 15+ collections (Bridal, VIVIDÉRA, DOMINA, Perla di Fuoco…), worldwide free shipping, product catalogue, cart, account system, and video-led homepage. Live and selling.", stack: ["WordPress", "WooCommerce", "PHP", "Elementor"], featured: false, category: "E-Commerce", url: "https://erblin3.com", img: "/shots/erblin3.jpg" },
  { title: "MrBurger — QR Code Menu", client: "Personal · Client Project", desc: "Digital QR scan menu for Prague restaurant MrBurger Holešovice — part of the B&C restaurant ecosystem. Multilingual (CS/EN), full menu with allergen labelling, food photography, and mobile-first design. Scanned daily by guests.", stack: ["Next.js", "Tailwind CSS", "Vercel"], featured: false, category: "Website", url: "https://mrburgermenu.vercel.app", img: "/shots/mrburger.jpg" },
  { title: "Loyalito Platform", client: "Personal · Client Project", desc: "Business loyalty & rewards SaaS — secure business dashboard, client sign-in, points engine, and multi-tenant architecture. Dark-themed production app, live and in active use.", stack: ["Next.js", "Node.js", "PostgreSQL"], featured: false, cased: true, category: "SaaS", url: "https://layoutynextjs.vercel.app", img: "/shots/loyalito.jpg" },
  { title: "Gazeta Demos", client: "Personal · Client Project", desc: "Albanian-language news portal — full editorial CMS with breaking news, categories, live search, and ad integration. Live platform serving Kosovo readership daily.", stack: ["WordPress", "PHP", "MySQL"], featured: false, category: "Media", url: "https://gazetademos.com", img: "/shots/gazeta-demos.jpg" },
  { title: "Virton Invest — River Residence", client: "Personal · Client Project", desc: "Real estate investment platform showcasing luxury riverside development — listings, investment calculator, inquiry system.", stack: ["Next.js", "Node.js", "PostgreSQL"], featured: false, category: "Real Estate", url: null, img: null },
  { title: "IP3 CRM System", client: "Personal · Client Project", desc: "Full custom CRM built for German-speaking market — customer lifecycle management, pipeline tracking, reporting dashboard, role-based access control, and password recovery flow. Live and in active use.", stack: ["React.js", "Nest.js", "PostgreSQL"], featured: false, cased: true, category: "SaaS", url: "https://crm-frontend-xi-three.vercel.app/login", img: "/shots/ip3-crm.jpg" },
  { title: "B&C — Be Brave and Creative", client: "Personal · Client Project", desc: "Brand website for Prague F&B company behind MrBurger and Pizzaiolo — company identity, concept presentation for both restaurant brands, and contact. Part of a 3-site delivery for one client.", stack: ["Next.js", "Tailwind CSS"], featured: false, category: "Branding", url: "https://www.by-bc.com", img: "/shots/bc.jpg" },
  { title: "Muha Investments", client: "Personal · Client Project", desc: "Business website for transport & property development company in Blantyre, Malawi — passenger transport, goods logistics, and property development. Live in Africa.", stack: ["Next.js", "Tailwind CSS", "Node.js"], featured: false, category: "Website", url: "https://www.muha-investments.com", img: "/shots/muha.jpg" },
  { title: "Idon Inžinering", client: "Personal · Client Project", desc: "Slovenian engineering & construction company website — 20+ years experience, service pages, project gallery, and lead generation. Built in Slovenian.", stack: ["WordPress", "PHP", "Elementor"], featured: false, category: "Website", url: "https://idon.si", img: "/shots/idon.jpg" },
  { title: "Dizajn Group", client: "Personal · Client Project", desc: "Product showcase website for Kosovo doors & kitchens company — wholesale & retail since 2015, 75+ sales points across Kosovo, product catalogue with PDF download, inspiration gallery, and dealer contact.", stack: ["WordPress", "Elementor", "PHP"], featured: false, category: "Website", url: "https://dizajn-group.com", img: "/shots/dizajn-group.jpg" },
  { title: "Pizzaiolo — Restaurant Website", client: "Personal · Client Project", desc: "Full restaurant website for Italian pizzeria in Prague Žižkov — multilingual (CZ/EN), online menu with ordering integration (Bolt Food & Wolt), blog, lunch menu, and SEO optimisation. 500+ reviews, live and in active use.", stack: ["Next.js", "Vercel", "Tailwind CSS"], featured: false, category: "Website", url: "https://pizzaiolo-sigma.vercel.app", img: "/shots/pizzaiolo.jpg" },
  { title: "Orama Transport", client: "Personal · Client Project", desc: "Full business website for Cape Town's premier transport company — bus services, same-day courier, car hire, and accommodation under one platform. Quote system, multi-service pages, 24/7 support, 5,000+ clients. Live in South Africa.", stack: ["Next.js", "Tailwind CSS", "Node.js"], featured: false, category: "Website", url: "https://oramatransport.com", img: "/shots/orama.jpg" },
];

/* ─── ABOUT / LANGUAGES ─────────────────────────────────────────────────── */
const ABOUT_PARAS = [
  "I'm Edita. A full-stack engineer and tech lead based in Pristina, Kosovo, working with teams across Austria, Switzerland, and Germany.",
  "I work closely with designers, product owners, QA and stakeholders. I run code reviews and mentor the developers around me. Most of it happens remotely, but I get on a plane when it helps. Workshops, planning, delivery, on-site with the team.",
  "Mostly, I just work hard and honestly. I take a project from the first line of code to the day it goes live, and I own it the whole way. I care where I put that work, so I'm picky about the teams I say yes to.",
];

const BRINGS = [
  "End-to-end feature ownership",
  "Technical leadership & mentoring",
  "Cross-functional collaboration",
  "Legacy migration & modernisation",
  "On-site workshops & delivery",
  "Full-stack architecture & APIs",
];

const WORKS_ACROSS = ["Austria", "Switzerland", "Germany", "Kosovo"];

const LANGUAGES = [
  { name: "Albanian", level: "Native" },
  { name: "English", level: "Full Professional" },
];

/* ─── CONTACT / IDENTITY CONSTANTS ──────────────────────────────────────── */
const CV_URL = "/Edita-Latifi-CV.pdf";
const EMAIL = "editalatifi1996@gmail.com";
const PHONE = "+383 49 178 050";
const LINKEDIN = "https://www.linkedin.com/in/edita-latifi";

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
  { n: 20, suffix: "+", label: "Apps Shipped" },
  { n: 4, suffix: "", label: "Countries" },
  { n: 80, suffix: "+", label: "Developers Trained" },
];

const COMMANDS = [
  { id: "about", label: "Go to About", hint: "section", action: () => scrollToId("about") },
  { id: "stack", label: "Go to Tech Stack", hint: "section", action: () => scrollToId("stack") },
  { id: "experience", label: "Go to Experience", hint: "section", action: () => scrollToId("experience") },
  { id: "projects", label: "Go to Projects", hint: "section", action: () => scrollToId("projects") },
  { id: "contact", label: "Go to Contact", hint: "section", action: () => scrollToId("contact") },
  { id: "cv", label: "Download CV (PDF)", hint: "download", action: downloadCV },
  { id: "email", label: "Email Edita", hint: "link", action: () => { window.location.href = `mailto:${EMAIL}`; } },
  { id: "linkedin", label: "Open LinkedIn", hint: "link", action: () => window.open(LINKEDIN, "_blank") },
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
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
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
          {["About", "Stack", "Experience", "Projects", "Contact"].map((s) => (
            <button key={s} onClick={() => scrollToId(s.toLowerCase())}
              style={{ color: C.textMuted, background: "none", border: "none", fontFamily: "'DM Mono',monospace", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", transition: "color .2s", cursor: "pointer" }}
              onMouseEnter={(e) => (e.target.style.color = C.cyan)}
              onMouseLeave={(e) => (e.target.style.color = C.textMuted)}
            >{s}</button>
          ))}
        </div>
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
          Full Stack Engineer &amp; Tech Lead
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "clamp(.72rem,1.3vw,.88rem)", color: C.textMuted, letterSpacing: ".06em" }}>
          6+ years &nbsp;·&nbsp; Austria · Switzerland · Germany · Kosovo
        </div>
      </div>

      {/* Statement */}
      <p style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: "all .8s ease .45s", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.1rem,2.5vw,1.55rem)", color: C.textPrimary, letterSpacing: "-.01em", margin: "0 0 3rem", lineHeight: 1.4 }}>
        I build it. I lead it. I ship it.<br />
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

          <div className="edu-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.6rem", borderTop: `1px solid ${C.border}`, paddingTop: "1.6rem" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textMuted, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".9rem" }}>Works with teams across</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
                {WORKS_ACROSS.map((w) => <Chip key={w} sm>{w}</Chip>)}
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textDim, marginTop: ".9rem", letterSpacing: ".04em" }}>Remote-first · on-site when it matters</div>
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
  return (
    <section id="stack" ref={ref} style={sec}>
      <Label n="02" t="Tech Stack" />
      <H2>What I <Ac>Build With</Ac></H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.2rem", marginTop: "3.5rem" }}>
        {Object.entries(SKILLS).map(([cat, items], ci) => (
          <div key={cat} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `opacity .55s ease ${ci * 0.1}s,transform .55s ease ${ci * 0.1}s`, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "1.7rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ci % 2 === 0 ? C.cyan : C.green},transparent)` }} />
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: ci % 2 === 0 ? C.cyan : C.green, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>{cat}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
              {items.map((s) => <Chip key={s}>{s}</Chip>)}
            </div>
          </div>
        ))}
      </div>
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
      <Label n="03" t="Experience" />
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

/* ─── CASE STUDIES ──────────────────────────────────────────────────────── */
const visualWrap = {
  position: "relative", height: "100%", minHeight: 260, display: "flex",
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
  const steps = [{ t: "Trigger", a: C.border }, { t: "AI", a: C.cyan }, { t: "n8n", a: C.green }, { t: "Ship", a: C.cyan }];
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
      <div style={{ ...nodeStyle(C.green), fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: 0, color: C.green }}>Shipped — together</div>
    </div>
  );
}

function CaseVisual({ cs }) {
  if (cs.img) {
    return <img src={cs.img} alt={`${cs.title} — screenshot`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />;
  }
  if (cs.visual === "ai") return <AIVisual />;
  if (cs.visual === "collab") return <CollabVisual />;
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
  const [open, setOpen] = useState(i === 0);
  const imageLeft = i % 2 === 0;
  return (
    <div ref={ref} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", position: "relative", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(28px)", transition: `all .6s ease ${i * 0.12}s`, marginBottom: "1.4rem" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.cyan},${C.green})`, zIndex: 2 }} />
      <div className="case-grid" style={{ display: "grid", gridTemplateColumns: imageLeft ? "minmax(0,1.05fr) minmax(0,1fr)" : "minmax(0,1fr) minmax(0,1.05fr)", alignItems: "stretch" }}>
        {/* Visual */}
        <div style={{ order: imageLeft ? 0 : 1, minHeight: 260, position: "relative", overflow: "hidden" }}>
          <CaseVisual cs={cs} />
        </div>

        {/* Story */}
        <div style={{ order: imageLeft ? 1 : 0, padding: "2rem 2.2rem", borderLeft: imageLeft ? `1px solid ${C.border}` : "none", borderRight: imageLeft ? "none" : `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.cyan, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: ".7rem" }}>Featured Case Study · {cs.category}</div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.45rem", fontWeight: 800, color: C.textPrimary, margin: "0 0 .25rem", letterSpacing: "-.01em" }}>{cs.title}</h3>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: C.textMuted, marginBottom: "1.1rem" }}>{cs.client}</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".92rem", color: C.textBody, lineHeight: 1.7, margin: "0 0 1.2rem" }}>{cs.context}</p>

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

  const categories = ["All", "Website", "E-Commerce", "Real Estate", "Branding", "Media"];
  const freelance = PROJECTS.filter((p) => !p.featured && !p.cased);
  const featured = PROJECTS.filter((p) => p.featured);

  const filtered = tab === "featured"
    ? featured
    : cat === "All" ? freelance : freelance.filter((p) => p.category === cat);

  return (
    <section id="projects" ref={ref} style={sec}>
      <Label n="04" t="Projects" />
      <H2>Things I've <Ac>Shipped</Ac></H2>

      {/* Featured case studies */}
      <div style={{ marginTop: "3rem" }}>
        {CASE_STUDIES.map((cs, i) => <CaseStudy key={cs.title} cs={cs} i={i} />)}
      </div>

      {/* All work header + tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginTop: "3.5rem" }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.textPrimary, margin: 0 }}>More <Ac>Work</Ac></h3>
        <div style={{ display: "flex", gap: ".3rem" }}>
          {["featured", "freelance"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setCat("All"); }} aria-pressed={tab === t}
              style={{ padding: ".45rem 1.2rem", background: tab === t ? C.cyan : "transparent", border: `1px solid ${tab === t ? C.cyan : C.border}`, color: tab === t ? C.bg : C.textMuted, fontFamily: "'DM Mono',monospace", fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "all .2s", fontWeight: tab === t ? 700 : 400 }}>
              {t === "featured" ? "Company" : "Freelance"}
            </button>
          ))}
        </div>
      </div>

      {tab === "featured" && (
        <div style={{ marginTop: "1.3rem", padding: ".7rem 1.1rem", background: `${C.cyan}06`, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.cyan}`, borderRadius: 2 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.textBody }}>
            <span style={{ color: C.cyan }}>note — </span>
            Client names withheld for confidentiality. Work delivered during employment at Ringana, the eksperts, StarLabs, and MakerMinds GmbH.
          </span>
        </div>
      )}
      {tab === "freelance" && (
        <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              style={{ padding: ".32rem .85rem", background: cat === c ? `${C.cyan}22` : "transparent", border: `1px solid ${cat === c ? C.cyan : C.border}`, color: cat === c ? C.cyan : C.textMuted, fontFamily: "'DM Mono',monospace", fontSize: ".66rem", letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "all .2s" }}>
              {c}
            </button>
          ))}
        </div>
      )}
      {tab === "freelance" && (
        <div style={{ marginTop: "1rem", padding: ".7rem 1.1rem", background: `${C.green}06`, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 2 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: C.textBody }}>
            <span style={{ color: C.green }}>note — </span>
            Independent freelance work. Unaffiliated with any employer.
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "1.2rem", marginTop: "1.5rem" }}>
        {filtered.map((p, i) => <PCard key={p.title} p={p} i={i} v={v} />)}
      </div>
    </section>
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
    en: "I want to express warm thanks for the time and dedication during my training. I consider the experience extremely valuable — the help and support throughout was exceptional. I'd confidently recommend this training to anyone who wants to start a career in web development.",
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
    text: "You are the best literally! It's the fastest delivery I ever did I think haha — thank you so much!",
    en: null,
    stars: 5,
    source: "Microsoft Teams · Ringana · April 2026",
  },
];

function Testimonials() {
  const [ref, v] = useInView();
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <section id="testimonials" ref={ref} style={sec}>
      <Label n="05" t="Testimonials" />
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
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2.5rem", position: "relative", overflow: "hidden", boxShadow: `0 0 40px ${C.cyan}08` }}>
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

          <div style={{ display: "flex", gap: ".6rem", marginTop: "1.5rem", alignItems: "center" }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Show testimonial ${i + 1}`} style={{ width: active === i ? 24 : 8, height: 8, borderRadius: 4, border: "none", background: active === i ? C.cyan : C.border, cursor: "pointer", transition: "all .3s", padding: 0 }} />
            ))}
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
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", color: C.textMuted }}>CSS, HTML &amp; JavaScript — MakerMinds, Kosovo.</div>
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
];

function Contact() {
  const [ref, v] = useInView();
  return (
    <section id="contact" ref={ref} style={{ ...sec, paddingBottom: "8rem" }}>
      <Label n="06" t="Contact" />
      <H2>Let's <Ac>Build Something</Ac></H2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", color: C.textBody, lineHeight: 1.7, maxWidth: 580, margin: "1.4rem 0 2.4rem" }}>
        I partner with teams who care about doing it properly — and I'm selective about where I put my energy.
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
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: C.textMuted, letterSpacing: ".06em" }}>
          Full Stack Engineer · Full Stack Entwicklerin · Développeuse Full Stack
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", color: C.textDim, letterSpacing: ".06em", marginTop: 4 }}>
          Tech Lead · Frontend &amp; Backend · React · Node · TypeScript · © 2026 Edita Latifi
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
        <Stack />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
