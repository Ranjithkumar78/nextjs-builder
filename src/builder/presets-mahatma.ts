import type { Page, StyleMap, TBNode, Theme } from "./types";
import { createNode as c } from "./registry";
import { ulid } from "./ulid";

const newPage = (name: string, slug: string, nodes: TBNode[]): Page => ({ id: ulid(), name, slug, nodes, showHeader: true, showFooter: true });

/* Mahatma Alumni Meetup 2026 — homecoming homepage template.
   Images live in /public/mahatma. Everything here is ordinary builder nodes, so every line is editable. */

// Every color below is a theme color, so editing the palette in Themes updates the whole page.
const NAVY = "var(--tb-dark)"; // dark sections, text on gold buttons
const GOLD = "var(--tb-primary)";
const GOLD_DARK = "color-mix(in srgb, var(--tb-primary) 62%, #000)";
const TEAL = "var(--tb-accent)";
const CREAM = "var(--tb-on-dark)"; // text on dark sections
const SURFACE = "var(--tb-surface)";
const SOFT = "color-mix(in srgb, var(--tb-on-dark) 68%, var(--tb-dark))";
const LINE = "var(--tb-border)";
const mix = (a: string, pct: number, b = "transparent") => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

const HEAD = "var(--tb-heading-font)";

const eyebrow = (text: string, color = TEAL, extra: StyleMap = {}) =>
  c(
    "text",
    { text },
    {
      fontSize: "13px",
      fontWeight: "500",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color,
      paddingLeft: "40px",
      backgroundImage: "linear-gradient(currentColor, currentColor)",
      backgroundSize: "26px 1px",
      backgroundPosition: "left center",
      backgroundRepeat: "no-repeat",
      lineHeight: "1.4",
      ...extra,
    }
  );

const display = (text: string, size: number, extra: StyleMap = {}, accent = GOLD, level = "h2", mobile = Math.round(size * 0.6)) =>
  c("heading", { text, level, accentColor: accent }, { fontSize: `${size}px`, fontWeight: "400", lineHeight: "1.08", color: "var(--tb-text)", ...extra }, undefined, {
    tablet: { fontSize: `${Math.round(size * 0.8)}px` },
    mobile: { fontSize: `${mobile}px` },
  });

const body = (text: string, extra: StyleMap = {}) => c("text", { text }, { fontSize: "15px", lineHeight: "1.8", color: "var(--tb-muted)", ...extra });

const section = (name: string, children: TBNode[], styles: StyleMap, htmlId?: string) =>
  c("section", htmlId ? { htmlId } : {}, { padding: "96px 24px", ...styles }, children, { name, mobile: { padding: "64px 20px" } });

const container = (children: TBNode[], styles: StyleMap = {}) => c("container", {}, { gap: "18px", ...styles }, children);

const row = (children: TBNode[], styles: StyleMap = {}, mobile?: StyleMap) => c("row", {}, styles, children, mobile ? { mobile } : {});
const col = (children: TBNode[], styles: StyleMap = {}) => c("column", {}, styles, children);

const pill = (text: string, href: string, variant: "gold" | "ghost", extra: StyleMap = {}) =>
  c(
    "button",
    { text, href },
    variant === "gold"
      ? { backgroundColor: GOLD, color: NAVY, borderRadius: "999px", padding: "16px 32px", fontWeight: "500", fontSize: "16px", ...extra }
      : {
          backgroundColor: "rgba(255,255,255,.06)",
          color: "#ffffff",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgba(255,255,255,.45)",
          borderRadius: "999px",
          padding: "16px 32px",
          fontWeight: "500",
          fontSize: "16px",
          ...extra,
        },
    undefined,
    { hover: variant === "gold" ? { backgroundColor: mix(GOLD, 85, "#fff"), transform: "translateY(-1px)" } : { backgroundColor: "rgba(255,255,255,.14)" } }
  );

// ------------------------------------------------------------------ header
function header(): TBNode {
  return c(
    "section",
    { tag: "header" },
    { padding: "14px 24px", backgroundColor: "#ffffff", position: "sticky", top: "0", zIndex: "50", boxShadow: "0 1px 0 rgba(0,0,0,.06)" },
    [
      container(
        [
          c("logo", { text: "", src: "/mahatma/logo.png", href: "/" }, { fontSize: "34px" }),
          row(
            [
              c(
                "navmenu",
                {
                  links: [
                    { label: "About", href: "#about" },
                    { label: "Schedule", href: "#schedule" },
                    { label: "Chief Guests", href: "#chief-guest" },
                    { label: "Sponsors", href: "#sponsors" },
                  ],
                },
                { gap: "24px", color: mix(GOLD, 80, "#fff"), fontSize: "15px", fontWeight: "500" },
                undefined,
                { mobile: { display: "none" } }
              ),
              c("button", { text: "Buy Tickets", href: "#register" }, { backgroundColor: GOLD, color: "#ffffff", padding: "10px 22px", borderRadius: "8px", fontSize: "15px" }, undefined, {
                hover: { backgroundColor: mix(GOLD, 85, "#000") },
              }),
            ],
            { width: "auto", alignItems: "center", gap: "16px", flexWrap: "nowrap" }
          ),
        ],
        { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }
      ),
    ],
    { name: "Header" }
  );
}

// ------------------------------------------------------------------ hero
function hero(): TBNode {
  return c(
    "section",
    {},
    {
      padding: "64px 24px 88px",
      minHeight: "560px",
      display: "flex",
      alignItems: "center",
      color: CREAM,
      backgroundImage: `linear-gradient(180deg, ${mix(NAVY, 55)} 0%, ${mix(NAVY, 72)} 55%, ${NAVY} 100%), url("/mahatma/gate.jpg")`,
      backgroundSize: "cover",
      backgroundPosition: "center 35%",
    },
    [
      container(
        [
          c(
            "badge",
            { text: "*●*\u2002 MAA · MAHATMA ALUMNI ASSOCIATION", accentColor: GOLD },
            { backgroundColor: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.35)", color: CREAM, fontSize: "13px", fontWeight: "500", padding: "8px 18px", letterSpacing: "0.5px" }
          ),
          display("“Mahatma Alumni,\n  *Homecoming 2026.”*", 92, { color: CREAM, letterSpacing: "-1px", lineHeight: "1.05" }, GOLD, "h1", 44),
          row(
            [
              col([eyebrow("Countdown to December 27, 2026", GOLD, { paddingLeft: "0", backgroundImage: "none", fontSize: "12px" }), c("countdown", { target: "2026-12-27T08:00:00+05:30" }, { color: CREAM })], {
                flex: "0 1 auto",
                minWidth: "0",
                gap: "12px",
              }),
              row([pill("Buy a Ticket  →", "#register", "gold"), pill("See the Schedule", "#schedule", "ghost")], { width: "auto", gap: "12px", alignItems: "center" }),
            ],
            { justifyContent: "space-between", alignItems: "flex-end", gap: "28px", marginTop: "28px" }
          ),
        ],
        { gap: "22px" }
      ),
    ],
    { name: "Hero", mobile: { padding: "48px 20px 64px", minHeight: "0" } }
  );
}

// ------------------------------------------------------------------ about + signing up + giving back + registration
const card = (n: string, a: [string, string], b: [string, string]) =>
  c("box", {}, { backgroundColor: SURFACE, borderColor: LINE, borderRadius: "2px", padding: "22px 24px 30px", gap: "8px" }, [
    c("text", { text: n }, { fontFamily: HEAD, fontSize: "18px", color: GOLD }),
    c("heading", { text: a[0], level: "h3" }, { fontSize: "27px", fontWeight: "400" }),
    body(a[1], { fontSize: "14px", lineHeight: "1.7" }),
    c("divider", {}, { borderTopColor: LINE, marginTop: "12px", marginBottom: "12px" }),
    c("heading", { text: b[0], level: "h3" }, { fontSize: "27px", fontWeight: "400" }),
    body(b[1], { fontSize: "14px", lineHeight: "1.7" }),
  ]);

function about(): TBNode {
  return section(
    "About",
    [
      container([
        eyebrow("About the homecoming"),
        row(
          [
            col(
              [
                c("heading", { text: "Once a Mahatmite, Always a Mahatmite", level: "h3" }, { fontSize: "34px", fontWeight: "400", fontStyle: "italic", color: TEAL }, undefined, { mobile: { fontSize: "24px" } }),
                display("From the first batch to graduate from Mahatma in 1991 to the most recent graduates of 2026 - this is for us, and it's by us.", 54, { lineHeight: "1.12" }, GOLD, "h2", 32),
                c("heading", { text: "“By Mahatmites, For Mahatmites.”", level: "p" }, { fontSize: "32px", fontWeight: "400", fontStyle: "italic", color: TEAL }, undefined, { mobile: { fontSize: "24px" } }),
                body(
                  "December is calling. Let’s meet the people who shared the same corridors, classrooms and uniforms. Let’s see the teachers who shaped us in big and small, significant ways; remember the assemblies that gave us a million memories and the punishments for latecomers that hopefully taught us to be more punctual in life; and celebrate friendships and memories across generations.",
                  { maxWidth: "600px" }
                ),
                display("The Alumni Homecoming 2026!\n*Mahatma, here we come.*", 36, { marginTop: "8px", lineHeight: "1.2" }, TEAL, "h3", 26),
              ],
              { flex: "1.35 1 0", minWidth: "300px", gap: "22px" }
            ),
            col(
              [
                c("image", { src: "/mahatma/gate.jpg", alt: "Mahatma school gate" }, { aspectRatio: "7 / 10", borderRadius: "20px", padding: "10px", backgroundColor: mix(SURFACE, 70, "#fff"), boxShadow: "0 30px 60px -30px rgba(0,0,0,.4)" }),
              ],
              { flex: "1 1 0", minWidth: "280px" }
            ),
          ],
          { gap: "64px", alignItems: "center" }
        ),
        c("divider", {}, { borderTopColor: mix("var(--tb-text)", 15), marginTop: "56px", marginBottom: "40px" }),
        eyebrow("December 27, 2026"),
        row(
          [
            display("What are you *signing up for?*", 64, { flex: "1 1 520px" }, GOLD, "h2", 38),
            c("heading", { text: "By buying a ticket, you’re signing up for...", level: "p" }, { fontSize: "22px", fontWeight: "400", maxWidth: "380px", lineHeight: "1.35" }),
          ],
          { justifyContent: "space-between", alignItems: "center", gap: "24px", marginBottom: "8px" }
        ),
        c(
          "grid",
          {},
          { gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px" },
          [
            card("01", ["Connect", "Find your old benchmates, classmates, batchmates and fellow Mahatmites whom you haven’t seen in years."], ["Network", "Meet Mahatmites from different batches, branches, cities and countries — people who could become valuable connections, both personally and professionally."]),
            card("02", ["Contribute", "As Mahatmites, we were taught the importance of giving back.\nAnd we want to carry that forward."], ["Relive", "Rekindle the child within you as you walk down memory lane. We guarantee you’ll feel like a school kid all over again — at least for one day!"]),
            card(
              "03",
              ["Celebrate", "Music, performances, stories, food, laughter and a whole lot of school spirit.\nThink of it as an assembly and cultural day — only bigger, louder and with a lot more freedom!\nAnd brace yourself... we might even bring back a little Sports Day feeling!"],
              ["Belong", "Become part of a growing alumni community that goes far beyond this one day."]
            ),
          ],
          { name: "Signing up cards", tablet: { gridTemplateColumns: "minmax(0, 1fr)" } }
        ),
        c("box", {}, { backgroundColor: NAVY, borderWidth: "0", borderRadius: "26px", padding: "44px 48px", marginTop: "18px", flexDirection: "row", flexWrap: "wrap", gap: "40px" }, [
          col(
            [
              c("text", { text: "GIVING BACK" }, { fontSize: "12px", letterSpacing: "2.5px", fontWeight: "600", color: GOLD }),
              body("From blood donation to tree planting - from supporting those who need us to making our surroundings cleaner and better - we intend to make a difference.", { color: mix(CREAM, 90), fontSize: "17px" }),
              body("A portion of your ticket contribution will go towards supporting individuals in need and initiatives that aim to make our society a better and cleaner place.", { color: mix(CREAM, 90), fontSize: "17px" }),
            ],
            { flex: "1.4 1 0", minWidth: "280px", gap: "14px" }
          ),
          col(
            [
              c(
                "heading",
                { text: "எப்படி வேண்டுமானாலும் வாழலாம்\nஎன்பது வாழ்க்கை அல்ல,\n**இப்படித்தான் வாழவேண்டும்\nஎன்பதே வாழ்க்கை!**", level: "p" },
                { fontFamily: "var(--tb-body-font)", fontSize: "26px", fontWeight: "400", lineHeight: "1.65", color: GOLD },
                undefined,
                { mobile: { fontSize: "20px" } }
              ),
            ],
            { flex: "1 1 0", minWidth: "260px", justifyContent: "center", borderLeftWidth: "1px", borderLeftStyle: "solid", borderLeftColor: mix(CREAM, 15), paddingLeft: "32px" }
          ),
        ], { name: "Giving back", mobile: { padding: "32px 24px" } }),
        c(
          "box",
          { htmlId: "register" },
          { background: `linear-gradient(135deg, ${mix(SURFACE, 55, "#fff")} 0%, ${SURFACE} 100%)`, borderColor: mix(GOLD, 55), borderRadius: "22px", padding: "38px 40px 44px", marginTop: "48px", gap: "14px", boxShadow: "0 30px 60px -40px rgba(0,0,0,.3)" },
          [
            eyebrow("One ticket. A whole day together."),
            row(
              [
                col(
                  [
                    display("Your registration\n*includes.*", 60, { lineHeight: "1.02" }, GOLD, "h2", 40),
                    body("Come back to the place that brought us together.\nWe’ll take care of the rest.", { fontSize: "15px" }),
                  ],
                  { flex: "1 1 0", minWidth: "280px", gap: "18px" }
                ),
                c(
                  "grid",
                  {},
                  { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px 32px", flex: "1.4 1 0", minWidth: "280px" },
                  [
                    c("list", { items: ["✓  All of the above-mentioned experiences", "✓  Event kit / goodies", "✓  Fun entertaining games"] }, { listStyleType: "none", paddingLeft: "0", gap: "16px", fontSize: "15px" }),
                    c("list", { items: ["✓  Lunch and refreshments", "✓  Access to alumni networking activities", "✓  Business connect and much more"] }, { listStyleType: "none", paddingLeft: "0", gap: "16px", fontSize: "15px" }),
                  ],
                  { mobile: { gridTemplateColumns: "minmax(0, 1fr)" } }
                ),
              ],
              { gap: "40px", alignItems: "center" }
            ),
            c("heading", { text: "A Day to remember for a lifetime!", level: "p" }, { fontFamily: "var(--tb-body-font)", fontSize: "22px", fontWeight: "600", textAlign: "center", marginTop: "24px" }),
            pill("REGISTER NOW  →", "#register", "gold", { alignSelf: "center", letterSpacing: "2px", fontSize: "14px", padding: "15px 34px" }),
          ],
          { name: "Registration includes", mobile: { padding: "28px 22px" } }
        ),
      ]),
    ],
    { backgroundColor: "var(--tb-background)", backgroundImage: `linear-gradient(180deg, var(--tb-background) 0%, ${mix("var(--tb-background)", 92, GOLD)} 100%)` },
    "about"
  );
}

// ------------------------------------------------------------------ rules
const rule = (n: string, title: string, text: string, icon: string, iconBg: string) =>
  c("box", {}, { backgroundColor: "#ffffff", borderColor: LINE, borderRadius: "16px", padding: "26px 24px", flexDirection: "row", gap: "18px", alignItems: "flex-start" }, [
    c("badge", { text: n }, { width: "40px", height: "40px", padding: "0", justifyContent: "center", alignItems: "center", backgroundColor: "transparent", borderColor: mix(GOLD, 60), color: TEAL, fontFamily: HEAD, fontSize: "16px", fontWeight: "400", flex: "none" }),
    col([c("heading", { text: title, level: "h3" }, { fontSize: "24px", fontWeight: "400", lineHeight: "1.25" }), body(text, { fontSize: "14px", lineHeight: "1.75" })], { flex: "1 1 0", minWidth: "0", gap: "8px" }),
    c("text", { text: icon }, { width: "76px", height: "76px", borderRadius: "999px", backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", flex: "none", lineHeight: "1" }, undefined, {
      mobile: { display: "none" },
    }),
  ]);

function rules(): TBNode {
  return section(
    "Rules",
    [
      container([
        eyebrow("A few rules before we reunite"),
        display("Before you walk through\n*those doors...*", 64, { marginBottom: "28px", lineHeight: "1.05" }, GOLD, "h2", 38),
        c(
          "grid",
          {},
          { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px", alignItems: "stretch" },
          [
            rule("01", "We’re all Mahatmites here", "Be respectful, welcoming and inclusive towards alumni from every batch, branch and generation.\nBecause here, we’re all one community!", "👥", SURFACE),
            rule("02", "Let’s make new memories!", "Every Mahatmite’s journey is unique - filled with beautiful memories, valuable lessons, or perhaps some hurt feelings.\nNow, let’s turn a new page, build new connections, and celebrate the joy of being part of Mahatma - Our Home!", "💬", SURFACE),
            rule("03", "Your name tag matters", "Please wear your registration / wristband / name tag throughout the event.\nIt will help you identify, connect and reconnect with fellow Mahatmites.", "🪪", SURFACE),
            rule("04", "Photos are part of the fun", "The event may be photographed and video-recorded for alumni and community purposes.\nCapture the memories, click those pictures and make those reels — but please remember to respect the privacy and comfort of others.", "📸", SURFACE),
            rule("05", "Please respect the venue", "Follow the venue rules and the instructions of the event organizers.\nWe want you to feel like a school kid again — but please remember, we’re still adults!", "🏛️", SURFACE),
            rule(
              "06",
              "No alcohol. No intoxicants. No exceptions.",
              "This is a celebration of Mahatma, our school and the memories we share as Mahatmites.\nAlcohol, recreational drugs, intoxicants or any substance that may affect behaviour or safety are strictly prohibited at the venue.\nPlease do not bring, consume, distribute or attempt to enter the venue under the influence of alcohol or any prohibited substance.\nLet’s keep the Homecoming focused on what brings us together — our school, our friendships, our memories and our Mahatmite spirit.",
              "🚫",
              "#edf3f8"
            ),
            rule(
              "07",
              "Respect, always.",
              "Harassment, bullying, abusive behaviour, inappropriate conduct, fighting, threatening behaviour or any form of discrimination will not be tolerated.\nWe have Mahatmites from different batches, generations, professions, cities and countries coming together.\nLet’s make everyone feel welcome, comfortable and respected.\nThe organizing team reserves the right to ask anyone engaging in unacceptable behaviour to leave the venue, without refund.",
              "🛡️",
              "#f5efe3"
            ),
            rule(
              "08",
              "This is an alumni-only reunion",
              "The event is exclusively for registered Mahatmites.\nPlease respect the nature of the gathering and ensure that only registered alumni attend the event.\nCome to reconnect with your batchmates, meet Mahatmites from across generations, relive those school memories and celebrate the bond that connects us all.",
              "🎓",
              "#f5efe3"
            ),
            rule("09", "Be part of the community", "This isn’t just an event.\nIt is the beginning — and continuation — of a stronger Mahatmite community.", "🤝", SURFACE),
          ],
          { name: "Rule cards", tablet: { gridTemplateColumns: "minmax(0, 1fr)" } }
        ),
        c("box", {}, { backgroundColor: NAVY, borderWidth: "0", borderRadius: "18px", padding: "36px 40px", marginTop: "8px", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }, [
          c("heading", { text: "Basically: come, connect, have fun, and behave like the Mahatmite your parents thought you were!", level: "p" }, { fontSize: "29px", fontWeight: "400", lineHeight: "1.35", color: CREAM, flex: "1 1 480px" }, undefined, {
            mobile: { fontSize: "22px" },
          }),
          c("heading", { text: "Remember:\n“சான்றோன் எனக்கேட்ட தாய்”?", level: "p" }, { fontSize: "21px", fontWeight: "400", lineHeight: "1.4", color: GOLD }),
        ]),
      ]),
    ],
    {
      backgroundColor: mix(SURFACE, 35, "#fff"),
      backgroundImage: `radial-gradient(${mix("var(--tb-text)", 7)} 1px, transparent 1px)`,
      backgroundSize: "22px 22px",
    }
  );
}

// ------------------------------------------------------------------ bigger than one day
function bigger(): TBNode {
  const stat = (n: string, l: string) =>
    col(
      [
        c("heading", { text: n, level: "p" }, { fontSize: "76px", fontWeight: "400", color: TEAL, lineHeight: "1" }, undefined, { mobile: { fontSize: "52px" } }),
        c("text", { text: l }, { fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--tb-muted)" }),
      ],
      { alignItems: "center", gap: "10px", minWidth: "180px", flex: "1 1 0" }
    );
  const line = mix("var(--tb-text)", 18);
  return section(
    "Bigger than one day",
    [
      container(
        [
          eyebrow("One school. A world of Mahatmites.", mix(GOLD, 80, "#000"), { alignSelf: "center" }),
          display("This is bigger than\n*one day.*", 96, { textAlign: "center", lineHeight: "1" }, GOLD_DARK, "h2", 50),
          body("From the Mahatmite who graduated decades ago to the one who just walked out of the school gates...", { textAlign: "center", fontSize: "19px", maxWidth: "620px", alignSelf: "center" }),
          row([stat("125+", "Batches"), stat("10,000+", "Journeys"), stat("10+", "Chapters across the globe")], {
            maxWidth: "960px",
            alignSelf: "center",
            justifyContent: "space-around",
            padding: "34px 0",
            marginTop: "28px",
            borderTopWidth: "1px",
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderLeftWidth: "0",
            borderRightWidth: "0",
            borderColor: line,
          }),
          display("One foundation.\n*One shared beginning.*", 34, { textAlign: "center", lineHeight: "1.3", marginTop: "20px" }, GOLD_DARK, "p", 26),
          display("*Once a Mahatmite,\nAlways a Mahatmite.*", 68, { textAlign: "center", fontWeight: "500", lineHeight: "1.1", marginTop: "48px" }, GOLD_DARK, "p", 38),
          row(
            [
              c("heading", { text: "See you on December 27, 2026!!", level: "p" }, { fontSize: "25px", fontWeight: "400" }),
              c("heading", { text: "Mahatma, here we come.", level: "p" }, { fontSize: "25px", fontWeight: "400" }),
            ],
            { maxWidth: "960px", alignSelf: "center", justifyContent: "space-between", gap: "16px", paddingTop: "22px", marginTop: "28px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: line }
          ),
        ],
        { gap: "18px" }
      ),
    ],
    { backgroundImage: `linear-gradient(115deg, ${SURFACE} 0%, var(--tb-background) 45%, ${mix(GOLD, 65, "var(--tb-background)")} 75%, ${GOLD} 100%)` }
  );
}

// ------------------------------------------------------------------ schedule + activities
function schedule(): TBNode {
  const item = (time: string, title: string, desc: string) =>
    row(
      [
        col(
          [
            c("text", { text: "SUN 27 DEC" }, { fontSize: "11px", letterSpacing: "2px", fontWeight: "600", color: SOFT }),
            c("heading", { text: time, level: "p" }, { fontSize: "28px", fontWeight: "400", color: CREAM }),
          ],
          { flex: "0 0 250px", minWidth: "0", gap: "4px" }
        ),
        col(
          [
            c("heading", { text: title, level: "h3" }, { fontSize: "35px", fontWeight: "400", color: CREAM }, undefined, { mobile: { fontSize: "26px" } }),
            body(desc, { color: SOFT, fontSize: "14px" }),
          ],
          { flex: "1 1 0", minWidth: "260px", gap: "6px" }
        ),
      ],
      { padding: "24px 0", gap: "24px", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: mix(CREAM, 12) }
    );
  const act = (title: string, kids: TBNode[]) =>
    c("box", {}, { backgroundColor: "rgba(0,0,0,.22)", borderColor: mix(CREAM, 12), borderRadius: "14px", padding: "30px", gap: "14px" }, [
      c("heading", { text: title, level: "h3" }, { fontSize: "32px", fontWeight: "400", color: GOLD }),
      ...kids,
    ]);
  const dash = (items: string[]) => c("list", { items }, { listStyleType: '"–   "', paddingLeft: "16px", gap: "10px", fontSize: "15px", color: mix(CREAM, 88), lineHeight: "1.6" });
  const small = (t: string) => body(t, { color: SOFT, fontSize: "14px" });
  return section(
    "Schedule",
    [
      container(
        [
          eyebrow("Agenda & all-day activities", GOLD),
          c("heading", { text: "The Homecoming", level: "h2" }, { fontSize: "66px", fontWeight: "400", fontStyle: "italic", color: GOLD }, undefined, { mobile: { fontSize: "42px" } }),
          row(
            [
              c("text", { text: "25 & 26 Dec" }, { fontSize: "14px", color: SOFT, paddingBottom: "14px" }),
              c("text", { text: "Sun 27 Dec" }, { fontSize: "14px", color: CREAM, paddingBottom: "12px", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: GOLD }),
            ],
            { gap: "36px", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: mix(CREAM, 15), marginTop: "18px", alignItems: "flex-end" }
          ),
          item("8:00 AM", "Walk back in.", "Register, find your school friends, and strike your first pose at the photobooths. The school bell rings, and the day begins."),
          item("8:45 AM", "Assembly.", "Fall in line, just like the old days."),
          item("9:00 AM", "Good Morning, Everyone!", "Welcome by the MC."),
          item("9:03 AM", "The Prayer Song", "Sung together again, the way we sang it every morning."),
          c("button", { text: "View all agenda  ↓", href: "#schedule" }, { alignSelf: "center", marginTop: "28px", backgroundColor: "transparent", color: CREAM, borderWidth: "1px", borderStyle: "solid", borderColor: mix(CREAM, 55), borderRadius: "999px", padding: "12px 48px", fontWeight: "500" }, undefined, {
            hover: { backgroundColor: mix(CREAM, 10) },
          }),
          eyebrow("Beyond the timetable", GOLD, { marginTop: "64px" }),
          display("Happening All Day *(Don’t Miss These)*", 52, { color: CREAM, marginBottom: "10px" }, GOLD, "h2", 32),
          c(
            "grid",
            {},
            { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" },
            [
              act("Photobooths", [
                dash([
                  "**Batch Booth:** your whole batch, one big picture, together again.",
                  "**Teacher Booth:** a picture with the teacher who shaped you.",
                  "**Common Booth:** for everyone, any combination.",
                  "**Registration Photobooth:** your very first picture of the day.",
                ]),
              ]),
              act("Live Fun Quizzes", [
                small("Vote from your phone on Mentimeter."),
                dash(["Find the lost school friend.", "Naughtiest school friend.", "School friend who has changed the most.", "School friend who is still exactly the same.", "The teacher who impacted you the most."]),
              ]),
              act("Signature Board", [small("Sign it and write two lines: who you were in school, and who you are today.")]),
              act("Lost & Found Board", [small("Looking for a school friend? Leave a sticky note saying who. Someone in the hall may know exactly where they are.")]),
              act("Music from Our School Days", [small("The famous school light music band brings the old songs back.")]),
              act("Nostalgia Touches", [
                dash([
                  "**The School Bell:** A real school bell rings at the start of the day, at Assembly, at lunch, and at the final “Bye Bye”.",
                  "**Old Photo Wall:** Bring a school-days photograph, pin it up, and let others find themselves in it.",
                  "**Class Photo Recreation:** Line up in the same rows and the same poses as your old class photo.",
                  "**Teacher’s Attendance Call:** Batch names are called out during the day. Say “Present, Ma’am!” when yours is read.",
                ]),
              ]),
            ],
            { name: "Activities", tablet: { gridTemplateColumns: "minmax(0, 1fr)" } }
          ),
          c("box", {}, { backgroundColor: "rgba(0,0,0,.25)", borderColor: mix(GOLD, 45), borderRadius: "16px", padding: "40px", marginTop: "14px", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "28px" }, [
            col(
              [
                c("heading", { text: "Why You Should Be There", level: "h3" }, { fontSize: "40px", fontWeight: "400", color: GOLD }, undefined, { mobile: { fontSize: "30px" } }),
                body(
                  "Some of your school friends will be in that hall, and some are looking for you. The prayer song, the pledge, the bell, and the photo with your teacher can’t be recreated later, and they can’t be watched on a screen. Register now, so you’re not hearing about it afterwards.",
                  { color: mix(CREAM, 88), fontSize: "16px", maxWidth: "660px" }
                ),
              ],
              { flex: "1 1 480px", gap: "12px" }
            ),
            pill("Register Now  →", "#register", "gold"),
          ]),
        ],
        { gap: "0" }
      ),
    ],
    {
      color: CREAM,
      backgroundColor: NAVY,
      backgroundImage: `radial-gradient(ellipse at 20% 0%, ${mix("#8fb3d0", 30)} 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, ${mix(GOLD, 18)} 0%, transparent 55%), linear-gradient(180deg, ${mix(NAVY, 88, "#6b8fb0")} 0%, ${NAVY} 100%)`,
    },
    "schedule"
  );
}

// ------------------------------------------------------------------ chief guest, sponsors
function announce(label: string, htmlId: string, bg: StyleMap): TBNode {
  return section(label, [container([eyebrow(label), display("To be announced soon", 64, {}, GOLD, "h2", 38)])], { padding: "88px 24px", ...bg }, htmlId);
}

// ------------------------------------------------------------------ terms
function terms(): TBNode {
  const t = (n: string, title: string, items: string[]) =>
    row(
      [
        c("text", { text: n }, { fontFamily: HEAD, fontSize: "26px", color: GOLD, flex: "0 0 56px", lineHeight: "1.2" }),
        c("heading", { text: title, level: "h3" }, { fontSize: "27px", fontWeight: "400", flex: "0 0 300px", minWidth: "0", lineHeight: "1.2" }, undefined, { mobile: { flex: "1 1 200px" } }),
        c("list", { items }, { listStyleType: '"–   "', paddingLeft: "16px", gap: "10px", fontSize: "14.5px", color: "var(--tb-muted)", lineHeight: "1.65", flex: "1 1 320px" }),
      ],
      { padding: "34px 0", gap: "20px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: mix("var(--tb-text)", 14), alignItems: "flex-start" }
    );
  return section(
    "Terms & conditions",
    [
      container(
        [
          row(
            [
              col([eyebrow("Terms & conditions"), display("THE BORING BUT\nIMPORTANT BIT", 60, { lineHeight: "1.05" }, GOLD, "h2", 36)], { flex: "1 1 380px", gap: "16px" }),
              col(
                [
                  c("heading", { text: "We promise this is probably the least exciting section on the page.", level: "p" }, { fontSize: "20px", fontWeight: "400", lineHeight: "1.5" }),
                  c("heading", { text: "But it matters. A lot.", level: "p" }, { fontSize: "20px", fontWeight: "400" }),
                  c("text", { text: "SO PLEASE CONTINUE READING!!" }, { fontSize: "13px", fontWeight: "700", letterSpacing: "1.5px", color: TEAL }),
                ],
                { flex: "1 1 300px", gap: "8px", borderLeftWidth: "2px", borderLeftStyle: "solid", borderLeftColor: GOLD, paddingLeft: "24px" }
              ),
            ],
            { gap: "40px", alignItems: "center", marginBottom: "40px" }
          ),
          t("01", "Registration", ["Registration is mandatory for entry to the event.", "Each registration is valid only for the individual(s) registered.", "Please ensure that all information provided during registration is accurate and complete.", "The event is strictly for registered Mahatmites."]),
          t("02", "Payments", ["Registration fees are non-refundable, except where specifically stated under the applicable refund policy.", "Any applicable transaction or convenience fees will be communicated during the registration process."]),
          t("03", "Cancellation / Changes", ["The organizing team reserves the right to modify the event schedule, itinerary, activities, venue arrangements or other event details whenever necessary.", "Any significant changes will be communicated to attendees wherever reasonably possible.", "All registration fees and payments are strictly non-refundable."]),
          t("04", "Event Access", [
            "Entry will be permitted only to registered alumni.",
            "The event is strictly for registered Mahatmites. Non-alumni, unregistered guests or accompanying persons will not be permitted entry.",
            "The organizers reserve the right to deny entry or request an attendee to leave in circumstances involving disruptive, inappropriate, unsafe or intoxicated behaviour.",
            "Attendees found carrying, consuming, distributing or being under the influence of alcohol, recreational drugs or prohibited substances may be refused entry or asked to leave the venue immediately.",
            "No refund will be applicable in such circumstances.",
          ]),
          t("05", "Photography & Media", ["Photos and videos may be captured during the event and may be used for alumni communications, social media, websites and promotional purposes.", "Attendees are expected to respect the privacy and comfort of fellow alumni while taking photographs or videos.", "Any behaviour that violates the privacy, dignity or safety of others may result in removal from the premises."]),
          t("06", "Conduct & Safety", ["All attendees are expected to behave responsibly and respectfully throughout the event.", "Harassment, bullying, fighting, threatening behaviour, abusive language, discrimination or any form of inappropriate conduct will not be tolerated and will subject to legal action.", "The organizing team reserves the right to take appropriate action, including removal from the venue, against anyone violating the event’s code of conduct."]),
          t("07", "Alcohol & Prohibited Substances", ["Alcohol is strictly prohibited at the event venue.", "The possession, consumption, distribution or sale of alcohol or recreational drugs is strictly prohibited.", "Attendees must not arrive at the venue under the influence of alcohol, drugs or any intoxicating substance.", "Any violation may result in immediate removal from the venue without refund and may be reported to the appropriate authorities where required by law."]),
          t("08", "Liability", ["Attendees are responsible for their personal belongings throughout the event.", "The organizers will not be responsible for loss, theft or damage to personal belongings.", "Attendees are expected to comply with all reasonable safety instructions issued by the venue and organizing team."]),
          t("09", "Privacy", ["Information collected during registration will be used for event administration, communication and legitimate alumni community purposes, in accordance with the applicable privacy policy.", "By registering, attendees acknowledge that event photography and videography may take place."]),
          c("divider", {}, { borderTopColor: mix("var(--tb-text)", 14), marginTop: "0", marginBottom: "0" }),
        ],
        { maxWidth: "1000px", gap: "0" }
      ),
    ],
    { backgroundImage: `linear-gradient(90deg, ${SURFACE} 0%, var(--tb-background) 100%)` }
  );
}

// ------------------------------------------------------------------ footer
function footer(): TBNode {
  return c(
    "section",
    { tag: "footer" },
    { padding: "48px 24px 0", backgroundColor: mix("var(--tb-background)", 92, "var(--tb-text)"), overflow: "hidden" },
    [
      container(
        [
          row(
            [
              col(
                [
                  c("heading", { text: "Mahatma Alumni Association", level: "p" }, { fontSize: "26px", fontWeight: "400" }),
                  body("A lifelong bond, a shared legacy.", { fontSize: "15px", lineHeight: "1.5" }),
                ],
                { flex: "0 1 auto", gap: "6px" }
              ),
              c(
                "navmenu",
                {
                  links: [
                    { label: "About", href: "#about" },
                    { label: "Schedule", href: "#schedule" },
                    { label: "Chief Guest", href: "#chief-guest" },
                    { label: "Sponsors", href: "#sponsors" },
                  ],
                },
                { gap: "26px", fontSize: "15px", fontWeight: "400" }
              ),
            ],
            { justifyContent: "space-between", alignItems: "center", gap: "20px" }
          ),
          c("heading", { text: "MAHATMA", level: "p" }, { fontSize: "190px", fontWeight: "400", lineHeight: "0.85", letterSpacing: "4px", textAlign: "center", color: mix("var(--tb-text)", 9), marginTop: "36px" }, undefined, {
            tablet: { fontSize: "130px" },
            mobile: { fontSize: "64px" },
          }),
        ],
        { gap: "0" }
      ),
    ],
    { name: "Footer" }
  );
}

export function mahatmaTheme(): Theme {
  return {
    id: ulid(),
    name: "Mahatma Alumni Meetup 2026",
    tokens: {
      colors: {
        primary: "#c5a55a",
        secondary: "#1e2a47",
        accent: "#2f6380",
        background: "#e9dfcc",
        surface: "#f3ede2",
        text: "#1e2a47",
        muted: "#5a6274",
        border: "#ddd1b9",
        dark: "#1e2a47",
        onDark: "#f3ede2",
      },
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Jost', sans-serif",
      baseFontSize: "16px",
      radius: "12px",
      containerWidth: "1190px",
    },
    header: [header()],
    footer: [footer()],
    pages: [
      newPage("Home", "home", [
        hero(),
        about(),
        rules(),
        bigger(),
        schedule(),
        announce("Chief Guest", "chief-guest", { backgroundColor: SURFACE, backgroundImage: `radial-gradient(${mix("var(--tb-text)", 7)} 1px, transparent 1px)`, backgroundSize: "22px 22px" }),
        announce("Sponsors", "sponsors", { backgroundColor: "#ffffff" }),
        terms(),
      ]),
    ],
    customCss: "html{scroll-behavior:smooth}\n.tb-root [id]{scroll-margin-top:90px}\n.tb-t-list li::marker{color:var(--tb-primary)}\n.tb-t-badge em{font-style:normal}",
  };
}
