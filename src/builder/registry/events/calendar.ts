import type { ComponentDef } from "../types";

export const CALENDAR: ComponentDef = {
  type: "calendar",
  label: "Add to calendar",
  category: "Event data",
  icon: "calendar",
  defaultProps: {
    title: "Alumni Meetup 2026",
    start: "2026-12-27T08:00:00+05:30",
    end: "2026-12-27T17:00:00+05:30",
    location: "Chennai, India",
    details: "See you there!",
    label: "Add to calendar:",
    google: true,
    outlook: true,
    ics: true,
  },
  defaultStyles: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", fontSize: "14px" },
  fields: [
    { key: "title", label: "Event title", type: "text" },
    { key: "start", label: "Starts (date & time)", type: "text", placeholder: "2026-12-27T08:00:00+05:30", help: "Format: YYYY-MM-DDTHH:MM:SS+05:30" },
    { key: "end", label: "Ends (date & time)", type: "text", help: "Leave empty for one hour after the start." },
    { key: "location", label: "Location", type: "text" },
    { key: "details", label: "Description", type: "textarea" },
    { key: "label", label: "Label", type: "text" },
    { key: "google", label: "Google Calendar", type: "toggle" },
    { key: "outlook", label: "Outlook", type: "toggle" },
    { key: "ics", label: "Apple / other (.ics file)", type: "toggle" },
  ],
};
