import type { MouseEvent } from "react";
import { Icon } from "../Icon";

interface Props {
  icon: string;
  title: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
}

/** A button that shows only an icon (the title is its tooltip and accessible name). */
export function IconButton({ icon, title, onClick, size = 13, className, disabled }: Props) {
  return (
    <button className={className} title={title} aria-label={title} onClick={onClick} disabled={disabled}>
      <Icon name={icon} size={size} />
    </button>
  );
}
