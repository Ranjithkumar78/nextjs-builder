"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "../Icon";

/** A collapsible group of fields in the side panels. */
export function Section({ title, children, defaultOpen = true, badge }: { title: string; children: ReactNode; defaultOpen?: boolean; badge?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`b-sec ${open ? "open" : ""}`}>
      <button className="b-sec-head" onClick={() => setOpen(!open)}>
        <Icon name={open ? "chevronDown" : "chevronRight"} size={14} />
        <span>{title}</span>
        {badge}
      </button>
      {open ? <div className="b-sec-body">{children}</div> : null}
    </div>
  );
}
