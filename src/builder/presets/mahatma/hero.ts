import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { NAVY, GOLD, CREAM, mix, eyebrow, display, container, row, col, pill } from "./helpers";

export function hero(): TBNode {
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
