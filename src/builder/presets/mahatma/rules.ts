import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { NAVY, GOLD, TEAL, CREAM, SURFACE, LINE, mix, HEAD, eyebrow, display, body, section, container, col } from "./helpers";

const rule = (n: string, title: string, text: string, icon: string, iconBg: string) =>
  c("box", {}, { backgroundColor: "#ffffff", borderColor: LINE, borderRadius: "16px", padding: "26px 24px", flexDirection: "row", gap: "18px", alignItems: "flex-start" }, [
    c("badge", { text: n }, { width: "40px", height: "40px", padding: "0", justifyContent: "center", alignItems: "center", backgroundColor: "transparent", borderColor: mix(GOLD, 60), color: TEAL, fontFamily: HEAD, fontSize: "16px", fontWeight: "400", flex: "none" }),
    col([c("heading", { text: title, level: "h3" }, { fontSize: "24px", fontWeight: "400", lineHeight: "1.25" }), body(text, { fontSize: "14px", lineHeight: "1.75" })], { flex: "1 1 0", minWidth: "0", gap: "8px" }),
    c("text", { text: icon }, { width: "76px", height: "76px", borderRadius: "999px", backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", flex: "none", lineHeight: "1" }, undefined, {
      mobile: { display: "none" },
    }),
  ]);

export function rules(): TBNode {
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
