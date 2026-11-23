"use client";

import type { Device } from "../../types";
import { useBuilder, type RightTab } from "../../store";
import { getDef } from "../../registry";
import type { Located } from "../../tree";
import { Icon } from "../../ui/Icon";
import { Segmented } from "../../ui/controls";
import { Note } from "../../ui/common";

const DEVICES = [
  { value: "desktop", icon: "desktop", title: "Desktop styles" },
  { value: "tablet", icon: "tablet", title: "Tablet overrides (≤1024px)" },
  { value: "mobile", icon: "mobile", title: "Mobile overrides (≤640px)" },
];

const TABS: [RightTab, string][] = [
  ["edit", "Edit"],
  ["style", "Style"],
  ["advanced", "Advanced"],
];

/** Element name, device/hover state being edited, and the Edit / Style / Advanced tabs. */
export function InspectorHeader({ sel }: { sel: Located }) {
  const { state, dispatch } = useBuilder();
  const { ui } = state;
  const { node, zone } = sel;
  const def = getDef(node.type);
  const styleState = ui.hoverState ? "hover" : ui.device;
  return (
    <div className="b-insp-head">
      <div className="b-insp-title">
        <Icon name={def.icon} size={16} />
        <input className="b-insp-name" value={node.name ?? ""} placeholder={def.label} onChange={(e) => dispatch({ type: "RENAME_NODE", id: node.id, name: e.target.value })} />
        {zone !== "page" ? <span className="b-chip">Global {zone}</span> : null}
      </div>
      <div className="b-statebar">
        <span>Editing</span>
        <Segmented value={ui.device} onChange={(v) => dispatch({ type: "UI", patch: { device: (v || "desktop") as Device } })} options={DEVICES} />
        <button className={`b-btn small ${ui.hoverState ? "primary" : ""}`} onClick={() => dispatch({ type: "UI", patch: { hoverState: !ui.hoverState } })} title="Edit the hover state">
          :hover
        </button>
      </div>
      {styleState !== "desktop" ? (
        <Note>{styleState === "hover" ? "Hover styles apply when the mouse is over this element." : `Changes apply to ${styleState} screens only. Empty fields inherit from larger screens (shown in grey).`}</Note>
      ) : null}
      <div className="b-tabs">
        {TABS.map(([t, label]) => (
          <button key={t} className={ui.rightTab === t || (t === "edit" && ui.rightTab === "content") ? "on" : ""} onClick={() => dispatch({ type: "UI", patch: { rightTab: t } })}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
