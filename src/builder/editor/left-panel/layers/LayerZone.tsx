"use client";

import { useState } from "react";
import type { TBNode, Zone } from "../../../types";
import { dragState } from "../../../dnd";
import { Icon } from "../../../ui/Icon";
import { LayerRow } from "./LayerRow";
import { useLayerDrop } from "./useLayerDrop";

/** One zone (header, page or footer) in the layers tree; dropping on its title appends to it. */
export function LayerZone({ zone, label, icon, nodes }: { zone: Zone; label: string; icon: string; nodes: TBNode[] }) {
  const drop = useLayerDrop();
  const [over, setOver] = useState(false);
  return (
    <div className="b-layer-zone">
      <div
        className={`b-layer-zone-head ${over ? "drop-inside" : ""}`}
        onDragOver={(e) => {
          if (!dragState.get()) return;
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          drop({ zone, parentId: null, index: nodes.length });
        }}
      >
        <Icon name={icon} size={13} /> {label}
      </div>
      {nodes.length === 0 ? <div className="b-layer-empty">Empty — drop here</div> : null}
      {nodes.map((n, i) => (
        <LayerRow key={n.id} node={n} zone={zone} parentId={null} index={i} depth={0} />
      ))}
    </div>
  );
}
