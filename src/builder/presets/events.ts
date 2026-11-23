import type { TBNode } from "../types";
import { createNode as c } from "../registry";
import { section, container, centerHeader } from "./helpers";

/* Sections that show live event data (speakers, sponsors, tickets, agenda). */

const eventSection = (badge: string, title: string, sub: string, type: string, props: Record<string, unknown>, name: string, surface = false): TBNode =>
  section([container([...centerHeader(badge, title, sub), c(type, props as TBNode["props"])])], { padding: "96px 24px", ...(surface ? { backgroundColor: "var(--tb-surface)" } : {}) }, name);

export const speakersSection = () => eventSection("Speakers", "Meet our speakers", "Industry leaders sharing what they know.", "speakers", { layout: "grid", columns: 4 }, "Speakers");
export const sponsorsSection = () => eventSection("Sponsors", "Our sponsors", "Thank you to the partners who make this event possible.", "sponsors", { layout: "byTier" }, "Sponsors", true);
export const ticketsSection = () => eventSection("Tickets", "Get your tickets", "Pick the pass that suits you.", "tickets", { layout: "byCategory", columns: 3 }, "Tickets");
export const agendaSection = () => eventSection("Agenda", "Event agenda", "Talks, workshops and everything in between.", "sessions", { layout: "tabs" }, "Agenda", true);
