"use client";

import type { Zone } from "../../../types";
import { useBuilder } from "../../../store";
import { getZoneNodes } from "../../../tree";
import { Panel } from "../../../ui/common";
import { LayerZone } from "./LayerZone";

/** Tree of every element on the page, including the global header and footer when shown. */
export function LayersTab() {
  const { theme, page } = useBuilder();
  const zones: { zone: Zone; label: string; icon: string; show: boolean }[] = [
    { zone: "header", label: "Header (global)", icon: "header", show: page.showHeader },
    { zone: "page", label: `Page · ${page.name}`, icon: "file", show: true },
    { zone: "footer", label: "Footer (global)", icon: "footer", show: page.showFooter },
  ];
  return (
    <Panel head={<div className="b-panel-title">Layers</div>} bodyClass="b-layers">
      {zones
        .filter((z) => z.show)
        .map((z) => (
          <LayerZone key={z.zone} zone={z.zone} label={z.label} icon={z.icon} nodes={getZoneNodes(theme, page, z.zone)} />
        ))}
    </Panel>
  );
}
