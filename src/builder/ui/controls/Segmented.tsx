import { Icon } from "../Icon";

export type SegmentOption = { value: string; label?: string; icon?: string; title?: string };

/** Button group where clicking the active option clears it (sets ""). */
export function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: SegmentOption[] }) {
  return (
    <div className="b-seg">
      {options.map((o) => (
        <button key={o.value} className={value === o.value ? "on" : ""} title={o.title ?? o.label ?? o.value} onClick={() => onChange(value === o.value ? "" : o.value)}>
          {o.icon ? <Icon name={o.icon} size={14} /> : o.label}
        </button>
      ))}
    </div>
  );
}
