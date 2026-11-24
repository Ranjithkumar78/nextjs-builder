/** Add-to-calendar links for an event (Google, Outlook, and an .ics file for Apple/other calendars). */
export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  location: string;
  details: string;
}

/** "2026-12-27T08:00:00+05:30" -> "20261227T023000Z"; empty when the date is invalid. */
function utcStamp(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** The end time, or one hour after the start when none is given. */
function endOf(e: CalendarEvent): string {
  if (e.end && !isNaN(new Date(e.end).getTime())) return e.end;
  const start = new Date(e.start);
  return isNaN(start.getTime()) ? "" : new Date(start.getTime() + 3600000).toISOString();
}

export function googleCalendarUrl(e: CalendarEvent): string {
  const q = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${utcStamp(e.start)}/${utcStamp(endOf(e))}`, details: e.details, location: e.location });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function outlookCalendarUrl(e: CalendarEvent): string {
  const iso = (v: string) => (isNaN(new Date(v).getTime()) ? "" : new Date(v).toISOString());
  const q = new URLSearchParams({ path: "/calendar/action/compose", rru: "addevent", subject: e.title, startdt: iso(e.start), enddt: iso(endOf(e)), body: e.details, location: e.location });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${q}`;
}

/** An .ics file as a data: URL (download it to add the event to Apple Calendar and others). */
export function icsDataUrl(e: CalendarEvent): string {
  const esc = (v: string) => v.replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Theme Builder//EN",
    "BEGIN:VEVENT",
    `UID:${utcStamp(e.start)}-${e.title.length}@theme-builder`,
    `DTSTAMP:${utcStamp(e.start)}`,
    `DTSTART:${utcStamp(e.start)}`,
    `DTEND:${utcStamp(endOf(e))}`,
    `SUMMARY:${esc(e.title)}`,
    `LOCATION:${esc(e.location)}`,
    `DESCRIPTION:${esc(e.details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
}
