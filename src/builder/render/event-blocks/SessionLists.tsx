import type { Session } from "../../eventData/types";
import type { NodeProps } from "../../types";
import { EvGrid } from "./parts";
import { SessionInfo, SessionTime } from "./SessionParts";
import { cardClass, chipColor } from "./types";

type ListProps = { sessions: Session[]; p: NodeProps };

/** Time on the left, details on the right. */
export function Agenda({ sessions, p }: ListProps) {
  return (
    <div className="tb-ev-stack">
      {sessions.map((x) => (
        <article key={x.id} className={cardClass(p, "tb-ev-agenda")}>
          <div className="tb-ev-agenda-time">
            <SessionTime x={x} p={p} />
          </div>
          <div className="tb-ev-body">
            <SessionInfo x={x} p={p} />
          </div>
        </article>
      ))}
    </div>
  );
}

/** Vertical line with a dot (in the track color) per session. */
export function Timeline({ sessions, p }: ListProps) {
  return (
    <ol className="tb-ev-timeline">
      {sessions.map((x) => (
        <li key={x.id} className="tb-ev-timeline-item">
          <span className="tb-ev-dot" style={chipColor(x.trackColor)} />
          <SessionTime x={x} p={p} />
          <div className={cardClass(p, "tb-ev-timeline-card")}>
            <SessionInfo x={x} p={p} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Grid of session cards; `dayOf` adds the day to each card (used when grouping by track). */
export function SessionCards({ sessions, p, columns, dayOf }: ListProps & { columns: number; dayOf?: (x: Session) => string }) {
  return (
    <EvGrid columns={columns} min={240}>
      {sessions.map((x) => (
        <article key={x.id} className={cardClass(p)}>
          <SessionTime x={x} p={p} />
          <SessionInfo x={x} p={p} dayLabel={dayOf?.(x)} />
        </article>
      ))}
    </EvGrid>
  );
}
