import type { TBNode } from "../types";
import { createNode as c } from "../registry";
import { section, container, centerHeader, grid } from "./helpers";

/* Pricing table section. */

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
