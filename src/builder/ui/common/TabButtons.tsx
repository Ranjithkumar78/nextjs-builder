/** A row of mutually exclusive tab buttons (one is "on"). */
export function TabButtons<T extends string>({ tabs, value, onChange, className = "b-seg" }: { tabs: readonly { id: T; label: string }[]; value: T; onChange: (id: T) => void; className?: string }) {
  return (
    <div className={className}>
      {tabs.map((t) => (
        <button key={t.id} className={value === t.id ? "on" : ""} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
