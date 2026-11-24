"use client";

import { Icon } from "../../../ui/Icon";
import { TextInput } from "../../../ui/controls";
import { IconButton } from "../../../ui/common";

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
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
