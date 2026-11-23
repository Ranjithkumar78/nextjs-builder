"use client";

import type { CSSProperties, ReactNode } from "react";
import type { NodeProps } from "../types";
import {
  formatPrice,
  initials,
  useEventData,
  type EventDataMap,
  type EventSource,
  type Session,
  type SessionDay,
  type SessionPerson,
  type Speaker,
  type Sponsor,
  type Ticket,
  type TicketCategory,
} from "../eventData";

/** What every event-data block gets from NodeView. */
export interface EventBlockProps {
  nodeId: string;
  props: NodeProps;
  eventId: string;
  edit: boolean;
}

const str = (v: unknown, d = "") => (v === undefined || v === null ? d : String(v));
const num = (v: unknown, d: number) => (v === "" || v === undefined || v === null || isNaN(Number(v)) ? d : Number(v));
const on = (v: unknown) => v !== false && v !== "false";

/** Backend descriptions may contain HTML; show them as plain text. */
function plain(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function gridStyle(columns: number, min: number): CSSProperties {
  return { "--ev-cols": String(Math.max(1, columns)), "--ev-min": `${min}px` } as CSSProperties;
}

function cardClass(props: NodeProps, extra = ""): string {
  return `tb-ev-card tb-ev-card--${str(props.cardStyle, "elevated")}${extra ? " " + extra : ""}`;
}

function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" }) {
  return <div className={`tb-ev-note tb-ev-note--${tone}`}>{children}</div>;
}

function Skeleton({ count = 4, columns = 4 }: { count?: number; columns?: number }) {
  return (
    <div className="tb-ev-grid" style={gridStyle(columns, 200)} aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="tb-ev-skel" />
      ))}
    </div>
  );
}

const LABELS: Record<EventSource, string> = { speakers: "speakers", sponsors: "sponsors", tickets: "tickets", sessions: "sessions" };

/** Loads the data and handles the "no event / loading / error / empty" states. */
function WithData<K extends EventSource>({
  source,
  block,
  isEmpty,
  children,
}: {
  source: K;
  block: EventBlockProps;
  isEmpty: (data: EventDataMap[K]) => boolean;
  children: (data: EventDataMap[K]) => ReactNode;
}): ReactNode {
  const state = useEventData(source, block.eventId);
  if (!block.eventId) {
    return block.edit ? (
      <Note>
        <strong>Live {LABELS[source]}</strong> — choose the event for this theme in <em>Themes → Event data</em> to show its {LABELS[source]} here.
      </Note>
    ) : null;
  }
  if (state.status === "idle" || state.status === "loading") return <Skeleton columns={Math.min(4, num(block.props.columns, 4))} />;
  if (state.status === "error") return block.edit ? <Note tone="error">Could not load {LABELS[source]}: {state.error}</Note> : null;
  const data = (state as { data: EventDataMap[K] }).data;
  if (isEmpty(data)) {
    const text = str(block.props.emptyText);
    return text ? <p className="tb-ev-empty">{text}</p> : null;
  }
  return children(data);
}

function Avatar({ name, photo, className }: { name: string; photo: string; className: string }) {
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={photo} alt={name} loading="lazy" />
  ) : (
    <span className={`${className} tb-ev-initials`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

// ================================================================ Speakers
export function SpeakersBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "grid");
  const limit = num(p.limit, 0);
  const columns = num(p.columns, 4);
  const align = str(p.align, "center");
  const shape = str(p.photoShape, "circle");

  const meta = (sp: Speaker) => {
    const role = [on(p.showDesignation) ? sp.designation : "", on(p.showOrganisation) ? sp.organisation : ""].filter(Boolean);
    return role.length ? <p className="tb-ev-sub">{role.join(", ")}</p> : null;
  };
  const bio = (sp: Speaker) => (p.showBio && sp.bio ? <p className="tb-ev-desc">{plain(sp.bio)}</p> : null);
  const photo = (sp: Speaker, cls = "") => (on(p.showPhoto) ? <Avatar name={sp.name} photo={sp.photo} className={`tb-ev-photo tb-ev-photo--${shape}${cls ? " " + cls : ""}`} /> : null);

  return (
    <WithData source="speakers" block={block} isEmpty={(d) => d.length === 0}>
      {(all) => {
        const speakers = limit > 0 ? all.slice(0, limit) : all;
        if (layout === "list") {
          return (
            <div className="tb-ev-stack">
              {speakers.map((sp) => (
                <article key={sp.id} className={cardClass(p, "tb-ev-row")}>
                  {photo(sp, "tb-ev-photo--lg")}
                  <div className="tb-ev-body">
                    <h3 className="tb-ev-title">{sp.name}</h3>
                    {meta(sp)}
                    {bio(sp)}
                  </div>
                </article>
              ))}
            </div>
          );
        }
        if (layout === "spotlight") {
          return (
            <div className="tb-ev-grid" style={gridStyle(columns, 220)}>
              {speakers.map((sp) => (
                <article key={sp.id} className={cardClass(p, `tb-ev-spot tb-ev-align-${align}`)}>
                  <Avatar name={sp.name} photo={sp.photo} className="tb-ev-spot-img" />
                  <div className="tb-ev-spot-text">
                    <h3 className="tb-ev-title">{sp.name}</h3>
                    {meta(sp)}
                    {bio(sp)}
                  </div>
                </article>
              ))}
            </div>
          );
        }
        if (layout === "compact") {
          return (
            <div className={`tb-ev-grid tb-ev-align-${align}`} style={gridStyle(columns + 2, 110)}>
              {speakers.map((sp) => (
                <div key={sp.id} className="tb-ev-compact">
                  {photo(sp, "tb-ev-photo--md")}
                  <strong className="tb-ev-name">{sp.name}</strong>
                  {meta(sp)}
                </div>
              ))}
            </div>
          );
        }
        const cards = speakers.map((sp) => (
          <article key={sp.id} className={cardClass(p, `tb-ev-align-${align}`)}>
            {photo(sp, "tb-ev-photo--lg")}
            <h3 className="tb-ev-title">{sp.name}</h3>
            {meta(sp)}
            {bio(sp)}
          </article>
        ));
        return layout === "carousel" ? <div className="tb-ev-scroll">{cards}</div> : <div className="tb-ev-grid" style={gridStyle(columns, 200)}>{cards}</div>;
      }}
    </WithData>
  );
}

// ================================================================ Sponsors
export function SponsorsBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "byTier");
  const limit = num(p.limit, 0);
  const columns = num(p.columns, 5);
  const tierFilter = str(p.tier).trim().toLowerCase();
  const align = str(p.align, "center");
  const logoStyle = { "--ev-logo-h": `${num(p.logoHeight, 64)}px` } as CSSProperties;
  const grey = p.grayscale ? " tb-ev-grey" : "";

  const logo = (sp: Sponsor) =>
    sp.logo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="tb-ev-logo" src={sp.logo} alt={sp.name} loading="lazy" />
    ) : (
      <span className="tb-ev-logo tb-ev-logo-text">{sp.name}</span>
    );
  const link = (sp: Sponsor, children: ReactNode, cls: string) =>
    p.linkWebsite && sp.website && !block.edit ? (
      <a key={sp.id} className={cls} href={/^https?:\/\//.test(sp.website) ? sp.website : `https://${sp.website}`} target="_blank" rel="noopener noreferrer" title={sp.name}>
        {children}
      </a>
    ) : (
      <div key={sp.id} className={cls} title={sp.name}>
        {children}
      </div>
    );
  const logoTile = (sp: Sponsor, cls: string) =>
    link(
      sp,
      <>
        {logo(sp)}
        {p.showName && sp.logo ? <strong className="tb-ev-name">{sp.name}</strong> : null}
        {p.showIndustry && sp.industry ? <span className="tb-ev-sub">{sp.industry}</span> : null}
      </>,
      cls
    );

  return (
    <WithData source="sponsors" block={block} isEmpty={(d) => d.filter((s) => !tierFilter || s.tier.toLowerCase() === tierFilter).length === 0}>
      {(all) => {
        let sponsors = tierFilter ? all.filter((s) => s.tier.toLowerCase() === tierFilter) : all;
        if (limit > 0) sponsors = sponsors.slice(0, limit);

        if (layout === "strip") {
          return <div className={`tb-ev-strip${grey}`} style={logoStyle}>{sponsors.map((sp) => logoTile(sp, "tb-ev-strip-item"))}</div>;
        }
        if (layout === "marquee") {
          const row = sponsors.map((sp) => logoTile(sp, "tb-ev-strip-item"));
          return (
            <div className={`tb-ev-marquee${grey}`} style={logoStyle}>
              <div className="tb-ev-marquee-track">
                {row}
                <div className="tb-ev-marquee-copy" aria-hidden="true">
                  {sponsors.map((sp) => logoTile(sp, "tb-ev-strip-item"))}
                </div>
              </div>
            </div>
          );
        }
        if (layout === "cards") {
          return (
            <div className={`tb-ev-grid${grey}`} style={{ ...gridStyle(columns, 240), ...logoStyle }}>
              {sponsors.map((sp) => (
                <article key={sp.id} className={cardClass(p, `tb-ev-align-${align}`)}>
                  <div className="tb-ev-logo-box">{logo(sp)}</div>
                  <h3 className="tb-ev-title">{sp.name}</h3>
                  {sp.tier ? <span className="tb-ev-chip">{sp.tier}</span> : null}
                  {p.showIndustry && sp.industry ? <p className="tb-ev-sub">{sp.industry}</p> : null}
                  {p.showDescription && sp.description ? <p className="tb-ev-desc">{plain(sp.description)}</p> : null}
                  {sp.website && p.linkWebsite ? (
                    <a className="tb-ev-link" href={block.edit ? undefined : /^https?:\/\//.test(sp.website) ? sp.website : `https://${sp.website}`} target="_blank" rel="noopener noreferrer">
                      Visit website →
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          );
        }
        const tile = (sp: Sponsor) => logoTile(sp, cardClass(p, "tb-ev-logo-card"));
        if (layout === "grid") {
          return <div className={`tb-ev-grid${grey}`} style={{ ...gridStyle(columns, 140), ...logoStyle }}>{sponsors.map(tile)}</div>;
        }
        // byTier: keep the order in which tiers first appear (the API sorts by tier).
        const tiers: { name: string; items: Sponsor[] }[] = [];
        for (const sp of sponsors) {
          const name = sp.tier || "Sponsors";
          const t = tiers.find((x) => x.name === name) ?? tiers[tiers.push({ name, items: [] }) - 1];
          t.items.push(sp);
        }
        return (
          <div className="tb-ev-stack tb-ev-stack--lg">
            {tiers.map((t) => (
              <div key={t.name} className={`tb-ev-group tb-ev-align-${align}`}>
                <h3 className="tb-ev-group-title">{t.name}</h3>
                <div className={`tb-ev-grid${grey}`} style={{ ...gridStyle(columns, 140), ...logoStyle }}>{t.items.map(tile)}</div>
              </div>
            ))}
          </div>
        );
      }}
    </WithData>
  );
}

// ================================================================ Tickets
export function TicketsBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "byCategory");
  const columns = num(p.columns, 3);
  const categoryFilter = str(p.category).trim().toLowerCase();
  const currency = str(p.currency, "₹");
  const align = str(p.align, "left");
  const highlight = str(p.highlight).trim().toLowerCase();
  const button = str(p.buttonText);

  const visible = (cats: TicketCategory[]) =>
    cats
      .filter((c) => layout === "tabs" || !categoryFilter || c.name.toLowerCase() === categoryFilter)
      .map((c) => ({ ...c, tickets: c.tickets.filter((t) => on(p.showSoldOut) || !t.soldOut) }))
      .filter((c) => c.tickets.length > 0);

  const highlightId = (tickets: Ticket[]) => (highlight ? tickets.find((t) => t.title.toLowerCase().includes(highlight))?.id : undefined);
  const href = (t: Ticket) => {
    const h = str(p.buttonHref, "#").replace(/\{ticket\}/g, encodeURIComponent(t.id)) || "#";
    return block.edit ? undefined : h;
  };

  const price = (t: Ticket) => (
    <div className="tb-ev-price">
      <span className="tb-ev-price-now">{formatPrice(t.price, currency)}</span>
      {t.price !== null && t.basePrice > t.price ? <s className="tb-ev-price-was">{formatPrice(t.basePrice, currency)}</s> : null}
    </div>
  );
  const dates = (t: Ticket) => (p.showDates && (t.dateRange || t.endDate) ? <p className="tb-ev-sub">{t.dateRange || (t.endDate ? `Sale ends ${t.endDate}` : "")}</p> : null);
  const left = (t: Ticket) => (p.showRemaining && t.remaining !== null && !t.soldOut ? <p className="tb-ev-sub tb-ev-left">{t.remaining} left</p> : null);
  const cta = (t: Ticket) =>
    button ? (
      t.soldOut ? (
        <span className="tb-ev-btn tb-ev-btn--off">Sold out</span>
      ) : (
        <a className="tb-ev-btn" href={href(t)}>
          {button}
        </a>
      )
    ) : null;

  const card = (t: Ticket, hl?: string) => (
    <article key={t.id} className={cardClass(p, `tb-ev-ticket tb-ev-align-${align}${t.id === hl ? " tb-ev-hl" : ""}${t.soldOut ? " tb-ev-sold" : ""}`)}>
      {t.id === hl ? <span className="tb-ev-ribbon">Recommended</span> : null}
      <div className="tb-ev-ticket-head">
        <h3 className="tb-ev-title">{t.title}</h3>
        {t.offer ? <span className="tb-ev-chip">{t.offer}</span> : null}
        {t.soldOut && !button ? <span className="tb-ev-chip tb-ev-chip--off">Sold out</span> : null}
      </div>
      {price(t)}
      {p.showDescription && t.description ? <p className="tb-ev-desc">{plain(t.description)}</p> : null}
      {dates(t)}
      {left(t)}
      <div className="tb-ev-push">{cta(t)}</div>
    </article>
  );

  const grid = (tickets: Ticket[]) => {
    const hl = highlightId(tickets);
    return (
      <div className={`tb-ev-grid${layout === "pricing" ? " tb-ev-pricing" : ""}`} style={gridStyle(columns, 240)}>
        {tickets.map((t) => card(t, hl))}
      </div>
    );
  };

  return (
    <WithData source="tickets" block={block} isEmpty={(d) => visible(d).length === 0}>
      {(data) => {
        const cats = visible(data);
        const all = cats.flatMap((c) => c.tickets);
        if (layout === "list") {
          return (
            <div className="tb-ev-table">
              {all.map((t) => (
                <div key={t.id} className={`tb-ev-table-row${t.soldOut ? " tb-ev-sold" : ""}`}>
                  <div className="tb-ev-body">
                    <strong className="tb-ev-name">{t.title}</strong>
                    {cats.length > 1 ? <span className="tb-ev-sub">{t.category}</span> : null}
                    {p.showDescription && t.description ? <p className="tb-ev-desc">{plain(t.description)}</p> : null}
                    {dates(t)}
                    {left(t)}
                  </div>
                  {price(t)}
                  {cta(t)}
                </div>
              ))}
            </div>
          );
        }
        if (layout === "all" || layout === "pricing") return grid(all);
        if (layout === "tabs") {
          return (
            <Tabs
              name={`tk-${block.nodeId}`}
              tabs={cats.map((c) => ({ id: c.id || c.name, label: c.name, content: grid(c.tickets) }))}
            />
          );
        }
        return (
          <div className="tb-ev-stack tb-ev-stack--lg">
            {cats.map((c) => (
              <div key={c.id || c.name} className="tb-ev-group">
                {cats.length > 1 || !categoryFilter ? <h3 className="tb-ev-group-title">{c.name}</h3> : null}
                {grid(c.tickets)}
              </div>
            ))}
          </div>
        );
      }}
    </WithData>
  );
}

// ================================================================ Sessions
export function SessionsBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "tabs");
  const columns = num(p.columns, 3);
  const dayFilter = str(p.day).trim();
  const trackFilter = str(p.track).trim().toLowerCase();

  const visible = (days: SessionDay[]) =>
    days
      .filter((d) => layout === "tabs" || !dayFilter || d.day === dayFilter)
      .map((d) => ({ ...d, sessions: d.sessions.filter((x) => !trackFilter || layout === "byTrack" || x.track.toLowerCase() === trackFilter) }))
      .filter((d) => d.sessions.length > 0);

  const time = (x: Session) => (on(p.showTime) && x.start ? <span className="tb-ev-time">{x.end ? `${x.start} – ${x.end}` : x.start}</span> : null);
  const people = (list: SessionPerson[], label?: string) =>
    list.length ? (
      <div className="tb-ev-people">
        {label ? <span className="tb-ev-sub">{label}</span> : null}
        {list.map((sp) => (
          <span key={sp.id || sp.name} className="tb-ev-person">
            <Avatar name={sp.name} photo={sp.photo} className="tb-ev-photo tb-ev-photo--circle tb-ev-photo--xs" />
            {sp.name}
          </span>
        ))}
      </div>
    ) : null;
  const info = (x: Session, dayLabel?: string) => (
    <>
      <div className="tb-ev-meta">
        {dayLabel ? <span className="tb-ev-sub">{dayLabel}</span> : null}
        {p.showTrack && x.track ? (
          <span className="tb-ev-chip" style={x.trackColor ? ({ "--ev-chip": x.trackColor } as CSSProperties) : undefined}>
            {x.track}
          </span>
        ) : null}
        {p.showHall && x.hall ? <span className="tb-ev-sub">{x.hall}</span> : null}
      </div>
      <h3 className="tb-ev-title">{x.title}</h3>
      {p.showDescription && x.description ? <p className="tb-ev-desc">{plain(x.description)}</p> : null}
      {p.showSpeakers ? (
        <>
          {people(x.speakers)}
          {people(x.moderators, "Moderator")}
        </>
      ) : null}
    </>
  );

  const agenda = (sessions: Session[]) => (
    <div className="tb-ev-stack">
      {sessions.map((x) => (
        <article key={x.id} className={cardClass(p, "tb-ev-agenda")}>
          <div className="tb-ev-agenda-time">{time(x)}</div>
          <div className="tb-ev-body">{info(x)}</div>
        </article>
      ))}
    </div>
  );
  const timeline = (sessions: Session[]) => (
    <ol className="tb-ev-timeline">
      {sessions.map((x) => (
        <li key={x.id} className="tb-ev-timeline-item">
          <span className="tb-ev-dot" style={x.trackColor ? ({ "--ev-chip": x.trackColor } as CSSProperties) : undefined} />
          {time(x)}
          <div className={cardClass(p, "tb-ev-timeline-card")}>{info(x)}</div>
        </li>
      ))}
    </ol>
  );
  const cards = (sessions: Session[], dayOf?: (x: Session) => string) => (
    <div className="tb-ev-grid" style={gridStyle(columns, 240)}>
      {sessions.map((x) => (
        <article key={x.id} className={cardClass(p)}>
          {time(x)}
          {info(x, dayOf?.(x))}
        </article>
      ))}
    </div>
  );

  return (
    <WithData source="sessions" block={block} isEmpty={(d) => visible(d).length === 0}>
      {(data) => {
        const days = visible(data);
        if (layout === "tabs") {
          return <Tabs name={`ss-${block.nodeId}`} tabs={days.map((d) => ({ id: d.day || d.label, label: d.label || `Day ${d.day}`, content: agenda(d.sessions) }))} />;
        }
        if (layout === "byTrack") {
          const dayOf = new Map<string, string>();
          const groups: { name: string; items: Session[] }[] = [];
          for (const d of days) {
            for (const x of d.sessions) {
              dayOf.set(x.id, d.label);
              const name = x.track || "General";
              const g = groups.find((y) => y.name === name) ?? groups[groups.push({ name, items: [] }) - 1];
              g.items.push(x);
            }
          }
          return (
            <div className="tb-ev-stack tb-ev-stack--lg">
              {groups.map((g) => (
                <div key={g.name} className="tb-ev-group">
                  <h3 className="tb-ev-group-title">{g.name}</h3>
                  {cards(g.items, days.length > 1 ? (x) => dayOf.get(x.id) ?? "" : undefined)}
                </div>
              ))}
            </div>
          );
        }
        const render = layout === "timeline" ? timeline : layout === "grid" ? (s: Session[]) => cards(s) : agenda;
        return (
          <div className="tb-ev-stack tb-ev-stack--lg">
            {days.map((d) => (
              <div key={d.day || d.label} className="tb-ev-group">
                {days.length > 1 || !dayFilter ? <h3 className="tb-ev-group-title">{d.label || `Day ${d.day}`}</h3> : null}
                {render(d.sessions)}
              </div>
            ))}
          </div>
        );
      }}
    </WithData>
  );
}

// ================================================================ Tabs (CSS only, so they also work in exported HTML)
function Tabs({ name, tabs }: { name: string; tabs: { id: string; label: string; content: ReactNode }[] }) {
  if (tabs.length === 1) return <>{tabs[0].content}</>;
  return (
    <div className="tb-ev-tabs">
      {tabs.map((t, i) => (
        <input key={t.id} type="radio" name={name} id={`${name}-${i}`} defaultChecked={i === 0} />
      ))}
      <div className="tb-ev-tablist" role="tablist">
        {tabs.map((t, i) => (
          <label key={t.id} htmlFor={`${name}-${i}`} role="tab">
            {t.label}
          </label>
        ))}
      </div>
      <div className="tb-ev-panels">
        {tabs.map((t) => (
          <div key={t.id} className="tb-ev-panel" role="tabpanel">
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export const EVENT_BLOCKS: Record<EventSource, (b: EventBlockProps) => ReactNode> = {
  speakers: SpeakersBlock,
  sponsors: SponsorsBlock,
  tickets: TicketsBlock,
  sessions: SessionsBlock,
};
