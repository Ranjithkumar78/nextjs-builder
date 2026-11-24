import { SITE_ICONS } from "../../../lib/icons";
import { Icon } from "../../../ui/Icon";

/** Grid of content icons; the chosen one is highlighted. */
export function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="b-iconpick">
      {SITE_ICONS.map((n) => (
        <button key={n} type="button" title={n} aria-label={n} className={value === n ? "on" : ""} onClick={() => onChange(n)}>
          <Icon name={n} size={16} />
        </button>
      ))}
    </div>
  );
}

/** Compact icon dropdown (e.g. per social link), with "no icon". */
export function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <span className="b-iconsel">
      <Icon name={value || "close"} size={14} />
      <select className="b-input" value={value} onChange={(e) => onChange(e.target.value)} title="Icon">
        <option value="">No icon</option>
        {SITE_ICONS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </span>
  );
}
