import { createElement } from "react";
import type { LinkItem } from "../../types";
import { NEW_TAB } from "../../lib/html";
import { str } from "../../lib/values";
import { Icon } from "../../ui/Icon";
import type { RenderArgs, Renderer } from "../types";

const linksOf = (v: unknown): LinkItem[] => (Array.isArray(v) ? (v as LinkItem[]) : []);

/** A menu link; links with sub-links become a dropdown. */
function MenuLink({ l, href }: { l: LinkItem; href: RenderArgs["href"] }) {
  const sub = linksOf(l.children);
  if (!sub.length) return <a href={href(l.href)}>{l.label}</a>;
  return (
    <div className="tb-menu-item">
      <a href={href(l.href)} aria-haspopup="true">
        {l.label}
        <Icon name="chevronDown" size="14" />
      </a>
      <div className="tb-submenu">
        {sub.map((c, i) => (
          <a key={i} href={href(c.href)}>
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/** Site menu. With "mobile menu" on, small screens get a ☰ button that opens the links. */
const navmenu: Renderer = ({ p, attrs, href }) => {
  const items = linksOf(p.links).map((l, i) => <MenuLink key={i} l={l} href={href} />);
  if (!p.mobileMenu) return createElement("nav", attrs, items);
  const at = str(p.collapseAt, "mobile") === "tablet" ? "tablet" : "mobile";
  return createElement(
    "nav",
    { ...attrs, className: `${attrs.className} tb-menu`, "data-collapse": at },
    <button type="button" className="tb-menu-toggle" data-tb-menu-toggle="" aria-label="Open menu" aria-expanded="false">
      <Icon name="nav" size="24" />
    </button>,
    <div className="tb-menu-links">{items}</div>,
  );
};

/** Social links: label, icon + label, or icon only (the label then becomes the accessible name). */
const socials: Renderer = ({ p, attrs, href }) =>
  createElement(
    "div",
    attrs,
    linksOf(p.links).map((l, i) =>
      l.icon ? (
        <a key={i} href={href(l.href)} {...NEW_TAB} className="tb-social-icon" aria-label={p.iconsOnly ? l.label : undefined} title={p.iconsOnly ? l.label : undefined}>
          <Icon name={l.icon} size="1.15em" />
          {p.iconsOnly ? null : l.label}
        </a>
      ) : (
        <a key={i} href={href(l.href)} {...NEW_TAB}>
          {l.label}
        </a>
      ),
    ),
  );

export const NAVIGATION_RENDERERS: Record<string, Renderer> = { navmenu, socials };
