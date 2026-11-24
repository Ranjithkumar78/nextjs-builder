import { createElement, type CSSProperties } from "react";
import { richHtml } from "../../lib/html";
import { formatCount, num, str } from "../../lib/values";
import { Icon } from "../../ui/Icon";
import type { Renderer } from "../types";

/** Icon (sized by the element's font size), optionally a link. */
const icon: Renderer = ({ p, attrs, href }) => {
  const svg = <Icon name={str(p.icon, "star")} size="1em" />;
  const label = str(p.label) || undefined;
  if (p.href) return createElement("a", { ...attrs, href: href(p.href), "aria-label": label }, svg);
  return createElement("span", { ...attrs, role: label ? "img" : undefined, "aria-label": label, "aria-hidden": label ? undefined : true }, svg);
};

const iconlist: Renderer = ({ p, attrs }) => {
  const items = Array.isArray(p.items) ? (p.items as string[]) : [];
  return createElement(
    "ul",
    attrs,
    items.map((it, i) => (
      <li key={i}>
        <span className="tb-il-icon" style={{ color: str(p.iconColor) || undefined }}>
          <Icon name={str(p.icon, "check")} size="1.1em" />
        </span>
        <span dangerouslySetInnerHTML={{ __html: richHtml(str(it)) }} />
      </li>
    )),
  );
};

/** Shows the final number (right without a script and in exports); the runtime counts up to it when visible. */
const counter: Renderer = ({ p, attrs }) => {
  const end = num(p.end, 0);
  const sep = p.separator !== false;
  return createElement(
    "div",
    { ...attrs, "data-tb-count": end, "data-from": num(p.start, 0), "data-duration": num(p.duration, 2000), "data-sep": sep ? "1" : "0" },
    str(p.prefix),
    <span className="tb-count-num">{formatCount(end, sep)}</span>,
    str(p.suffix),
  );
};

/** The bar grows in when it scrolls into view (data-tb-reveal). */
const progress: Renderer = ({ p, attrs }) => {
  const value = Math.max(0, Math.min(100, num(p.value, 0)));
  return createElement(
    "div",
    { ...attrs, "data-tb-reveal": "", role: "progressbar", "aria-valuenow": value, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": str(p.label) || undefined },
    <div className="tb-progress-head">
      <span>{str(p.label)}</span>
      {p.showValue ? <span>{value}%</span> : null}
    </div>,
    <div className="tb-progress-track">
      <div className="tb-progress-bar" style={{ width: `${value}%`, background: str(p.barColor) || undefined } as CSSProperties} />
    </div>,
  );
};

export const WIDGET_RENDERERS: Record<string, Renderer> = { icon, iconlist, counter, progress };
