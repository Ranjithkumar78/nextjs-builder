import type { TBNode } from "../types";
import { createNode as c, placeholderImage } from "../registry";
import { section, container } from "./helpers";

/* Hero, page title and call-to-action sections. */

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

export function pageTitle(title: string, sub: string): TBNode {
  return section(
    [container([c("heading", { text: title, level: "h1" }, { fontSize: "48px", textAlign: "center" }, undefined, { mobile: { fontSize: "34px" } }), c("text", { text: sub }, { textAlign: "center", fontSize: "18px", maxWidth: "600px", alignSelf: "center" })], { gap: "12px" })],
    { padding: "88px 24px 56px", backgroundColor: "var(--tb-surface)" },
    "Page title"
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
