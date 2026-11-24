import { createElement } from "react";
import { googleCalendarUrl, icsDataUrl, outlookCalendarUrl, type CalendarEvent } from "../../lib/calendar";
import { NEW_TAB } from "../../lib/html";
import { slugify, str } from "../../lib/values";
import { Icon } from "../../ui/Icon";
import type { Renderer } from "../types";

/** Add-to-calendar links; they work without a script (the .ics file is a data: URL). */
const calendar: Renderer = ({ p, attrs }) => {
  const e: CalendarEvent = { title: str(p.title), start: str(p.start), end: str(p.end), location: str(p.location), details: str(p.details) };
  return createElement(
    "div",
    attrs,
    p.label ? (
      <span className="tb-share-label">
        <Icon name="calendar" size="1.1em" /> {str(p.label)}
      </span>
    ) : null,
    p.google ? (
      <a className="tb-share-btn" href={googleCalendarUrl(e)} {...NEW_TAB}>
        Google
      </a>
    ) : null,
    p.outlook ? (
      <a className="tb-share-btn" href={outlookCalendarUrl(e)} {...NEW_TAB}>
        Outlook
      </a>
    ) : null,
    p.ics ? (
      <a className="tb-share-btn" href={icsDataUrl(e)} download={`${slugify(e.title, "event")}.ics`}>
        Apple / .ics
      </a>
    ) : null,
  );
};

export const CALENDAR_RENDERERS: Record<string, Renderer> = { calendar };
