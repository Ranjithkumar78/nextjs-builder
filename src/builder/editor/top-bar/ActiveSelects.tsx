"use client";

import { useBuilder } from "../../store";
import { Icon } from "../../ui/Icon";
import { Options } from "../../ui/controls/SelectInput";

function TopSelect({ icon, title, value, options, onChange }: { icon: string; title: string; value: string; options: { id: string; name: string }[]; onChange: (id: string) => void }) {
  return (
    <label className="b-top-select" title={title}>
      <Icon name={icon} size={14} />
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <Options options={options.map((o) => ({ value: o.id, label: o.name }))} />
      </select>
    </label>
  );
}

/** Switch the theme and page being edited. */
export function ActiveSelects() {
  const { state, dispatch, theme, page } = useBuilder();
  return (
    <>
      <TopSelect icon="palette" title="Active theme" value={theme.id} options={state.project.themes} onChange={(id) => dispatch({ type: "SET_THEME", id })} />
      <TopSelect icon="file" title="Active page" value={page.id} options={theme.pages} onChange={(id) => dispatch({ type: "SET_PAGE", id })} />
    </>
  );
}
