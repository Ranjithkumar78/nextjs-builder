"use client";

import { createElement, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type KeyboardEvent as RKeyboardEvent } from "react";
import type { LinkItem, TBNode, Zone } from "../types";
import { nodeClass } from "../css";
import { getDef } from "../registry";
import { EVENT_BLOCKS } from "./EventBlocks";
import type { EventSource } from "../eventData";

export interface RenderCtx {
  edit: boolean;
  zone?: Zone;
  editingId?: string | null;
  onTextCommit?: (id: string, key: string, text: string) => void;
  onTextDone?: () => void;
  mapHref?: (href: string) => string;
  /** The theme's Stutzee event, used by the Speakers, Sponsors, Tickets and Sessions blocks. */
  eventId?: string;
}

type Attrs = Record<string, unknown>;

const SINGLE_LINE = new Set(["button", "link", "badge", "submit", "logo"]);

function str(v: unknown, fallback = ""): string {
  return v === undefined || v === null ? fallback : String(v);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

/** Lightweight inline formatting: **bold**, *accent (italic)*, new lines. */
export function richHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([\s\S]+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

export function videoEmbed(url: string): { kind: "iframe" | "video"; src: string } {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  return { kind: "video", src: u };
}

export function mapEmbed(query: string, zoom: number): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom || 13}&output=embed`;
}

/** Text element whose content is managed through a ref so it can be edited with contentEditable. */
function EditableText({
  tag,
  attrs,
  text,
  editing,
  singleLine,
  onCommit,
  onDone,
}: {
  tag: string;
  attrs: Attrs;
  text: string;
  editing: boolean;
  singleLine: boolean;
  onCommit: (t: string) => void;
  onDone: () => void;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (editing) el.innerText = text;
    else el.innerHTML = richHtml(text);
  }, [text, editing]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !editing) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [editing]);

  const finish = () => {
    const el = ref.current;
    if (el) {
      const value = el.innerText.replace(/ /g, " ").replace(/\n$/, "");
      if (value !== text) onCommit(value);
    }
    onDone();
  };

  return createElement(tag, {
    ...attrs,
    ref,
    contentEditable: editing ? true : undefined,
    suppressContentEditableWarning: true,
    spellCheck: editing ? true : undefined,
    "data-editing": editing ? "true" : undefined,
    onBlur: editing ? finish : undefined,
    onKeyDown: editing
      ? (e: RKeyboardEvent<HTMLElement>) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            if (ref.current) ref.current.innerText = text;
            ref.current?.blur();
          } else if (e.key === "Enter" && (singleLine || !e.shiftKey)) {
            if (singleLine || e.metaKey || e.ctrlKey) {
              e.preventDefault();
              ref.current?.blur();
            }
          }
        }
      : undefined,
  });
}

export function NodeView({ node, rc }: { node: TBNode; rc: RenderCtx }): ReactNode {
  if (node.hidden && !rc.edit) return null;
  const def = getDef(node.type);
  const p = node.props;
  const extraClass = str(p.className).trim();
  const attrs: Attrs = {
    className: `${nodeClass(node.id)} tb-t-${node.type}${extraClass ? " " + extraClass : ""}`,
  };
  if (p.htmlId) attrs.id = str(p.htmlId);
  if (rc.edit) {
    attrs["data-node-id"] = node.id;
    attrs["data-zone"] = rc.zone;
    attrs["data-type"] = node.type;
    attrs.draggable = rc.editingId !== node.id;
    if (def.container) attrs["data-container"] = "true";
    if (node.hidden) attrs["data-hidden"] = "true";
  }

  const href = (h: unknown) => {
    const v = str(h, "#") || "#";
    return rc.mapHref ? rc.mapHref(v) : v;
  };
  const linkAttrs = (h: unknown, newTab: unknown): Attrs => ({
    href: href(h),
    ...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {}),
  });

  const text = (tag: string, a: Attrs, key = "text"): ReactNode => {
    const value = str(p[key]);
    if (!rc.edit) return createElement(tag, { ...a, dangerouslySetInnerHTML: { __html: richHtml(value) } });
    return (
      <EditableText
        tag={tag}
        attrs={a}
        text={value}
        editing={rc.editingId === node.id}
        singleLine={SINGLE_LINE.has(node.type)}
        onCommit={(t) => rc.onTextCommit?.(node.id, key, t)}
        onDone={() => rc.onTextDone?.()}
      />
    );
  };

  const kids = (): ReactNode => {
    const children = node.children ?? [];
    if (rc.edit && children.length === 0) {
      return (
        <div className="b-empty-drop" data-empty-for={node.id}>
          Drop components here
        </div>
      );
    }
    return children.map((c) => <NodeView key={c.id} node={c} rc={rc} />);
  };

  switch (node.type) {
    case "section":
      return createElement(str(p.tag, "section") || "section", attrs, kids());
    case "box":
      return createElement(str(p.tag, "div") || "div", attrs, kids());
    case "container":
    case "row":
    case "column":
    case "grid":
      return createElement("div", attrs, kids());
    case "form":
      return createElement(
        "form",
        {
          ...attrs,
          action: rc.edit ? undefined : str(p.action) || undefined,
          method: str(p.method, "post"),
          onSubmit: rc.edit ? (e: Event) => e.preventDefault() : undefined,
        },
        kids()
      );
    case "spacer":
      return createElement("div", { ...attrs, "aria-hidden": true });
    case "divider":
      return createElement("hr", attrs);
    case "heading":
      return text(str(p.level, "h2") || "h2", attrs);
    case "text":
      return text("p", attrs);
    case "badge":
      return text("span", attrs);
    case "button":
    case "link":
      return text("a", { ...attrs, ...linkAttrs(p.href, p.newTab) });
    case "submit":
      return text("button", { ...attrs, type: rc.edit ? "button" : "submit" });
    case "quote":
      return createElement(
        "blockquote",
        attrs,
        rc.edit ? (
          <EditableText
            tag="p"
            attrs={{}}
            text={str(p.text)}
            editing={rc.editingId === node.id}
            singleLine={false}
            onCommit={(t) => rc.onTextCommit?.(node.id, "text", t)}
            onDone={() => rc.onTextDone?.()}
          />
        ) : (
          <p dangerouslySetInnerHTML={{ __html: richHtml(str(p.text)) }} />
        ),
        p.cite ? <cite style={{ display: "block", marginTop: 10, fontSize: "0.8em", fontStyle: "normal", opacity: 0.75 }}>— {str(p.cite)}</cite> : null
      );
    case "list": {
      const items = Array.isArray(p.items) ? (p.items as string[]) : [];
      return createElement(
        p.ordered ? "ol" : "ul",
        { ...attrs, style: p.ordered ? undefined : undefined },
        items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: richHtml(str(it)) }} />)
      );
    }
    case "image": {
      const img = createElement("img", { ...attrs, src: str(p.src) || undefined, alt: str(p.alt), loading: "lazy", draggable: rc.edit ? true : undefined });
      if (!rc.edit && p.href) return <a href={href(p.href)} style={{ display: "contents" }}>{img}</a>;
      return img;
    }
    case "video": {
      const v = videoEmbed(str(p.url));
      return createElement(
        "div",
        attrs,
        <div className="tb-embed-ratio">
          {v.kind === "iframe" ? (
            <iframe src={v.src} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <video src={v.src} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      );
    }
    case "map":
      return createElement(
        "div",
        attrs,
        <div className="tb-embed-ratio">
          <iframe src={mapEmbed(str(p.query), Number(p.zoom) || 13)} title="Map" loading="lazy" />
        </div>
      );
    case "speakers":
    case "sponsors":
    case "tickets":
    case "sessions":
      return createElement(
        "div",
        attrs,
        createElement(EVENT_BLOCKS[node.type as EventSource], { nodeId: node.id, props: p, eventId: str(p.eventId).trim() || str(rc.eventId).trim(), edit: rc.edit })
      );
    case "countdown":
      return createElement("div", { ...attrs, "data-countdown": str(p.target) }, <Countdown target={str(p.target)} labels={p.showLabels !== false} />);
    case "embed":
      return createElement("div", { ...attrs, dangerouslySetInnerHTML: { __html: str(p.html) } });
    case "input":
      return createElement(
        "div",
        { ...attrs, className: `${attrs.className} tb-field` },
        p.label ? <label className="tb-field-label">{str(p.label)}</label> : null,
        <input className="tb-field-input" type={str(p.inputType, "text")} name={str(p.name)} placeholder={str(p.placeholder)} required={!!p.required && !rc.edit} readOnly={rc.edit} tabIndex={rc.edit ? -1 : undefined} />
      );
    case "textarea":
      return createElement(
        "div",
        { ...attrs, className: `${attrs.className} tb-field` },
        p.label ? <label className="tb-field-label">{str(p.label)}</label> : null,
        <textarea className="tb-field-input" name={str(p.name)} placeholder={str(p.placeholder)} rows={Number(p.rows) || 4} required={!!p.required && !rc.edit} readOnly={rc.edit} tabIndex={rc.edit ? -1 : undefined} />
      );
    case "select": {
      const items = Array.isArray(p.items) ? (p.items as string[]) : [];
      return createElement(
        "div",
        { ...attrs, className: `${attrs.className} tb-field` },
        p.label ? <label className="tb-field-label">{str(p.label)}</label> : null,
        <select className="tb-field-input" name={str(p.name)} tabIndex={rc.edit ? -1 : undefined}>
          {items.map((it, i) => (
            <option key={i}>{str(it)}</option>
          ))}
        </select>
      );
    }
    case "logo": {
      const inner = (
        <>
          {p.src ? <img src={str(p.src)} alt={str(p.text)} style={{ height: "1.6em", width: "auto" }} /> : null}
          {rc.edit ? (
            <EditableText
              tag="span"
              attrs={{}}
              text={str(p.text)}
              editing={rc.editingId === node.id}
              singleLine
              onCommit={(t) => rc.onTextCommit?.(node.id, "text", t)}
              onDone={() => rc.onTextDone?.()}
            />
          ) : (
            <span>{str(p.text)}</span>
          )}
        </>
      );
      return createElement("a", { ...attrs, href: href(p.href || "/") }, inner);
    }
    case "navmenu":
    case "socials": {
      const links = Array.isArray(p.links) ? (p.links as LinkItem[]) : [];
      const isSocial = node.type === "socials";
      return createElement(
        node.type === "navmenu" ? "nav" : "div",
        attrs,
        links.map((l, i) => (
          <a key={i} href={href(l.href)} {...(isSocial ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {l.label}
          </a>
        ))
      );
    }
    default:
      return createElement("div", attrs, def.container ? kids() : null);
  }
}

const CD_UNITS = ["Days", "Hours", "Minutes", "Seconds"];

export function countdownParts(target: string, now = Date.now()): string[] {
  const t = new Date(target).getTime();
  let diff = isNaN(t) ? 0 : Math.max(0, Math.floor((t - now) / 1000));
  const d = Math.floor(diff / 86400);
  diff -= d * 86400;
  const h = Math.floor(diff / 3600);
  diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const sec = diff - m * 60;
  return [d, h, m, sec].map((n) => String(n).padStart(2, "0"));
}

function Countdown({ target, labels }: { target: string; labels: boolean }) {
  const [parts, setParts] = useState<string[]>(["00", "00", "00", "00"]);
  useEffect(() => {
    const tick = () => setParts(countdownParts(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <>
      {parts.map((v, i) => (
        <div className="tb-cd-box" key={i}>
          <span className="tb-cd-num" data-cd={i}>
            {v}
          </span>
          {labels ? <span className="tb-cd-label">{CD_UNITS[i]}</span> : null}
        </div>
      ))}
    </>
  );
}

/** Inline script used by exported HTML to keep countdowns ticking. */
export const COUNTDOWN_SCRIPT = `(function(){function p(t){var x=new Date(t).getTime(),d=isNaN(x)?0:Math.max(0,Math.floor((x-Date.now())/1e3));var a=Math.floor(d/86400);d-=a*86400;var b=Math.floor(d/3600);d-=b*3600;var c=Math.floor(d/60);return[a,b,c,d-c*60].map(function(n){return(n<10?"0":"")+n})}function u(){document.querySelectorAll("[data-countdown]").forEach(function(el){var v=p(el.getAttribute("data-countdown"));el.querySelectorAll("[data-cd]").forEach(function(n){n.textContent=v[+n.getAttribute("data-cd")]})})}u();setInterval(u,1000)})();`;

export function ZoneView({ nodes, rc }: { nodes: TBNode[]; rc: RenderCtx }) {
  return (
    <>
      {nodes.map((n) => (
        <NodeView key={n.id} node={n} rc={rc} />
      ))}
    </>
  );
}
