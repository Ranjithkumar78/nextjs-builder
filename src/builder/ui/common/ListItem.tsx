import type { ReactNode } from "react";

/** A selectable row in the Pages and Themes lists, with hover actions on the right. */
export function ListItem({ active, onSelect, lead, children, actions }: { active: boolean; onSelect: () => void; lead: ReactNode; children: ReactNode; actions: ReactNode }) {
  return (
    <div className={`b-list-item ${active ? "on" : ""}`} onClick={onSelect}>
      {lead}
      {children}
      <div className="b-list-actions" onClick={(e) => e.stopPropagation()}>
        {actions}
      </div>
    </div>
  );
}

/** Title and caption inside a list row. */
export function ListText({ title, caption }: { title: ReactNode; caption: ReactNode }) {
  return (
    <div className="b-list-text">
      <strong>{title}</strong>
      <small>{caption}</small>
    </div>
  );
}
