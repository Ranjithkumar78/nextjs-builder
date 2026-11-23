import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, GOLD_DARK, TEAL, SURFACE, mix, eyebrow, display, body, section, container, row, col } from "./helpers";

export function bigger(): TBNode {
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
