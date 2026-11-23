import type { ReactNode } from "react";

export type Tab = { id: string; label: string; content: ReactNode };

/** CSS-only tabs (radio inputs), so they also work in exported HTML. A single tab shows just its content. */
export function Tabs({ name, tabs }: { name: string; tabs: Tab[] }) {
  if (tabs.length === 1) return <>{tabs[0].content}</>;
  return (
    <div className="tb-ev-tabs">
      {tabs.map((t, i) => (
        <input key={t.id} type="radio" name={name} id={`${name}-${i}`} defaultChecked={i === 0} />
      ))}
      <div className="tb-ev-tablist" role="tablist">
        {tabs.map((t, i) => (
          <label key={t.id} htmlFor={`${name}-${i}`} role="tab">
            {t.label}
          </label>
        ))}
      </div>
      <div className="tb-ev-panels">
        {tabs.map((t) => (
          <div key={t.id} className="tb-ev-panel" role="tabpanel">
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
