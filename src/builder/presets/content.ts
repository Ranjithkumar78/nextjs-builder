import type { TBNode } from "../types";
import { createNode as c, placeholderImage } from "../registry";
import { section, container, centerHeader, grid } from "./helpers";

/* FAQ, team, gallery, contact and about sections. */

export function faq(): TBNode {
  const q = (t: string, a: string, open = false) => c("accordion-item", { title: t, open }, {}, [c("text", { text: a }, { fontSize: "15px" })]);
  return section(
    [
      container(
        [
          ...centerHeader("FAQ", "Frequently asked questions", "Can't find the answer you're looking for? Reach out to our team."),
          c("accordion", { single: true }, {}, [
            q("Is it really free?", "Yes. Everything runs in your browser and your themes are saved locally.", true),
            q("Can I export my site?", "Export a single page as HTML or the entire theme as a ZIP of static files."),
            q("Does it work on mobile?", "Every element can have separate tablet and mobile styles."),
          ]),
        ],
        { maxWidth: "780px", gap: "12px" }
      ),
    ],
    { padding: "96px 24px" },
    "FAQ"
  );
}

export function team(): TBNode {
  const m = (name: string, role: string) =>
    c("column", {}, { gap: "6px", minWidth: "0" }, [
      c("image", { src: placeholderImage(name, 600, 600), alt: name }, { aspectRatio: "1 / 1", marginBottom: "8px" }),
      c("heading", { text: name, level: "h4" }, { fontSize: "18px" }),
      c("text", { text: role }, { fontSize: "14px" }),
    ]);
  return section([container([...centerHeader("Team", "Meet the people behind it", "A small team with big ideas."), grid(4, [m("Alex Kim", "CEO"), m("Sara Patel", "Design"), m("John Doe", "Engineering"), m("Mia Wong", "Marketing")])])], { padding: "96px 24px" }, "Team");
}

export function gallery(): TBNode {
  return section(
    [container([...centerHeader("Gallery", "Our recent work", "A few highlights from projects we are proud of."), grid(3, [1, 2, 3, 4, 5, 6].map((i) => c("image", { src: placeholderImage(`Project ${i}`, 800, 600), alt: `Project ${i}` }, { aspectRatio: "4 / 3" })), { gap: "16px" })])],
    { padding: "96px 24px" },
    "Gallery"
  );
}

export function contact(): TBNode {
  return section(
    [
      container([
        c("row", {}, { gap: "48px", alignItems: "flex-start" }, [
          c("column", {}, { gap: "14px", minWidth: "280px" }, [
            c("badge", { text: "Contact" }),
            c("heading", { text: "Let's talk", level: "h2" }, { fontSize: "40px" }),
            c("text", { text: "Have a project in mind? Fill out the form and we will get back to you within one business day." }),
            c("list", { items: ["📧 hello@example.com", "📞 +91 98765 43210", "📍 Chennai, India"] }, { listStyleType: "none", paddingLeft: "0", gap: "10px" }),
          ]),
          c("column", {}, { minWidth: "300px" }, [
            c("form", {}, { padding: "28px", backgroundColor: "var(--tb-surface)", borderRadius: "var(--tb-radius)", borderWidth: "1px", borderStyle: "solid", borderColor: "var(--tb-border)" }, [
              c("input", { label: "Name", name: "name", inputType: "text", placeholder: "Your name" }),
              c("input", { label: "Email", name: "email", inputType: "email", placeholder: "you@example.com" }),
              c("textarea", { label: "Message", name: "message" }),
              c("submit", { text: "Send message" }),
            ]),
          ]),
        ]),
      ]),
    ],
    { padding: "96px 24px" },
    "Contact",
    { padding: "64px 20px" }
  );
}

export function aboutContent(): TBNode {
  return section(
    [
      container([
        c("row", {}, { gap: "48px", alignItems: "center" }, [
          c("column", {}, { minWidth: "300px" }, [c("image", { src: placeholderImage("About us", 800, 600), alt: "About" }, { aspectRatio: "4 / 3" })]),
          c("column", {}, { gap: "14px", minWidth: "300px" }, [
            c("badge", { text: "Our story" }),
            c("heading", { text: "We help people build for the web", level: "h2" }, { fontSize: "38px" }),
            c("text", { text: "Founded in 2026, we believe anyone should be able to design a professional website. Our builder gives you full control without the complexity." }),
            c("text", { text: "Today, thousands of freelancers, agencies and businesses use it to launch faster." }),
          ]),
        ]),
      ]),
    ],
    { padding: "96px 24px" },
    "About"
  );
}
