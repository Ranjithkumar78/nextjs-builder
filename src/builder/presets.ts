import type { StyleMap, TBNode } from "./types";
import { createNode as c, placeholderImage } from "./registry";

export interface BlockPreset {
  id: string;
  label: string;
  icon: string;
  build: () => TBNode;
}

const section = (children: TBNode[], styles: StyleMap = {}, name?: string, mobile?: StyleMap) =>
  c("section", {}, styles, children, { name, mobile });
const container = (children: TBNode[], styles: StyleMap = {}) => c("container", {}, styles, children);
const centerHeader = (eyebrow: string, title: string, sub: string) => [
  c("badge", { text: eyebrow }, { alignSelf: "center" }),
  c("heading", { text: title, level: "h2" }, { fontSize: "40px", textAlign: "center" }, undefined, { mobile: { fontSize: "30px" } }),
  c("text", { text: sub }, { textAlign: "center", maxWidth: "620px", alignSelf: "center", marginBottom: "24px" }),
];
const grid = (cols: number, children: TBNode[], styles: StyleMap = {}) =>
  c("grid", {}, { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, ...styles }, children, {
    tablet: { gridTemplateColumns: `repeat(${Math.min(cols, 2)}, minmax(0, 1fr))` },
    mobile: { gridTemplateColumns: "minmax(0, 1fr)" },
  });

export function navbar(): TBNode {
  return c(
    "section",
    { tag: "header" },
    { padding: "18px 24px", backgroundColor: "var(--tb-background)", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--tb-border)", position: "sticky", top: "0", zIndex: "50" },
    [
      container(
        [
          c("logo", { text: "Brand" }),
          c("navmenu", {}, {}, undefined, { mobile: { gap: "16px", fontSize: "14px" } }),
          c("button", { text: "Get started", href: "/contact" }, { padding: "10px 20px", fontSize: "15px" }, undefined, { mobile: { display: "none" } }),
        ],
        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }
      ),
    ],
    { name: "Navbar" }
  );
}

export function heroCentered(): TBNode {
  return section(
    [
      container(
        [
          c("badge", { text: "✨ Introducing our new platform" }, { alignSelf: "center" }),
          c("heading", { text: "Build beautiful websites without writing code", level: "h1" }, { fontSize: "60px", textAlign: "center", letterSpacing: "-1.5px", maxWidth: "860px", alignSelf: "center" }, undefined, {
            tablet: { fontSize: "46px" },
            mobile: { fontSize: "34px", letterSpacing: "-0.5px" },
          }),
          c("text", { text: "Drag, drop and style every element. Create unlimited themes and pages, then export clean HTML in one click." }, { fontSize: "20px", textAlign: "center", maxWidth: "640px", alignSelf: "center" }, undefined, { mobile: { fontSize: "17px" } }),
          c(
            "row",
            {},
            { justifyContent: "center", gap: "12px", marginTop: "12px" },
            [
              c("button", { text: "Start for free", href: "/contact" }, { padding: "14px 28px", fontSize: "17px" }),
              c("button", { text: "See features", href: "#features" }, { padding: "14px 28px", fontSize: "17px", backgroundColor: "transparent", color: "var(--tb-text)", borderWidth: "1px", borderStyle: "solid", borderColor: "var(--tb-border)" }, undefined, {
                hover: { backgroundColor: "var(--tb-surface)", transform: "translateY(-1px)" },
              }),
            ]
          ),
        ],
        { alignItems: "stretch", gap: "20px" }
      ),
    ],
    { padding: "120px 24px", backgroundColor: "var(--tb-surface)" },
    "Hero",
    { padding: "72px 20px" }
  );
}

export function heroSplit(): TBNode {
  return section(
    [
      container([
        c("row", {}, { alignItems: "center", gap: "56px" }, [
          c("column", {}, { gap: "18px", minWidth: "300px" }, [
            c("badge", { text: "Fast • Flexible • Free" }),
            c("heading", { text: "Design pages your customers love", level: "h1" }, { fontSize: "52px", letterSpacing: "-1px" }, undefined, { mobile: { fontSize: "34px" } }),
            c("text", { text: "Every color, font and spacing value is yours to control. Start from a block or build from scratch." }, { fontSize: "19px" }),
            c("row", {}, { gap: "12px" }, [c("button", { text: "Get started" }), c("link", { text: "Watch demo →" }, { alignSelf: "center" })]),
          ]),
          c("column", {}, { minWidth: "300px" }, [c("image", { src: placeholderImage("Hero image", 900, 700), alt: "Hero" }, { aspectRatio: "9 / 7" })]),
        ]),
      ]),
    ],
    { padding: "96px 24px" },
    "Hero split",
    { padding: "64px 20px" }
  );
}

const feature = (title: string, body: string, emoji: string) =>
  c("box", {}, { gap: "10px", padding: "28px" }, [
    c("text", { text: emoji }, { fontSize: "28px", lineHeight: "1" }),
    c("heading", { text: title, level: "h3" }, { fontSize: "20px" }),
    c("text", { text: body }, { fontSize: "15px" }),
  ]);

export function features(): TBNode {
  return c(
    "section",
    { htmlId: "features" },
    { padding: "96px 24px" },
    [
      container([
        ...centerHeader("Features", "Everything you need to launch", "Powerful building blocks with full design control over every single element."),
        grid(3, [
          feature("Drag & drop", "Place any component anywhere on the page and rearrange in seconds.", "🧲"),
          feature("Total style control", "Colors, fonts, padding, borders, shadows and hover states.", "🎨"),
          feature("Responsive", "Override styles separately for tablet and mobile screens.", "📱"),
          feature("Multiple themes", "Keep several complete themes side by side and switch instantly.", "🗂️"),
          feature("Global header & footer", "Edit once and it updates on every page of the theme.", "🧭"),
          feature("Clean export", "Download static HTML for the whole site as a ZIP.", "📦"),
        ]),
      ]),
    ],
    { name: "Features", mobile: { padding: "64px 20px" } }
  );
}

export function stats(): TBNode {
  const stat = (n: string, l: string) =>
    c("column", {}, { alignItems: "center", gap: "4px", minWidth: "140px" }, [
      c("heading", { text: n, level: "h3" }, { fontSize: "44px", color: "var(--tb-primary)" }),
      c("text", { text: l }, { fontSize: "15px", textAlign: "center" }),
    ]);
  return section([container([c("row", {}, { justifyContent: "space-around", gap: "32px" }, [stat("10k+", "Happy customers"), stat("99.9%", "Uptime"), stat("150+", "Countries"), stat("24/7", "Support")])])], { padding: "64px 24px", backgroundColor: "var(--tb-surface)" }, "Stats");
}

export function testimonials(): TBNode {
  const t = (q: string, who: string) =>
    c("box", {}, { gap: "16px" }, [
      c("text", { text: "★★★★★" }, { color: "#f59e0b", fontSize: "18px", letterSpacing: "2px" }),
      c("text", { text: q }, { color: "var(--tb-text)", fontSize: "16px" }),
      c("text", { text: who }, { fontWeight: "600", fontSize: "14px" }),
    ]);
  return section(
    [
      container([
        ...centerHeader("Testimonials", "Loved by teams everywhere", "Here is what our customers say about building with us."),
        grid(3, [
          t("“We rebuilt our entire marketing site in a weekend. The style controls are incredible.”", "Priya S. — Founder, Studio Nine"),
          t("“Finally a builder that does not fight me. Every pixel is exactly where I want it.”", "Marcus L. — Designer"),
          t("“Multiple themes let us test new looks without touching the live site.”", "Ana R. — Marketing Lead"),
        ]),
      ]),
    ],
    { padding: "96px 24px" },
    "Testimonials",
    { padding: "64px 20px" }
  );
}

export function pricing(): TBNode {
  const plan = (name: string, price: string, items: string[], featured = false) =>
    c(
      "box",
      {},
      featured
        ? { gap: "16px", padding: "32px", borderColor: "var(--tb-primary)", borderWidth: "2px", boxShadow: "0 20px 40px -20px rgba(0,0,0,.25)" }
        : { gap: "16px", padding: "32px" },
      [
        c("heading", { text: name, level: "h3" }, { fontSize: "18px", color: "var(--tb-muted)" }),
        c("heading", { text: price, level: "p" }, { fontSize: "44px" }),
        c("list", { items }, { listStyleType: "none", paddingLeft: "0", gap: "10px" }),
        c("button", { text: featured ? "Start free trial" : "Choose plan" }, { alignSelf: "stretch", marginTop: "8px" }),
      ]
    );
  return section(
    [
      container([
        ...centerHeader("Pricing", "Simple, transparent pricing", "No hidden fees. Cancel anytime."),
        grid(3, [
          plan("Starter", "$0", ["✓ 1 theme", "✓ 5 pages", "✓ HTML export"]),
          plan("Pro", "$19", ["✓ Unlimited themes", "✓ Unlimited pages", "✓ Priority support"], true),
          plan("Team", "$49", ["✓ Everything in Pro", "✓ 10 seats", "✓ Shared themes"]),
        ], { alignItems: "start" }),
      ]),
    ],
    { padding: "96px 24px", backgroundColor: "var(--tb-surface)" },
    "Pricing",
    { padding: "64px 20px" }
  );
}

export function cta(): TBNode {
  return section(
    [
      container(
        [
          c("heading", { text: "Ready to build your next website?", level: "h2" }, { fontSize: "40px", textAlign: "center", color: "#ffffff" }, undefined, { mobile: { fontSize: "28px" } }),
          c("text", { text: "Join thousands of creators designing with complete freedom." }, { textAlign: "center", color: "rgba(255,255,255,.85)", fontSize: "18px" }),
          c("button", { text: "Get started now", href: "/contact" }, { alignSelf: "center", backgroundColor: "#ffffff", color: "var(--tb-primary)", padding: "14px 30px", marginTop: "8px" }, undefined, {
            hover: { backgroundColor: "#f1f5f9", transform: "translateY(-1px)" },
          }),
        ],
        { gap: "14px" }
      ),
    ],
    { padding: "88px 24px", backgroundImage: "linear-gradient(135deg, var(--tb-primary), var(--tb-secondary))" },
    "Call to action"
  );
}

export function faq(): TBNode {
  const q = (t: string, a: string) =>
    c("box", {}, { gap: "8px", padding: "20px 24px" }, [c("heading", { text: t, level: "h4" }, { fontSize: "18px" }), c("text", { text: a }, { fontSize: "15px" })]);
  return section(
    [
      container(
        [
          ...centerHeader("FAQ", "Frequently asked questions", "Can't find the answer you're looking for? Reach out to our team."),
          q("Is it really free?", "Yes. Everything runs in your browser and your themes are saved locally."),
          q("Can I export my site?", "Export a single page as HTML or the entire theme as a ZIP of static files."),
          q("Does it work on mobile?", "Every element can have separate tablet and mobile styles."),
        ],
        { maxWidth: "780px", gap: "12px" }
      ),
    ],
    { padding: "96px 24px" },
    "FAQ"
  );
}

export function team(): TBNode {
  const m = (name: string, role: string) =>
    c("column", {}, { gap: "6px", minWidth: "0" }, [
      c("image", { src: placeholderImage(name, 600, 600), alt: name }, { aspectRatio: "1 / 1", marginBottom: "8px" }),
      c("heading", { text: name, level: "h4" }, { fontSize: "18px" }),
      c("text", { text: role }, { fontSize: "14px" }),
    ]);
  return section([container([...centerHeader("Team", "Meet the people behind it", "A small team with big ideas."), grid(4, [m("Alex Kim", "CEO"), m("Sara Patel", "Design"), m("John Doe", "Engineering"), m("Mia Wong", "Marketing")])])], { padding: "96px 24px" }, "Team");
}

export function gallery(): TBNode {
  return section(
    [container([...centerHeader("Gallery", "Our recent work", "A few highlights from projects we are proud of."), grid(3, [1, 2, 3, 4, 5, 6].map((i) => c("image", { src: placeholderImage(`Project ${i}`, 800, 600), alt: `Project ${i}` }, { aspectRatio: "4 / 3" })), { gap: "16px" })])],
    { padding: "96px 24px" },
    "Gallery"
  );
}

export function contact(): TBNode {
  return section(
    [
      container([
        c("row", {}, { gap: "48px", alignItems: "flex-start" }, [
          c("column", {}, { gap: "14px", minWidth: "280px" }, [
            c("badge", { text: "Contact" }),
            c("heading", { text: "Let's talk", level: "h2" }, { fontSize: "40px" }),
            c("text", { text: "Have a project in mind? Fill out the form and we will get back to you within one business day." }),
            c("list", { items: ["📧 hello@example.com", "📞 +91 98765 43210", "📍 Chennai, India"] }, { listStyleType: "none", paddingLeft: "0", gap: "10px" }),
          ]),
          c("column", {}, { minWidth: "300px" }, [
            c("form", {}, { padding: "28px", backgroundColor: "var(--tb-surface)", borderRadius: "var(--tb-radius)", borderWidth: "1px", borderStyle: "solid", borderColor: "var(--tb-border)" }, [
              c("input", { label: "Name", name: "name", inputType: "text", placeholder: "Your name" }),
              c("input", { label: "Email", name: "email", inputType: "email", placeholder: "you@example.com" }),
              c("textarea", { label: "Message", name: "message" }),
              c("submit", { text: "Send message" }),
            ]),
          ]),
        ]),
      ]),
    ],
    { padding: "96px 24px" },
    "Contact",
    { padding: "64px 20px" }
  );
}

export function aboutContent(): TBNode {
  return section(
    [
      container([
        c("row", {}, { gap: "48px", alignItems: "center" }, [
          c("column", {}, { minWidth: "300px" }, [c("image", { src: placeholderImage("About us", 800, 600), alt: "About" }, { aspectRatio: "4 / 3" })]),
          c("column", {}, { gap: "14px", minWidth: "300px" }, [
            c("badge", { text: "Our story" }),
            c("heading", { text: "We help people build for the web", level: "h2" }, { fontSize: "38px" }),
            c("text", { text: "Founded in 2026, we believe anyone should be able to design a professional website. Our builder gives you full control without the complexity." }),
            c("text", { text: "Today, thousands of freelancers, agencies and businesses use it to launch faster." }),
          ]),
        ]),
      ]),
    ],
    { padding: "96px 24px" },
    "About"
  );
}

export function footer(): TBNode {
  const col = (title: string, links: { label: string; href: string }[]) =>
    c("column", {}, { gap: "12px", minWidth: "150px", flex: "0 1 auto" }, [
      c("heading", { text: title, level: "h4" }, { fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--tb-on-dark)" }),
      c("navmenu", { links }, { flexDirection: "column", alignItems: "flex-start", gap: "10px", color: "color-mix(in srgb, var(--tb-on-dark) 80%, transparent)", fontWeight: "400", fontSize: "15px" }),
    ]);
  return c(
    "section",
    { tag: "footer" },
    { padding: "64px 24px 32px", backgroundColor: "var(--tb-dark)", color: "color-mix(in srgb, var(--tb-on-dark) 80%, transparent)" },
    [
      container(
        [
          c("row", {}, { justifyContent: "space-between", gap: "40px" }, [
            c("column", {}, { gap: "12px", maxWidth: "320px", minWidth: "220px" }, [
              c("logo", { text: "Brand" }, { color: "var(--tb-on-dark)" }),
              c("text", { text: "Beautiful websites, built your way. Fully customizable themes for every brand." }, { color: "color-mix(in srgb, var(--tb-on-dark) 65%, transparent)", fontSize: "15px" }),
              c("socials", {}, { color: "color-mix(in srgb, var(--tb-on-dark) 80%, transparent)" }),
            ]),
            col("Pages", [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ]),
            col("Resources", [
              { label: "Blog", href: "#" },
              { label: "Help center", href: "#" },
              { label: "Privacy", href: "#" },
            ]),
          ]),
          c("divider", {}, { borderTopColor: "color-mix(in srgb, var(--tb-on-dark) 15%, transparent)", marginTop: "32px", marginBottom: "16px" }),
          c("text", { text: "© 2026 Brand. All rights reserved." }, { fontSize: "14px", color: "color-mix(in srgb, var(--tb-on-dark) 50%, transparent)", textAlign: "center" }),
        ],
        { gap: "0" }
      ),
    ],
    { name: "Footer" }
  );
}

export function simpleFooter(): TBNode {
  return c("section", { tag: "footer" }, { padding: "28px 24px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "var(--tb-border)" }, [
    container([c("text", { text: "© 2026 Brand. All rights reserved." }, { fontSize: "14px" }), c("socials")], { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }),
  ], { name: "Footer" });
}

export function pageTitle(title: string, sub: string): TBNode {
  return section(
    [container([c("heading", { text: title, level: "h1" }, { fontSize: "48px", textAlign: "center" }, undefined, { mobile: { fontSize: "34px" } }), c("text", { text: sub }, { textAlign: "center", fontSize: "18px", maxWidth: "600px", alignSelf: "center" })], { gap: "12px" })],
    { padding: "88px 24px 56px", backgroundColor: "var(--tb-surface)" },
    "Page title"
  );
}

export const BLOCKS: BlockPreset[] = [
  { id: "navbar", label: "Navbar", icon: "header", build: navbar },
  { id: "hero", label: "Hero centered", icon: "hero", build: heroCentered },
  { id: "hero-split", label: "Hero split", icon: "row", build: heroSplit },
  { id: "page-title", label: "Page title", icon: "heading", build: () => pageTitle("Page title", "A short description of this page.") },
  { id: "features", label: "Features", icon: "grid", build: features },
  { id: "about", label: "About / content", icon: "image", build: aboutContent },
  { id: "stats", label: "Stats", icon: "chart", build: stats },
  { id: "testimonials", label: "Testimonials", icon: "quote", build: testimonials },
  { id: "pricing", label: "Pricing", icon: "pricing", build: pricing },
  { id: "team", label: "Team", icon: "users", build: team },
  { id: "gallery", label: "Gallery", icon: "image", build: gallery },
  { id: "faq", label: "FAQ", icon: "help", build: faq },
  { id: "cta", label: "Call to action", icon: "star", build: cta },
  { id: "contact", label: "Contact form", icon: "mail", build: contact },
  { id: "footer", label: "Footer", icon: "footer", build: footer },
  { id: "footer-simple", label: "Simple footer", icon: "footer", build: simpleFooter },
];
