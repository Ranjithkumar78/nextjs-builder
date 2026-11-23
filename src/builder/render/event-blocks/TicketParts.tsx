import type { Ticket } from "../../eventData/types";
import type { NodeProps } from "../../types";
import { formatPrice } from "../../eventData/format";
import { plainText } from "../../lib/html";
import { str } from "../../lib/values";
import { Desc } from "./parts";
import { cardClass } from "./types";

/** Display options shared by every ticket layout. */
export interface TicketView {
  p: NodeProps;
  currency: string;
  /** Button text; empty hides the button. */
  button: string;
  edit: boolean;
}

export function TicketPrice({ t, v }: { t: Ticket; v: TicketView }) {
  return (
    <div className="tb-ev-price">
      <span className="tb-ev-price-now">{formatPrice(t.price, v.currency)}</span>
      {t.price !== null && t.basePrice > t.price ? <s className="tb-ev-price-was">{formatPrice(t.basePrice, v.currency)}</s> : null}
    </div>
  );
}

/** Description, sale dates and tickets left, as enabled. */
export function TicketDetails({ t, v }: { t: Ticket; v: TicketView }) {
  const { p } = v;
  return (
    <>
      {p.showDescription && t.description ? <Desc text={plainText(t.description)} /> : null}
      {p.showDates && (t.dateRange || t.endDate) ? <p className="tb-ev-sub">{t.dateRange || (t.endDate ? `Sale ends ${t.endDate}` : "")}</p> : null}
      {p.showRemaining && t.remaining !== null && !t.soldOut ? <p className="tb-ev-sub tb-ev-left">{t.remaining} left</p> : null}
    </>
  );
}

/** "Book now" link ({ticket} in the link becomes the ticket ID), or "Sold out". */
export function TicketButton({ t, v }: { t: Ticket; v: TicketView }) {
  if (!v.button) return null;
  if (t.soldOut) return <span className="tb-ev-btn tb-ev-btn--off">Sold out</span>;
  const href = str(v.p.buttonHref, "#").replace(/\{ticket\}/g, encodeURIComponent(t.id)) || "#";
  return (
    <a className="tb-ev-btn" href={v.edit ? undefined : href}>
      {v.button}
    </a>
  );
}

/** A ticket card (grid, pricing, category and tab layouts). */
export function TicketCard({ t, v, align, highlighted }: { t: Ticket; v: TicketView; align: string; highlighted: boolean }) {
  const cls = cardClass(v.p, `tb-ev-ticket tb-ev-align-${align}${highlighted ? " tb-ev-hl" : ""}${t.soldOut ? " tb-ev-sold" : ""}`);
  return (
    <article className={cls}>
      {highlighted ? <span className="tb-ev-ribbon">Recommended</span> : null}
      <div className="tb-ev-ticket-head">
        <h3 className="tb-ev-title">{t.title}</h3>
        {t.offer ? <span className="tb-ev-chip">{t.offer}</span> : null}
        {t.soldOut && !v.button ? <span className="tb-ev-chip tb-ev-chip--off">Sold out</span> : null}
      </div>
      <TicketPrice t={t} v={v} />
      <TicketDetails t={t} v={v} />
      <div className="tb-ev-push">
        <TicketButton t={t} v={v} />
      </div>
    </article>
  );
}

/** A row in the compact list layout. */
export function TicketRow({ t, v, showCategory }: { t: Ticket; v: TicketView; showCategory: boolean }) {
  return (
    <div className={`tb-ev-table-row${t.soldOut ? " tb-ev-sold" : ""}`}>
      <div className="tb-ev-body">
        <strong className="tb-ev-name">{t.title}</strong>
        {showCategory ? <span className="tb-ev-sub">{t.category}</span> : null}
        <TicketDetails t={t} v={v} />
      </div>
      <TicketPrice t={t} v={v} />
      <TicketButton t={t} v={v} />
    </div>
  );
}
