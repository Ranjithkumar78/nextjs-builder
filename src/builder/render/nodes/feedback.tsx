import { createElement, type CSSProperties } from "react";
import { richHtml } from "../../lib/html";
import { num, str } from "../../lib/values";
import { Icon } from "../../ui/Icon";
import type { Renderer } from "../types";

/** Stars filled to the rating with a gradient clipped to the text, so halves and decimals show. */
const rating: Renderer = ({ p, attrs }) => {
  const max = Math.max(1, Math.min(10, Math.round(num(p.max, 5))));
  const value = Math.max(0, Math.min(max, num(p.value, 0)));
  return createElement(
    "div",
    { ...attrs, role: "img", "aria-label": `${value} out of ${max}` },
    <span className="tb-stars" style={{ "--tb-rating": `${(value / max) * 100}%` } as CSSProperties} aria-hidden="true">
      {"★".repeat(max)}
    </span>,
    p.label ? <span className="tb-rating-label">{str(p.label)}</span> : null,
  );
};

const ALERT_ICONS: Record<string, string> = { info: "info", success: "checkCircle", warning: "alert", error: "alert" };

const alert: Renderer = ({ p, attrs, text }) => {
  const tone = ALERT_ICONS[str(p.tone)] ? str(p.tone) : "info";
  return createElement(
    "div",
    { ...attrs, className: `${attrs.className} tb-alert--${tone}`, role: tone === "error" || tone === "warning" ? "alert" : "status", "data-tb-dismissable": "" },
    <Icon name={ALERT_ICONS[tone]} size="1.25em" className="tb-alert-icon" />,
    <div className="tb-alert-body">
      {p.title ? <strong className="tb-alert-title">{str(p.title)}</strong> : null}
      {text("div", { className: "tb-alert-text" })}
    </div>,
    p.dismissible ? (
      <button type="button" className="tb-dismiss" data-tb-dismiss="" aria-label="Close">
        <Icon name="close" size="16" />
      </button>
    ) : null,
  );
};

/** "a | b | c" per line; the first line can be the header. Cells support **bold** and *accent*. */
const table: Renderer = ({ p, attrs }) => {
  const rows = str(p.rows)
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => l.split("|").map((c) => c.trim()));
  const [head, ...body] = p.header ? rows : [null, ...rows];
  const cells = (row: string[], Tag: "th" | "td") => row.map((c, i) => <Tag key={i} dangerouslySetInnerHTML={{ __html: richHtml(c) }} />);
  return createElement(
    "div",
    { ...attrs, className: `${attrs.className} tb-table-wrap` },
    <table className={`tb-table${p.striped ? " tb-table--striped" : ""}`}>
      {head ? (
        <thead>
          <tr>{cells(head, "th")}</tr>
        </thead>
      ) : null}
      <tbody>
        {body.map((r, i) => (
          <tr key={i}>{cells(r as string[], "td")}</tr>
        ))}
      </tbody>
    </table>,
  );
};

export const FEEDBACK_RENDERERS: Record<string, Renderer> = { rating, alert, table };
