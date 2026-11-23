import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, TEAL, SURFACE, mix, display, body, row, col } from "./helpers";

/** Intro: the homecoming message next to the school gate photo. */
export function aboutIntro(): TBNode {
  return row(
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
  );
}
