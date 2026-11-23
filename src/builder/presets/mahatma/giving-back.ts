import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { NAVY, GOLD, CREAM, mix, body, col } from "./helpers";

/** Dark "Giving back" panel. */
export function givingBack(): TBNode {
  return c("box", {}, { backgroundColor: NAVY, borderWidth: "0", borderRadius: "26px", padding: "44px 48px", marginTop: "18px", flexDirection: "row", flexWrap: "wrap", gap: "40px" }, [
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
  ], { name: "Giving back", mobile: { padding: "32px 24px" } });
}
