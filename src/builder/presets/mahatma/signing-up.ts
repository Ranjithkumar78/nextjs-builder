import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, SURFACE, LINE, mix, HEAD, eyebrow, display, body, row } from "./helpers";

const card = (n: string, a: [string, string], b: [string, string]) =>
  c("box", {}, { backgroundColor: SURFACE, borderColor: LINE, borderRadius: "2px", padding: "22px 24px 30px", gap: "8px" }, [
    c("text", { text: n }, { fontFamily: HEAD, fontSize: "18px", color: GOLD }),
    c("heading", { text: a[0], level: "h3" }, { fontSize: "27px", fontWeight: "400" }),
    body(a[1], { fontSize: "14px", lineHeight: "1.7" }),
    c("divider", {}, { borderTopColor: LINE, marginTop: "12px", marginBottom: "12px" }),
    c("heading", { text: b[0], level: "h3" }, { fontSize: "27px", fontWeight: "400" }),
    body(b[1], { fontSize: "14px", lineHeight: "1.7" }),
  ]);

/** "What are you signing up for?" heading and the three numbered cards. */
export function signingUp(): TBNode[] {
  return [
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
  ];
}
