import type { Device } from "../../types";

/** Banner above the tablet/mobile canvas explaining that edits apply to that device. */
export function DeviceLabel({ device, width }: { device: Device; width: number }) {
  if (device === "desktop") return null;
  return (
    <div className="b-device-label">
      {device === "tablet" ? "Tablet" : "Mobile"} · {width}px — styles you edit now apply only to {device} and smaller
    </div>
  );
}
