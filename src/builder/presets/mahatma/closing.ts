import type { TBNode, StyleMap } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, TEAL, SURFACE, mix, HEAD, eyebrow, display, section, container, row, col } from "./helpers";

export function announce(label: string, htmlId: string, bg: StyleMap): TBNode {
  return section(label, [container([eyebrow(label), display("To be announced soon", 64, {}, GOLD, "h2", 38)])], { padding: "88px 24px", ...bg }, htmlId);
}

export function terms(): TBNode {
  const t = (n: string, title: string, items: string[]) =>
    row(
      [
        c("text", { text: n }, { fontFamily: HEAD, fontSize: "26px", color: GOLD, flex: "0 0 56px", lineHeight: "1.2" }),
        c("heading", { text: title, level: "h3" }, { fontSize: "27px", fontWeight: "400", flex: "0 0 300px", minWidth: "0", lineHeight: "1.2" }, undefined, { mobile: { flex: "1 1 200px" } }),
        c("list", { items }, { listStyleType: '"–   "', paddingLeft: "16px", gap: "10px", fontSize: "14.5px", color: "var(--tb-muted)", lineHeight: "1.65", flex: "1 1 320px" }),
      ],
      { padding: "34px 0", gap: "20px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: mix("var(--tb-text)", 14), alignItems: "flex-start" }
    );
  return section(
    "Terms & conditions",
    [
      container(
        [
          row(
            [
              col([eyebrow("Terms & conditions"), display("THE BORING BUT\nIMPORTANT BIT", 60, { lineHeight: "1.05" }, GOLD, "h2", 36)], { flex: "1 1 380px", gap: "16px" }),
              col(
                [
                  c("heading", { text: "We promise this is probably the least exciting section on the page.", level: "p" }, { fontSize: "20px", fontWeight: "400", lineHeight: "1.5" }),
                  c("heading", { text: "But it matters. A lot.", level: "p" }, { fontSize: "20px", fontWeight: "400" }),
                  c("text", { text: "SO PLEASE CONTINUE READING!!" }, { fontSize: "13px", fontWeight: "700", letterSpacing: "1.5px", color: TEAL }),
                ],
                { flex: "1 1 300px", gap: "8px", borderLeftWidth: "2px", borderLeftStyle: "solid", borderLeftColor: GOLD, paddingLeft: "24px" }
              ),
            ],
            { gap: "40px", alignItems: "center", marginBottom: "40px" }
          ),
          t("01", "Registration", ["Registration is mandatory for entry to the event.", "Each registration is valid only for the individual(s) registered.", "Please ensure that all information provided during registration is accurate and complete.", "The event is strictly for registered Mahatmites."]),
          t("02", "Payments", ["Registration fees are non-refundable, except where specifically stated under the applicable refund policy.", "Any applicable transaction or convenience fees will be communicated during the registration process."]),
          t("03", "Cancellation / Changes", ["The organizing team reserves the right to modify the event schedule, itinerary, activities, venue arrangements or other event details whenever necessary.", "Any significant changes will be communicated to attendees wherever reasonably possible.", "All registration fees and payments are strictly non-refundable."]),
          t("04", "Event Access", [
            "Entry will be permitted only to registered alumni.",
            "The event is strictly for registered Mahatmites. Non-alumni, unregistered guests or accompanying persons will not be permitted entry.",
            "The organizers reserve the right to deny entry or request an attendee to leave in circumstances involving disruptive, inappropriate, unsafe or intoxicated behaviour.",
            "Attendees found carrying, consuming, distributing or being under the influence of alcohol, recreational drugs or prohibited substances may be refused entry or asked to leave the venue immediately.",
            "No refund will be applicable in such circumstances.",
          ]),
          t("05", "Photography & Media", ["Photos and videos may be captured during the event and may be used for alumni communications, social media, websites and promotional purposes.", "Attendees are expected to respect the privacy and comfort of fellow alumni while taking photographs or videos.", "Any behaviour that violates the privacy, dignity or safety of others may result in removal from the premises."]),
          t("06", "Conduct & Safety", ["All attendees are expected to behave responsibly and respectfully throughout the event.", "Harassment, bullying, fighting, threatening behaviour, abusive language, discrimination or any form of inappropriate conduct will not be tolerated and will subject to legal action.", "The organizing team reserves the right to take appropriate action, including removal from the venue, against anyone violating the event’s code of conduct."]),
          t("07", "Alcohol & Prohibited Substances", ["Alcohol is strictly prohibited at the event venue.", "The possession, consumption, distribution or sale of alcohol or recreational drugs is strictly prohibited.", "Attendees must not arrive at the venue under the influence of alcohol, drugs or any intoxicating substance.", "Any violation may result in immediate removal from the venue without refund and may be reported to the appropriate authorities where required by law."]),
          t("08", "Liability", ["Attendees are responsible for their personal belongings throughout the event.", "The organizers will not be responsible for loss, theft or damage to personal belongings.", "Attendees are expected to comply with all reasonable safety instructions issued by the venue and organizing team."]),
          t("09", "Privacy", ["Information collected during registration will be used for event administration, communication and legitimate alumni community purposes, in accordance with the applicable privacy policy.", "By registering, attendees acknowledge that event photography and videography may take place."]),
          c("divider", {}, { borderTopColor: mix("var(--tb-text)", 14), marginTop: "0", marginBottom: "0" }),
        ],
        { maxWidth: "1000px", gap: "0" }
      ),
    ],
    { backgroundImage: `linear-gradient(90deg, ${SURFACE} 0%, var(--tb-background) 100%)` }
  );
}
