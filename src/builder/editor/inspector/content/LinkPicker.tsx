import type { Page } from "../../../types";
import { pageHref } from "../../../tree";
import { TextInput } from "../../../ui/controls";
import { Options } from "../../../ui/controls/SelectInput";

/** Link field with a shortcut list of the theme's pages. */
export function LinkPicker({ value, onChange, pages }: { value: string; onChange: (v: string) => void; pages: Page[] }) {
  return (
    <div className="b-linkpick">
      <TextInput value={value} onChange={onChange} placeholder="/page, #section or https://…" />
      <select className="b-input b-linkpick-sel" value="" onChange={(e) => e.target.value && onChange(e.target.value)} title="Link to a page">
        <option value="">Pages…</option>
        <Options options={pages.map((p) => ({ value: pageHref(p), label: p.name }))} />
      </select>
    </div>
  );
}
