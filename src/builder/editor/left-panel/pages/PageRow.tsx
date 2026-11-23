"use client";

import type { Page } from "../../../types";
import { useBuilder } from "../../../store";
import { Icon } from "../../../ui/Icon";
import { IconButton, ListItem, ListText } from "../../../ui/common";

/** A page in the list: open it, rename it in place, reorder, duplicate or delete it. */
export function PageRow({ p, isHome, renaming, onRename }: { p: Page; isHome: boolean; renaming: boolean; onRename: (id: string | null) => void }) {
  const { theme, page, dispatch } = useBuilder();
  const actions = (
    <>
      <IconButton icon="edit" title="Rename" onClick={() => onRename(p.id)} />
      <IconButton icon="up" title="Move up" onClick={() => dispatch({ type: "MOVE_PAGE", id: p.id, dir: -1 })} />
      <IconButton icon="copy" title="Duplicate" onClick={() => dispatch({ type: "DUPLICATE_PAGE", id: p.id })} />
      <IconButton icon="trash" title="Delete" className="danger" disabled={theme.pages.length <= 1} onClick={() => confirm(`Delete page "${p.name}"?`) && dispatch({ type: "DELETE_PAGE", id: p.id })} />
    </>
  );
  return (
    <ListItem active={p.id === page.id} onSelect={() => dispatch({ type: "SET_PAGE", id: p.id })} lead={<Icon name={isHome ? "home" : "file"} size={15} />} actions={actions}>
      {renaming ? (
        <input
          className="b-input"
          autoFocus
          defaultValue={p.name}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => {
            dispatch({ type: "UPDATE_PAGE", id: p.id, patch: { name: e.target.value || p.name } });
            onRename(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
      ) : (
        <ListText title={p.name} caption={`/${p.slug === "home" ? "" : p.slug}`} />
      )}
    </ListItem>
  );
}
