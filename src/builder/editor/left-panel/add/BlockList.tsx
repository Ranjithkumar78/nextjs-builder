"use client";

import { BLOCKS } from "../../../presets";
import { Icon } from "../../../ui/Icon";
import { useInsert } from "./useInsert";

/** Ready-made sections, filtered by the search text. */
export function BlockList({ query }: { query: string }) {
  const insert = useInsert();
  return (
    <div className="b-blocks">
      {BLOCKS.filter((b) => !query || b.label.toLowerCase().includes(query)).map((b) => (
        <button key={b.id} className="b-block" {...insert(b.build, b.label)}>
          <span className="b-block-icon">
            <Icon name={b.icon} size={18} />
          </span>
          <span>{b.label}</span>
          <Icon name="plus" size={14} className="b-block-plus" />
        </button>
      ))}
    </div>
  );
}
