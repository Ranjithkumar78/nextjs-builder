"use client";

import type { Device } from "../../types";
import { useBuilder } from "../../store";
import { Icon } from "../../ui/Icon";

const DEVICES: { id: Device; icon: string; label: string }[] = [
  { id: "desktop", icon: "desktop", label: "Desktop" },
  { id: "tablet", icon: "tablet", label: "Tablet (820px)" },
  { id: "mobile", icon: "mobile", label: "Mobile (390px)" },
];

/** Preview (and edit styles for) desktop, tablet or mobile. */
export function DeviceSwitch() {
  const { state, dispatch } = useBuilder();
  return (
    <div className="b-seg">
      {DEVICES.map((d) => (
        <button key={d.id} className={state.ui.device === d.id ? "on" : ""} title={d.label} onClick={() => dispatch({ type: "UI", patch: { device: d.id } })}>
          <Icon name={d.icon} size={16} />
        </button>
      ))}
    </div>
  );
}
