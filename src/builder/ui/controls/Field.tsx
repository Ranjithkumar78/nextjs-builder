import type { ReactNode } from "react";
import { Icon } from "../Icon";

/** A labelled control. When `set`, the label is highlighted and an optional reset (×) button is shown. */
export function Field({ label, children, set, onReset, full }: { label: string; children: ReactNode; set?: boolean; onReset?: () => void; full?: boolean }) {
  return (
    <div className={`b-field ${full ? "full" : ""}`}>
      <label className="b-field-label">
        <span className={set ? "is-set" : ""} title={set ? "Set on this element/state" : undefined}>
          {label}
        </span>
        {set && onReset ? (
          <button className="b-reset" title="Reset" onClick={onReset}>
            <Icon name="close" size={10} />
          </button>
        ) : null}
      </label>
      {children}
    </div>
  );
}
