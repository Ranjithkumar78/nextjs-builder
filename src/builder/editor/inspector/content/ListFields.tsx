"use client";

import type { LinkItem, Page } from "../../../types";
import { moveItem } from "../../../lib/values";
import { Icon } from "../../../ui/Icon";
import { TextInput } from "../../../ui/controls";
import { IconButton } from "../../../ui/common";
import { LinkPicker } from "./LinkPicker";

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="b-btn small" onClick={onClick}>
      <Icon name="plus" size={13} /> {label}
    </button>
  );
}

/** Editable list of text items (list items, dropdown options). */
export function ItemsField({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="b-listed">
      {items.map((it, i) => (
        <div className="b-listed-row" key={i}>
          <TextInput value={String(it)} onChange={(x) => onChange(items.map((y, j) => (j === i ? x : y)))} />
          <IconButton icon="trash" title="Remove" className="b-icon-btn" onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton label="Add item" onClick={() => onChange([...items, "New item"])} />
    </div>
  );
}

/** Editable, reorderable list of links (menus, social links). */
export function LinksField({ links, onChange, pages }: { links: LinkItem[]; onChange: (v: LinkItem[]) => void; pages: Page[] }) {
  const update = (i: number, patch: Partial<LinkItem>) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const move = (i: number, d: number) => {
    const moved = moveItem(links, i, i + d);
    if (moved !== links) onChange(moved);
  };
  return (
    <div className="b-listed">
      {links.map((l, i) => (
        <div className="b-linkrow" key={i}>
          <div className="b-linkrow-top">
            <TextInput value={l.label} onChange={(x) => update(i, { label: x })} placeholder="Label" />
            <IconButton icon="up" title="Up" size={12} className="b-icon-btn" onClick={() => move(i, -1)} />
            <IconButton icon="down" title="Down" size={12} className="b-icon-btn" onClick={() => move(i, 1)} />
            <IconButton icon="trash" title="Remove" size={12} className="b-icon-btn" onClick={() => onChange(links.filter((_, j) => j !== i))} />
          </div>
          <LinkPicker value={l.href} onChange={(x) => update(i, { href: x })} pages={pages} />
        </div>
      ))}
      <AddButton label="Add link" onClick={() => onChange([...links, { label: "New link", href: "#" }])} />
    </div>
  );
}
