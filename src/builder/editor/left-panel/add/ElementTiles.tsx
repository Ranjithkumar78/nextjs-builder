"use client";

import { CATEGORIES, COMPONENTS, createNode } from "../../../registry";
import { Icon } from "../../../ui/Icon";
import { useInsert } from "./useInsert";

/** Every component, grouped by category, filtered by the search text. */
export function ElementTiles({ query }: { query: string }) {
  const insert = useInsert();
  return (
    <>
      {CATEGORIES.map((cat) => {
        const items = COMPONENTS.filter((c) => c.category === cat && (!query || c.label.toLowerCase().includes(query)));
        if (!items.length) return null;
        return (
          <div key={cat} className="b-cat">
            <div className="b-cat-title">{cat}</div>
            <div className="b-tiles">
              {items.map((c) => (
                <button key={c.type} className="b-tile" {...insert(() => createNode(c.type), c.label)}>
                  <Icon name={c.icon} size={20} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
