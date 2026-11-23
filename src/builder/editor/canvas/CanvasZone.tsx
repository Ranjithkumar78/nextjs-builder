import type { TBNode, Zone } from "../../types";
import { ZoneView, type RenderCtx } from "../../render";
import { Icon } from "../../ui/Icon";

const LABELS: Record<Zone, string> = { header: "Header", page: "Page", footer: "Footer" };

/** A drop area on the canvas: the global header, the page content or the global footer. */
export function CanvasZone({ zone, nodes, rc }: { zone: Zone; nodes: TBNode[]; rc: RenderCtx }) {
  const label = LABELS[zone];
  return (
    <div className={`b-zone b-zone-${zone}`} data-zone-root={zone}>
      {zone !== "page" ? (
        <span className="b-zone-tag">
          <Icon name={zone} size={11} /> {label} · shared on all pages
        </span>
      ) : null}
      {nodes.length === 0 ? (
        <div className="b-zone-empty">
          <Icon name="plus" size={18} />
          <span>{zone === "page" ? "Drag components or blocks here to build this page" : `Drop blocks here to create the ${label.toLowerCase()}`}</span>
        </div>
      ) : (
        <ZoneView nodes={nodes} rc={rc} />
      )}
    </div>
  );
}
