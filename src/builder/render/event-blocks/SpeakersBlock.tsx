import type { Speaker } from "../../eventData/types";
import type { NodeProps } from "../../types";
import { plainText } from "../../lib/html";
import { num, on, str } from "../../lib/values";
import { Avatar, Desc, EvGrid } from "./parts";
import { cardClass, type EventBlockProps } from "./types";
import { WithData } from "./WithData";

/** The speaker's designation and organisation, when shown. */
function Meta({ sp, p }: { sp: Speaker; p: NodeProps }) {
  const role = [on(p.showDesignation) ? sp.designation : "", on(p.showOrganisation) ? sp.organisation : ""].filter(Boolean);
  return role.length ? <p className="tb-ev-sub">{role.join(", ")}</p> : null;
}

function Photo({ sp, p, size }: { sp: Speaker; p: NodeProps; size: "lg" | "md" }) {
  if (!on(p.showPhoto)) return null;
  return <Avatar name={sp.name} photo={sp.photo} className={`tb-ev-photo tb-ev-photo--${str(p.photoShape, "circle")} tb-ev-photo--${size}`} />;
}

/** Name, role and (optionally) bio. */
function Details({ sp, p }: { sp: Speaker; p: NodeProps }) {
  return (
    <>
      <h3 className="tb-ev-title">{sp.name}</h3>
      <Meta sp={sp} p={p} />
      {p.showBio && sp.bio ? <Desc text={plainText(sp.bio)} /> : null}
    </>
  );
}

export function SpeakersBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "grid");
  const limit = num(p.limit, 0);
  const columns = num(p.columns, 4);
  const align = str(p.align, "center");

  return (
    <WithData source="speakers" block={block} isEmpty={(d) => d.length === 0}>
      {(all) => {
        const speakers = limit > 0 ? all.slice(0, limit) : all;
        if (layout === "list")
          return (
            <div className="tb-ev-stack">
              {speakers.map((sp) => (
                <article key={sp.id} className={cardClass(p, "tb-ev-row")}>
                  <Photo sp={sp} p={p} size="lg" />
                  <div className="tb-ev-body">
                    <Details sp={sp} p={p} />
                  </div>
                </article>
              ))}
            </div>
          );
        if (layout === "spotlight")
          return (
            <EvGrid columns={columns} min={220}>
              {speakers.map((sp) => (
                <article key={sp.id} className={cardClass(p, `tb-ev-spot tb-ev-align-${align}`)}>
                  <Avatar name={sp.name} photo={sp.photo} className="tb-ev-spot-img" />
                  <div className="tb-ev-spot-text">
                    <Details sp={sp} p={p} />
                  </div>
                </article>
              ))}
            </EvGrid>
          );
        if (layout === "compact")
          return (
            <EvGrid columns={columns + 2} min={110} className={` tb-ev-align-${align}`}>
              {speakers.map((sp) => (
                <div key={sp.id} className="tb-ev-compact">
                  <Photo sp={sp} p={p} size="md" />
                  <strong className="tb-ev-name">{sp.name}</strong>
                  <Meta sp={sp} p={p} />
                </div>
              ))}
            </EvGrid>
          );
        const cards = speakers.map((sp) => (
          <article key={sp.id} className={cardClass(p, `tb-ev-align-${align}`)}>
            <Photo sp={sp} p={p} size="lg" />
            <Details sp={sp} p={p} />
          </article>
        ));
        return layout === "carousel" ? <div className="tb-ev-scroll">{cards}</div> : <EvGrid columns={columns} min={200}>{cards}</EvGrid>;
      }}
    </WithData>
  );
}
