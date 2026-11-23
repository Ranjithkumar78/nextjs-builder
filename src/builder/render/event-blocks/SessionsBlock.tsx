import type { Session, SessionDay } from "../../eventData/types";
import { dayLabel } from "../../eventData/summary";
import { groupInOrder, num, str } from "../../lib/values";
import { Groups } from "./parts";
import { Tabs } from "./Tabs";
import { Agenda, SessionCards, Timeline } from "./SessionLists";
import type { EventBlockProps } from "./types";
import { WithData } from "./WithData";

export function SessionsBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "tabs");
  const columns = num(p.columns, 3);
  const dayFilter = str(p.day).trim();
  const trackFilter = str(p.track).trim().toLowerCase();

  // Tabs show every day and "by track" every track; other layouts can be limited to one day / track.
  const visible = (days: SessionDay[]) =>
    days
      .filter((d) => layout === "tabs" || !dayFilter || d.day === dayFilter)
      .map((d) => ({ ...d, sessions: d.sessions.filter((x) => !trackFilter || layout === "byTrack" || x.track.toLowerCase() === trackFilter) }))
      .filter((d) => d.sessions.length > 0);

  const list = (sessions: Session[]) => {
    if (layout === "timeline") return <Timeline sessions={sessions} p={p} />;
    if (layout === "grid") return <SessionCards sessions={sessions} p={p} columns={columns} />;
    return <Agenda sessions={sessions} p={p} />;
  };

  return (
    <WithData source="sessions" block={block} isEmpty={(d) => visible(d).length === 0}>
      {(data) => {
        const days = visible(data);
        if (layout === "tabs") return <Tabs name={`ss-${block.nodeId}`} tabs={days.map((d) => ({ id: d.day || d.label, label: dayLabel(d), content: <Agenda sessions={d.sessions} p={p} /> }))} />;
        if (layout === "byTrack") {
          const dayOf = new Map(days.flatMap((d) => d.sessions.map((x) => [x.id, d.label] as const)));
          const tracks = groupInOrder(
            days.flatMap((d) => d.sessions),
            (x) => x.track || "General",
          );
          const showDay = days.length > 1 ? (x: Session) => dayOf.get(x.id) ?? "" : undefined;
          return <Groups groups={tracks.map((g) => ({ key: g.name, title: g.name, content: <SessionCards sessions={g.items} p={p} columns={columns} dayOf={showDay} /> }))} />;
        }
        const titled = days.length > 1 || !dayFilter;
        return <Groups groups={days.map((d) => ({ key: d.day || d.label, title: titled ? dayLabel(d) : undefined, content: list(d.sessions) }))} />;
      }}
    </WithData>
  );
}
