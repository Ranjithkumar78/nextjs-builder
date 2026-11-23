import type { TBNode } from "../types";
import { createNode as c } from "../registry";
import { container } from "./helpers";

/* Navbar and footers (used as the theme's global header and footer). */

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
