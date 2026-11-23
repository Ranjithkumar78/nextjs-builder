import type { TBNode } from "../../types";
import { NAVY, GOLD, CREAM, mix, section, container } from "./helpers";
import { agenda } from "./agenda";
import { activities } from "./activities";

export function schedule(): TBNode {
  return section(
    "Schedule",
    [container([...agenda(), ...activities()], { gap: "0" })],
    {
      color: CREAM,
      backgroundColor: NAVY,
      backgroundImage: `radial-gradient(ellipse at 20% 0%, ${mix("#8fb3d0", 30)} 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, ${mix(GOLD, 18)} 0%, transparent 55%), linear-gradient(180deg, ${mix(NAVY, 88, "#6b8fb0")} 0%, ${NAVY} 100%)`,
    },
    "schedule"
  );
}
