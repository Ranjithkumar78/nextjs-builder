"use client";

import type { LinkItem, Page } from "../../../types";
import { moveItem } from "../../../lib/values";
import { TextInput } from "../../../ui/controls";
import { IconButton } from "../../../ui/common";
import { AddButton } from "./ListFields";
import { IconSelect } from "./IconSelect";
import { LinkPicker } from "./LinkPicker";

interface Props {
  links: LinkItem[];
  onChange: (v: LinkItem[]) => void;
  pages: Page[];
  /** Pick an icon per link (social links). */
  icons?: boolean;
  /** Allow dropdown sub-links (menus); sub-links themselves can't be nested further. */
  nested?: boolean;
}

/** Editable, reorderable list of links. */
export function LinksField({ links, onChange, pages, icons, nested }: Props) {
  const update = (i: number, patch: Partial<LinkItem>) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const move = (i: number, d: number) => {
    const moved = moveItem(links, i, i + d);
    if (moved !== links) onChange(moved);
  };
  return (
    <div className="b-listed">
      {links.map((l, i) => {
        const sub = l.children ?? [];
        return (
          <div className="b-linkrow" key={i}>
            <div className="b-linkrow-top">
              {icons ? <IconSelect value={l.icon ?? ""} onChange={(x) => update(i, { icon: x || undefined })} /> : null}
              <TextInput value={l.label} onChange={(x) => update(i, { label: x })} placeholder="Label" />
              <IconButton icon="up" title="Up" size={12} className="b-icon-btn" onClick={() => move(i, -1)} />
              <IconButton icon="down" title="Down" size={12} className="b-icon-btn" onClick={() => move(i, 1)} />
              <IconButton icon="trash" title="Remove" size={12} className="b-icon-btn" onClick={() => onChange(links.filter((_, j) => j !== i))} />
            </div>
            <LinkPicker value={l.href} onChange={(x) => update(i, { href: x })} pages={pages} />
            {nested && sub.length ? (
              <div className="b-sublinks">
                <LinksField links={sub} onChange={(c) => update(i, { children: c.length ? c : undefined })} pages={pages} />
              </div>
            ) : null}
            {nested && !sub.length ? (
              <button className="b-btn small ghost" onClick={() => update(i, { children: [{ label: "Sub-link", href: "#" }] })}>
                + Dropdown sub-links
              </button>
            ) : null}
          </div>
        );
      })}
      <AddButton label="Add link" onClick={() => onChange([...links, { label: "New link", href: "#" }])} />
    </div>
  );
}
