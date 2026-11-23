import type { Session, SessionPerson } from "../../eventData/types";
import type { NodeProps } from "../../types";
import { plainText } from "../../lib/html";
import { on } from "../../lib/values";
import { Avatar, Desc } from "./parts";
import { chipColor } from "./types";

export function SessionTime({ x, p }: { x: Session; p: NodeProps }) {
  return on(p.showTime) && x.start ? <span className="tb-ev-time">{x.end ? `${x.start} – ${x.end}` : x.start}</span> : null;
}

/** Small avatars with names (speakers, or moderators with a label). */
function People({ list, label }: { list: SessionPerson[]; label?: string }) {
  if (!list.length) return null;
  return (
    <div className="tb-ev-people">
      {label ? <span className="tb-ev-sub">{label}</span> : null}
      {list.map((sp) => (
        <span key={sp.id || sp.name} className="tb-ev-person">
          <Avatar name={sp.name} photo={sp.photo} className="tb-ev-photo tb-ev-photo--circle tb-ev-photo--xs" />
          {sp.name}
        </span>
      ))}
    </div>
  );
}

/** Day, track and hall line, title, description and people of a session, as enabled. */
export function SessionInfo({ x, p, dayLabel }: { x: Session; p: NodeProps; dayLabel?: string }) {
  return (
    <>
      <div className="tb-ev-meta">
        {dayLabel ? <span className="tb-ev-sub">{dayLabel}</span> : null}
        {p.showTrack && x.track ? (
          <span className="tb-ev-chip" style={chipColor(x.trackColor)}>
            {x.track}
          </span>
        ) : null}
        {p.showHall && x.hall ? <span className="tb-ev-sub">{x.hall}</span> : null}
      </div>
      <h3 className="tb-ev-title">{x.title}</h3>
      {p.showDescription && x.description ? <Desc text={plainText(x.description)} /> : null}
      {p.showSpeakers ? (
        <>
          <People list={x.speakers} />
          <People list={x.moderators} label="Moderator" />
        </>
      ) : null}
    </>
  );
}
