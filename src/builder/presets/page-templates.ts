import type { TBNode } from "../types";
import { pageTitle, heroCentered, cta } from "./heroes";
import { features, testimonials } from "./marketing";
import { pricing } from "./pricing";
import { aboutContent, contact, faq } from "./content";

/** Starting content offered when a new page is created. */
export const PAGE_TEMPLATES: { id: string; label: string; build: (name: string) => TBNode[] }[] = [
  { id: "blank", label: "Blank page", build: () => [] },
  { id: "title", label: "Title + content", build: (n) => [pageTitle(n, "Describe what this page is about."), aboutContent()] },
  { id: "landing", label: "Landing page", build: () => [heroCentered(), features(), testimonials(), cta()] },
  { id: "pricing", label: "Pricing page", build: (n) => [pageTitle(n, "Plans for every team."), pricing(), faq()] },
  { id: "contact", label: "Contact page", build: (n) => [pageTitle(n, "Get in touch."), contact()] },
];
