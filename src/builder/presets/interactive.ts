import type { TBNode } from "../types";
import { createNode as c, placeholderImage } from "../registry";
import { centerHeader, container, grid, section } from "./helpers";

/* Blocks built from the interactive components: hero slider, gallery, animated stats, announcement bar. */

export function heroSlider(): TBNode {
  const slide = (title: string, sub: string, bg: string) =>
    c("slide", {}, { minHeight: "460px", alignItems: "center", textAlign: "center", padding: "64px 32px", color: "#ffffff", backgroundImage: bg, backgroundSize: "cover", backgroundPosition: "center" }, [
      c("heading", { text: title, level: "h2" }, { fontSize: "52px", color: "#ffffff" }, undefined, { mobile: { fontSize: "32px" } }),
      c("text", { text: sub }, { fontSize: "19px", color: "rgba(255,255,255,.9)", maxWidth: "620px" }),
      c("button", { text: "Learn more", href: "#" }, { alignSelf: "center", backgroundColor: "#ffffff", color: "var(--tb-primary)" }),
    ]);
  return section(
    [
      c("slider", { autoplay: 6 }, {}, [
        slide("Welcome to the event", "Two days of talks, workshops and new friends.", "linear-gradient(135deg, var(--tb-primary), var(--tb-secondary))"),
        slide("Meet the speakers", "Learn from the people building what comes next.", "linear-gradient(135deg, #0f172a, var(--tb-primary))"),
        slide("Book your seat", "Early-bird prices end soon.", "linear-gradient(135deg, var(--tb-secondary), #0f172a)"),
      ]),
    ],
    { padding: "0" },
    "Hero slider",
  );
}

export function photoGallery(): TBNode {
  const images = [1, 2, 3, 4, 5, 6].map((i) => placeholderImage(`Photo ${i}`, 800, 600));
  return section([container([...centerHeader("Gallery", "Moments from last year", "Click any photo to see it full screen."), c("gallery", { images })])], { padding: "96px 24px" }, "Gallery");
}

export function animatedStats(): TBNode {
  const stat = (end: number, suffix: string, label: string, delay: number) =>
    c("column", { animation: "fade-up", animationDelay: String(delay) }, { alignItems: "center", gap: "6px", minWidth: "0" }, [c("counter", { end, suffix }), c("text", { text: label }, { fontSize: "15px", textAlign: "center" })]);
  return section(
    [container([grid(4, [stat(2500, "+", "Attendees", 0), stat(60, "+", "Speakers", 100), stat(40, "", "Workshops", 200), stat(98, "%", "Would come again", 300)])])],
    { padding: "72px 24px", backgroundColor: "var(--tb-surface)" },
    "Animated stats",
  );
}

export function announcementBar(): TBNode {
  return c("announcement", {}, {}, undefined, { name: "Announcement bar" });
}
