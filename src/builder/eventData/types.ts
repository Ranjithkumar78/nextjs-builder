/** Event data that the Speakers, Sponsors, Tickets and Sessions components can show. */
export type EventSource = "speakers" | "sponsors" | "tickets" | "sessions";
export const EVENT_SOURCES: EventSource[] = ["speakers", "sponsors", "tickets", "sessions"];

export interface Speaker {
  id: string;
  name: string;
  photo: string;
  designation: string;
  organisation: string;
  bio: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
  tier: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  /** null = free */
  price: number | null;
  basePrice: number;
  offer: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: string;
  remaining: number | null;
  total: number | null;
  soldOut: boolean;
  category: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  tickets: Ticket[];
}

export interface SessionPerson {
  id: string;
  name: string;
  photo: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  duration: number;
  track: string;
  trackColor: string;
  hall: string;
  speakers: SessionPerson[];
  moderators: SessionPerson[];
}

export interface SessionDay {
  day: string;
  label: string;
  sessions: Session[];
}

export interface EventDataMap {
  speakers: Speaker[];
  sponsors: Sponsor[];
  tickets: TicketCategory[];
  sessions: SessionDay[];
}

export type LoadState<T> = { status: "idle" | "loading" } | { status: "ready"; data: T } | { status: "error"; error: string };
