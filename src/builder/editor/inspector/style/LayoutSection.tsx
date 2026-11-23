"use client";

import { Section, TextInput } from "../../../ui/controls";
import { useStyleEditor } from "../StyleEditor";
import { StyleField, StyleSegmented, StyleSelect, StyleText, StyleUnit } from "./fields";
import { DIRECTION, V } from "./options";

const columns = (n: number) => `repeat(${n}, minmax(0, 1fr))`;

/** Column count buttons plus a free-form grid-template-columns field. */
function GridColumns() {
  const { merged, get, ph, set } = useStyleEditor();
  return (
    <StyleField k="gridTemplateColumns" label="Columns" full>
      <div className="b-inline">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button key={n} className={`b-btn small ${merged.gridTemplateColumns === columns(n) ? "primary" : ""}`} onClick={() => set({ gridTemplateColumns: columns(n) })}>
            {n}
          </button>
        ))}
      </div>
      <TextInput value={get("gridTemplateColumns")} onChange={(v) => set({ gridTemplateColumns: v })} placeholder={ph("gridTemplateColumns") || "e.g. 2fr 1fr"} />
    </StyleField>
  );
}

/** Display, flex/grid options for children, and how the element behaves inside its parent. */
export function LayoutSection() {
  const display = useStyleEditor().merged.display ?? "";
  return (
    <Section title="Layout">
      <div className="b-grid2">
        <StyleSelect k="display" label="Display" options={V.display} />
        {display.includes("flex") ? (
          <>
            <StyleSegmented k="flexDirection" label="Direction" options={DIRECTION} />
            <StyleSelect k="justifyContent" label="Justify" options={V.justify} />
            <StyleSelect k="alignItems" label="Align items" options={V.flexAlign} />
            <StyleSelect k="flexWrap" label="Wrap" options={V.wrap} />
          </>
        ) : null}
        {display.includes("grid") ? (
          <>
            <GridColumns />
            <StyleSelect k="alignItems" label="Align items" options={V.gridAlign} />
            <StyleSelect k="justifyItems" label="Justify items" options={V.gridAlign} />
          </>
        ) : null}
      </div>
      <div className="b-subtitle">As a child of its parent</div>
      <div className="b-grid2">
        <StyleText k="flex" label="Flex" placeholder="e.g. 1 1 0" />
        <StyleSelect k="alignSelf" label="Align self" options={V.alignSelf} />
        <StyleUnit k="order" label="Order" unit="" />
        <StyleText k="gridColumn" label="Grid column" placeholder="e.g. span 2" />
      </div>
    </Section>
  );
}
