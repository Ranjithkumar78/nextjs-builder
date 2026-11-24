import { createElement, type CSSProperties } from "react";
import { NEW_TAB } from "../../lib/html";
import { SHARE_LABELS, SHARE_URLS, whatsappUrl, type ShareNetwork } from "../../lib/share";
import { num, str } from "../../lib/values";
import { Icon } from "../../ui/Icon";
import type { Attrs, RenderArgs, Renderer } from "../types";

/** Floating buttons stay in place in the editor and float on the published page. */
function floatAttrs({ p, rc }: RenderArgs): Attrs {
  if (!p.floating || rc.edit) return {};
  return { "data-tb-float": str(p.side, "right") === "left" ? "left" : "right", style: { "--tb-fy": `${num(p.bottom, 24)}px` } as CSSProperties };
}

const CLOSE = (
  <button type="button" className="tb-dismiss" data-tb-dismiss="" aria-label="Close">
    <Icon name="close" size="16" />
  </button>
);

const announcement: Renderer = ({ p, attrs, text, href }) =>
  createElement(
    "div",
    { ...attrs, "data-tb-dismissable": "" },
    text("span", {}),
    p.linkText ? (
      <a className="tb-announce-link" href={href(p.href)}>
        {str(p.linkText)}
      </a>
    ) : null,
    p.dismissible ? CLOSE : null,
  );

const backtotop: Renderer = (a) =>
  createElement(
    "a",
    { ...a.attrs, ...floatAttrs(a), href: "#", "data-tb-totop": "", "aria-label": "Back to top" },
    <Icon name="up" size="20" />,
    a.p.label ? <span>{str(a.p.label)}</span> : null,
  );

const NETWORKS = Object.keys(SHARE_LABELS) as ShareNetwork[];

/** Without the script the links still open the network's share page (just without the page address). */
const share: Renderer = ({ p, attrs }) =>
  createElement(
    "div",
    attrs,
    p.label ? <span className="tb-share-label">{str(p.label)}</span> : null,
    NETWORKS.filter((n) => p[n]).map((n) =>
      n === "copy" ? (
        <button key={n} type="button" className="tb-share-btn" data-tb-copy="">
          {SHARE_LABELS[n]}
        </button>
      ) : (
        <a key={n} className="tb-share-btn" data-tb-share={SHARE_URLS[n]} href={SHARE_URLS[n].replace(/\{(url|title)\}/g, "")} {...NEW_TAB}>
          {SHARE_LABELS[n]}
        </a>
      ),
    ),
  );

const whatsapp: Renderer = (a) =>
  createElement(
    "a",
    { ...a.attrs, ...floatAttrs(a), href: whatsappUrl(str(a.p.phone), str(a.p.message)), ...NEW_TAB, "aria-label": str(a.p.label) || "Chat on WhatsApp" },
    <Icon name="chat" size="1.25em" />,
    a.p.label ? <span>{str(a.p.label)}</span> : null,
  );

export const ENGAGE_RENDERERS: Record<string, Renderer> = { announcement, backtotop, share, whatsapp };
