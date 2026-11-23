import type { CSSProperties } from "react";
import type { Sponsor } from "../../eventData/types";
import { groupInOrder, num, str } from "../../lib/values";
import { EvGrid, Groups } from "./parts";
import { SponsorCard, SponsorTile } from "./SponsorParts";
import { cardClass, type EventBlockProps } from "./types";
import { WithData } from "./WithData";

export function SponsorsBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "byTier");
  const limit = num(p.limit, 0);
  const columns = num(p.columns, 5);
  const tierFilter = str(p.tier).trim().toLowerCase();
  const align = str(p.align, "center");
  const logoStyle = { "--ev-logo-h": `${num(p.logoHeight, 64)}px` } as CSSProperties;
  const grey = p.grayscale ? " tb-ev-grey" : "";
  const inTier = (s: Sponsor) => !tierFilter || s.tier.toLowerCase() === tierFilter;
  const tiles = (list: Sponsor[], className: string) => list.map((sp) => <SponsorTile key={sp.id} sp={sp} p={p} edit={block.edit} className={className} />);
  const logoGrid = (list: Sponsor[]) => (
    <EvGrid columns={columns} min={140} className={grey} style={logoStyle}>
      {tiles(list, cardClass(p, "tb-ev-logo-card"))}
    </EvGrid>
  );

  return (
    <WithData source="sponsors" block={block} isEmpty={(d) => d.filter(inTier).length === 0}>
      {(all) => {
        let sponsors = all.filter(inTier);
        if (limit > 0) sponsors = sponsors.slice(0, limit);
        if (layout === "strip")
          return (
            <div className={`tb-ev-strip${grey}`} style={logoStyle}>
              {tiles(sponsors, "tb-ev-strip-item")}
            </div>
          );
        if (layout === "marquee")
          return (
            <div className={`tb-ev-marquee${grey}`} style={logoStyle}>
              <div className="tb-ev-marquee-track">
                {tiles(sponsors, "tb-ev-strip-item")}
                <div className="tb-ev-marquee-copy" aria-hidden="true">
                  {tiles(sponsors, "tb-ev-strip-item")}
                </div>
              </div>
            </div>
          );
        if (layout === "cards")
          return (
            <EvGrid columns={columns} min={240} className={grey} style={logoStyle}>
              {sponsors.map((sp) => (
                <SponsorCard key={sp.id} sp={sp} p={p} edit={block.edit} align={align} />
              ))}
            </EvGrid>
          );
        if (layout === "grid") return logoGrid(sponsors);
        // byTier: keep the order in which tiers first appear (the API sorts by tier).
        const tiers = groupInOrder(sponsors, (sp) => sp.tier || "Sponsors");
        return <Groups className={` tb-ev-align-${align}`} groups={tiers.map((t) => ({ key: t.name, title: t.name, content: logoGrid(t.items) }))} />;
      }}
    </WithData>
  );
}
