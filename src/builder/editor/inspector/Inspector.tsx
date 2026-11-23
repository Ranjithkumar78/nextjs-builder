"use client";

import { useBuilder } from "../../store";
import { locate, type Located } from "../../tree";
import { getDef } from "../../registry";
import { StyleEditorProvider } from "./StyleEditor";
import { InspectorHeader } from "./InspectorHeader";
import { PageSettings } from "./PageSettings";
import { AdvancedTab } from "./AdvancedTab";
import { StyleTab } from "./style/StyleTab";
import { ContentFields } from "./content/ContentFields";
import { QuickEdit } from "../quick-edit/QuickEdit";

/** Body of the Edit tab: content fields first, then the quick Design controls. */
function EditTab({ sel }: { sel: Located }) {
  const def = getDef(sel.node.type);
  const fields = def.fields.filter((f) => f.key !== "accentColor");
  return <QuickEdit content={def.fields.length ? <ContentFields node={sel.node} fields={fields} /> : null} />;
}

/** Right-hand panel: settings of the selected element, or of the page when nothing is selected. */
export function Inspector() {
  const { state, theme, page } = useBuilder();
  const { ui } = state;
  const sel = ui.selectedId ? locate(theme, page, ui.selectedId) : null;
  if (!sel) return <PageSettings page={page} />;
  const tab = ui.rightTab;
  return (
    <StyleEditorProvider node={sel.node} styleState={ui.hoverState ? "hover" : ui.device}>
      <div className="b-inspector">
        <InspectorHeader sel={sel} />
        <div className="b-insp-body">{tab === "edit" || tab === "content" ? <EditTab sel={sel} /> : tab === "advanced" ? <AdvancedTab /> : <StyleTab />}</div>
      </div>
    </StyleEditorProvider>
  );
}
