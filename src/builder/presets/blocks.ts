import type { TBNode } from "../types";
import { navbar, footer, simpleFooter } from "./navigation";
import { heroCentered, heroSplit, pageTitle, cta } from "./heroes";
import { features, stats, testimonials } from "./marketing";
import { pricing } from "./pricing";
import { aboutContent, contact, faq, gallery, team } from "./content";
import { agendaSection, speakersSection, sponsorsSection, ticketsSection } from "./events";
import { animatedStats, announcementBar, heroSlider, photoGallery } from "./interactive";

export interface BlockPreset {
  id: string;
  label: string;
  icon: string;
  build: () => TBNode;
}

/** Ready-made sections listed under Add → Blocks. */
export const BLOCKS: BlockPreset[] = [
  { id: "ev-speakers", label: "Speakers (live)", icon: "mic", build: speakersSection },
  { id: "ev-sponsors", label: "Sponsors (live)", icon: "award", build: sponsorsSection },
  { id: "ev-tickets", label: "Tickets (live)", icon: "ticket", build: ticketsSection },
  { id: "ev-agenda", label: "Agenda (live)", icon: "calendar", build: agendaSection },
  { id: "announcement", label: "Announcement bar", icon: "megaphone", build: announcementBar },
  { id: "navbar", label: "Navbar", icon: "header", build: navbar },
  { id: "hero", label: "Hero centered", icon: "hero", build: heroCentered },
  { id: "hero-split", label: "Hero split", icon: "row", build: heroSplit },
  { id: "hero-slider", label: "Hero slider", icon: "slider", build: heroSlider },
  { id: "page-title", label: "Page title", icon: "heading", build: () => pageTitle("Page title", "A short description of this page.") },
  { id: "features", label: "Features", icon: "grid", build: features },
  { id: "about", label: "About / content", icon: "image", build: aboutContent },
  { id: "stats", label: "Stats", icon: "chart", build: stats },
  { id: "stats-animated", label: "Animated stats", icon: "hash", build: animatedStats },
  { id: "testimonials", label: "Testimonials", icon: "quote", build: testimonials },
  { id: "pricing", label: "Pricing", icon: "pricing", build: pricing },
  { id: "team", label: "Team", icon: "users", build: team },
  { id: "gallery", label: "Gallery", icon: "image", build: gallery },
  { id: "photo-gallery", label: "Photo gallery (lightbox)", icon: "images", build: photoGallery },
  { id: "faq", label: "FAQ (accordion)", icon: "help", build: faq },
  { id: "cta", label: "Call to action", icon: "star", build: cta },
  { id: "contact", label: "Contact form", icon: "mail", build: contact },
  { id: "footer", label: "Footer", icon: "footer", build: footer },
  { id: "footer-simple", label: "Simple footer", icon: "footer", build: simpleFooter },
];
