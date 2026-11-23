import type { CSSProperties } from "react";
import { iconPaths } from "../lib/icons";

export type IconName = string;

export function Icon({ name, size = 16, style, className }: { name: IconName; size?: number | string; style?: CSSProperties; className?: string }) {
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
      {iconPaths(name).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
