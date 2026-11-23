import type { ReactNode } from "react";
import type { Sponsor } from "../../eventData/types";
import type { NodeProps } from "../../types";
import { externalUrl, NEW_TAB, plainText } from "../../lib/html";
import { Desc } from "./parts";
import { cardClass } from "./types";

export function SponsorLogo({ sp }: { sp: Sponsor }) {
  return sp.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="tb-ev-logo" src={sp.logo} alt={sp.name} loading="lazy" />
  ) : (
    <span className="tb-ev-logo tb-ev-logo-text">{sp.name}</span>
  );
}

/** A logo tile (strip, marquee and grid layouts), linked to the sponsor's website when enabled. */
export function SponsorTile({ sp, p, edit, className }: { sp: Sponsor; p: NodeProps; edit: boolean; className: string }) {
  const content: ReactNode = (
    <>
      <SponsorLogo sp={sp} />
      {p.showName && sp.logo ? <strong className="tb-ev-name">{sp.name}</strong> : null}
      {p.showIndustry && sp.industry ? <span className="tb-ev-sub">{sp.industry}</span> : null}
    </>
  );
  return p.linkWebsite && sp.website && !edit ? (
    <a className={className} href={externalUrl(sp.website)} {...NEW_TAB} title={sp.name}>
      {content}
    </a>
  ) : (
    <div className={className} title={sp.name}>
      {content}
    </div>
  );
}

/** A detailed card (cards layout): logo, name, tier, industry, description and website link. */
export function SponsorCard({ sp, p, edit, align }: { sp: Sponsor; p: NodeProps; edit: boolean; align: string }) {
  return (
    <article className={cardClass(p, `tb-ev-align-${align}`)}>
      <div className="tb-ev-logo-box">
        <SponsorLogo sp={sp} />
      </div>
      <h3 className="tb-ev-title">{sp.name}</h3>
      {sp.tier ? <span className="tb-ev-chip">{sp.tier}</span> : null}
      {p.showIndustry && sp.industry ? <p className="tb-ev-sub">{sp.industry}</p> : null}
      {p.showDescription && sp.description ? <Desc text={plainText(sp.description)} /> : null}
      {sp.website && p.linkWebsite ? (
        <a className="tb-ev-link" href={edit ? undefined : externalUrl(sp.website)} {...NEW_TAB}>
          Visit website →
        </a>
      ) : null}
    </article>
  );
}
