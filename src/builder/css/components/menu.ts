import type { QueryMode } from "../declarations";
import { atMost } from "../responsive";

/** Dropdown sub-links (desktop: on hover/focus). */
function dropdownRules(r: string): string {
  return `:where(${r}) .tb-menu-item{position:relative;display:inline-flex;align-items:center}
:where(${r}) .tb-menu-item>a{display:inline-flex;align-items:center;gap:4px}
:where(${r}) .tb-menu-item>a svg{width:14px;height:14px}
:where(${r}) .tb-submenu{position:absolute;top:100%;left:0;z-index:60;display:none;flex-direction:column;gap:2px;min-width:200px;padding:8px;background:var(--tb-background);color:var(--tb-text);border:1px solid var(--tb-border);border-radius:var(--tb-radius);box-shadow:0 12px 32px -12px rgba(0,0,0,.25)}
:where(${r}) .tb-submenu a{padding:8px 10px;border-radius:6px;white-space:nowrap}
:where(${r}) .tb-menu-item:hover>.tb-submenu,:where(${r}) .tb-menu-item:focus-within>.tb-submenu{display:flex}
`;
}

/** Collapsed menu: a ☰ button that opens the links as a panel (data-open is set by the runtime script). */
function collapsedRules(r: string, at: string): string {
  const m = `:where(${r}) .tb-menu[data-collapse="${at}"]`;
  return `${m}>.tb-menu-toggle{display:inline-flex}
${m}>.tb-menu-links{display:none;position:absolute;top:100%;right:0;z-index:60;flex-direction:column;align-items:stretch;gap:4px;min-width:220px;padding:12px;background:var(--tb-background);color:var(--tb-text);border:1px solid var(--tb-border);border-radius:var(--tb-radius);box-shadow:0 16px 40px -16px rgba(0,0,0,.3)}
${m}[data-open]>.tb-menu-links{display:flex}
${m} .tb-menu-links a{padding:8px 10px}
${m} .tb-menu-item{flex-direction:column;align-items:stretch}
${m} .tb-submenu{position:static;display:flex;min-width:0;padding:0 0 0 12px;border:0;box-shadow:none;background:none;color:inherit}`;
}

/** Menu (hamburger on small screens, dropdown sub-links) and social links with icons. */
export function menuRules(r: string, mode: QueryMode): string {
  return (
    `:where(${r}) .tb-menu{position:relative}
:where(${r}) .tb-menu-toggle{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:var(--tb-radius);background:transparent;color:inherit;cursor:pointer}
:where(${r}) .tb-menu-toggle svg{width:24px;height:24px}
:where(${r}) .tb-menu-links{display:contents}
:where(${r}) .tb-social-icon{display:inline-flex;align-items:center;gap:6px}
:where(${r}) .tb-social-icon svg{width:1.15em;height:1.15em;flex-shrink:0}
` +
    dropdownRules(r) +
    atMost(mode, "tablet", collapsedRules(r, "tablet")) +
    atMost(mode, "mobile", collapsedRules(r, "mobile"))
  );
}
