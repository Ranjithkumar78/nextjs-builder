import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, SURFACE, mix, eyebrow, display, body, row, col, pill } from "./helpers";

/** "Your registration includes" box with the register button. */
export function registration(): TBNode {
  return c(
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
  );
}
