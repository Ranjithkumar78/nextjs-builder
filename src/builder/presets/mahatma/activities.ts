import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, CREAM, SOFT, mix, eyebrow, display, body, col, pill } from "./helpers";

const act = (title: string, kids: TBNode[]) =>
  c("box", {}, { backgroundColor: "rgba(0,0,0,.22)", borderColor: mix(CREAM, 12), borderRadius: "14px", padding: "30px", gap: "14px" }, [
    c("heading", { text: title, level: "h3" }, { fontSize: "32px", fontWeight: "400", color: GOLD }),
    ...kids,
  ]);
const dash = (items: string[]) => c("list", { items }, { listStyleType: '"–   "', paddingLeft: "16px", gap: "10px", fontSize: "15px", color: mix(CREAM, 88), lineHeight: "1.6" });
const small = (t: string) => body(t, { color: SOFT, fontSize: "14px" });

/** "Happening all day" activity cards and the "Why you should be there" call to action. */
export function activities(): TBNode[] {
  return [
    eyebrow("Beyond the timetable", GOLD, { marginTop: "64px" }),
    display("Happening All Day *(Don’t Miss These)*", 52, { color: CREAM, marginBottom: "10px" }, GOLD, "h2", 32),
    c(
      "grid",
      {},
      { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" },
      [
        act("Photobooths", [
          dash([
            "**Batch Booth:** your whole batch, one big picture, together again.",
            "**Teacher Booth:** a picture with the teacher who shaped you.",
            "**Common Booth:** for everyone, any combination.",
            "**Registration Photobooth:** your very first picture of the day.",
          ]),
        ]),
        act("Live Fun Quizzes", [
          small("Vote from your phone on Mentimeter."),
          dash(["Find the lost school friend.", "Naughtiest school friend.", "School friend who has changed the most.", "School friend who is still exactly the same.", "The teacher who impacted you the most."]),
        ]),
        act("Signature Board", [small("Sign it and write two lines: who you were in school, and who you are today.")]),
        act("Lost & Found Board", [small("Looking for a school friend? Leave a sticky note saying who. Someone in the hall may know exactly where they are.")]),
        act("Music from Our School Days", [small("The famous school light music band brings the old songs back.")]),
        act("Nostalgia Touches", [
          dash([
            "**The School Bell:** A real school bell rings at the start of the day, at Assembly, at lunch, and at the final “Bye Bye”.",
            "**Old Photo Wall:** Bring a school-days photograph, pin it up, and let others find themselves in it.",
            "**Class Photo Recreation:** Line up in the same rows and the same poses as your old class photo.",
            "**Teacher’s Attendance Call:** Batch names are called out during the day. Say “Present, Ma’am!” when yours is read.",
          ]),
        ]),
      ],
      { name: "Activities", tablet: { gridTemplateColumns: "minmax(0, 1fr)" } }
    ),
    c("box", {}, { backgroundColor: "rgba(0,0,0,.25)", borderColor: mix(GOLD, 45), borderRadius: "16px", padding: "40px", marginTop: "14px", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "28px" }, [
      col(
        [
          c("heading", { text: "Why You Should Be There", level: "h3" }, { fontSize: "40px", fontWeight: "400", color: GOLD }, undefined, { mobile: { fontSize: "30px" } }),
          body(
            "Some of your school friends will be in that hall, and some are looking for you. The prayer song, the pledge, the bell, and the photo with your teacher can’t be recreated later, and they can’t be watched on a screen. Register now, so you’re not hearing about it afterwards.",
            { color: mix(CREAM, 88), fontSize: "16px", maxWidth: "660px" }
          ),
        ],
        { flex: "1 1 480px", gap: "12px" }
      ),
      pill("Register Now  →", "#register", "gold"),
    ]),
  ];
}
