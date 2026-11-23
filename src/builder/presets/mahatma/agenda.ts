import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, CREAM, SOFT, mix, eyebrow, body, row, col } from "./helpers";

const item = (time: string, title: string, desc: string) =>
  row(
    [
      col(
        [
          c("text", { text: "SUN 27 DEC" }, { fontSize: "11px", letterSpacing: "2px", fontWeight: "600", color: SOFT }),
          c("heading", { text: time, level: "p" }, { fontSize: "28px", fontWeight: "400", color: CREAM }),
        ],
        { flex: "0 0 250px", minWidth: "0", gap: "4px" }
      ),
      col(
        [
          c("heading", { text: title, level: "h3" }, { fontSize: "35px", fontWeight: "400", color: CREAM }, undefined, { mobile: { fontSize: "26px" } }),
          body(desc, { color: SOFT, fontSize: "14px" }),
        ],
        { flex: "1 1 0", minWidth: "260px", gap: "6px" }
      ),
    ],
    { padding: "24px 0", gap: "24px", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: mix(CREAM, 12) }
  );

/** Heading, day tabs and the first agenda items of the day. */
export function agenda(): TBNode[] {
  return [
    eyebrow("Agenda & all-day activities", GOLD),
    c("heading", { text: "The Homecoming", level: "h2" }, { fontSize: "66px", fontWeight: "400", fontStyle: "italic", color: GOLD }, undefined, { mobile: { fontSize: "42px" } }),
    row(
      [
        c("text", { text: "25 & 26 Dec" }, { fontSize: "14px", color: SOFT, paddingBottom: "14px" }),
        c("text", { text: "Sun 27 Dec" }, { fontSize: "14px", color: CREAM, paddingBottom: "12px", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: GOLD }),
      ],
      { gap: "36px", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: mix(CREAM, 15), marginTop: "18px", alignItems: "flex-end" }
    ),
    item("8:00 AM", "Walk back in.", "Register, find your school friends, and strike your first pose at the photobooths. The school bell rings, and the day begins."),
    item("8:45 AM", "Assembly.", "Fall in line, just like the old days."),
    item("9:00 AM", "Good Morning, Everyone!", "Welcome by the MC."),
    item("9:03 AM", "The Prayer Song", "Sung together again, the way we sang it every morning."),
    c("button", { text: "View all agenda  ↓", href: "#schedule" }, { alignSelf: "center", marginTop: "28px", backgroundColor: "transparent", color: CREAM, borderWidth: "1px", borderStyle: "solid", borderColor: mix(CREAM, 55), borderRadius: "999px", padding: "12px 48px", fontWeight: "500" }, undefined, {
      hover: { backgroundColor: mix(CREAM, 10) },
    }),
  ];
}
