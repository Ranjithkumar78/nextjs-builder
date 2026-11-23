import type { ReactNode } from "react";

/** A left-panel tab: a fixed header and a scrolling body. */
export function Panel({ head, children, bodyClass = "" }: { head: ReactNode; children: ReactNode; bodyClass?: string }) {
  return (
    <div className="b-panel">
      <div className="b-panel-head">{head}</div>
      <div className={`b-panel-scroll ${bodyClass}`.trim()}>{children}</div>
    </div>
  );
}

/** Small explanatory text under a section title. */
export function Note({ children, error }: { children: ReactNode; error?: boolean }) {
  return <div className={error ? "b-note error" : "b-note"}>{children}</div>;
}

/** Tip text at the bottom of a panel. */
export function Hint({ children }: { children: ReactNode }) {
  return <div className="b-hint">{children}</div>;
}
