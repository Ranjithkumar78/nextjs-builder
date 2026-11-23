import type { CSSProperties } from "react";
import { ICON_PATHS } from "./icons";

export type IconName = keyof typeof ICON_PATHS | string;

export function Icon({ name, size = 16, style, className }: { name: IconName; size?: number; style?: CSSProperties; className?: string }) {
  const d = ICON_PATHS[name] ?? ICON_PATHS.box;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}
