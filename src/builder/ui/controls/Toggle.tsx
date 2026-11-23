export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="b-toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="b-toggle-track">
        <span className="b-toggle-thumb" />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}

export function RangeInput({ value, onChange, min = 0, max = 1, step = 0.05 }: { value: string; onChange: (v: string) => void; min?: number; max?: number; step?: number }) {
  const n = value === "" ? max : parseFloat(value);
  return (
    <div className="b-range">
      <input type="range" min={min} max={max} step={step} value={isNaN(n) ? max : n} onChange={(e) => onChange(e.target.value)} />
      <span>{value || "—"}</span>
    </div>
  );
}
