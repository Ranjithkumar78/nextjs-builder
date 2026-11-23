import type { CSSProperties, ReactNode } from "react";
import { initials } from "../../eventData/format";
import { gridStyle } from "./types";

/** Shared building blocks of the event-data blocks. */

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" }) {
  return <div className={`tb-ev-note tb-ev-note--${tone}`}>{children}</div>;
}

/** Responsive card grid (columns shrink on small screens). */
export function EvGrid({ columns, min, className = "", style, children }: { columns: number; min: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`tb-ev-grid${className}`} style={{ ...gridStyle(columns, min), ...style }}>
      {children}
    </div>
  );
}

export function Skeleton({ count = 4, columns = 4 }: { count?: number; columns?: number }) {
  return (
    <div className="tb-ev-grid" style={gridStyle(columns, 200)} aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="tb-ev-skel" />
      ))}
    </div>
  );
}

/** Photo, or initials when there is none. */
export function Avatar({ name, photo, className }: { name: string; photo: string; className: string }) {
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={photo} alt={name} loading="lazy" />
  ) : (
    <span className={`${className} tb-ev-initials`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export type Group = { key: string; title?: string; content: ReactNode };

/** Titled groups stacked vertically (tiers, ticket categories, tracks, days). */
export function Groups({ groups, className = "" }: { groups: Group[]; className?: string }) {
  return (
    <div className="tb-ev-stack tb-ev-stack--lg">
      {groups.map((g) => (
        <div key={g.key} className={`tb-ev-group${className}`}>
          {g.title !== undefined ? <h3 className="tb-ev-group-title">{g.title}</h3> : null}
          {g.content}
        </div>
      ))}
    </div>
  );
}

/** Plain-text description, clamped by CSS. */
export function Desc({ text }: { text: string }) {
  return <p className="tb-ev-desc">{text}</p>;
}
