import type { Ticket, TicketCategory } from "../../eventData/types";
import { num, on, str } from "../../lib/values";
import { EvGrid, Groups } from "./parts";
import { Tabs } from "./Tabs";
import { TicketCard, TicketRow, type TicketView } from "./TicketParts";
import type { EventBlockProps } from "./types";
import { WithData } from "./WithData";

export function TicketsBlock(block: EventBlockProps) {
  const p = block.props;
  const layout = str(p.layout, "byCategory");
  const columns = num(p.columns, 3);
  const categoryFilter = str(p.category).trim().toLowerCase();
  const align = str(p.align, "left");
  const highlight = str(p.highlight).trim().toLowerCase();
  const view: TicketView = { p, currency: str(p.currency, "₹"), button: str(p.buttonText), edit: block.edit };

  // Tabs show every category; other layouts can be limited to one. Sold-out tickets can be hidden.
  const visible = (cats: TicketCategory[]) =>
    cats
      .filter((c) => layout === "tabs" || !categoryFilter || c.name.toLowerCase() === categoryFilter)
      .map((c) => ({ ...c, tickets: c.tickets.filter((t) => on(p.showSoldOut) || !t.soldOut) }))
      .filter((c) => c.tickets.length > 0);

  const grid = (tickets: Ticket[]) => {
    const hl = highlight ? tickets.find((t) => t.title.toLowerCase().includes(highlight))?.id : undefined;
    return (
      <EvGrid columns={columns} min={240} className={layout === "pricing" ? " tb-ev-pricing" : ""}>
        {tickets.map((t) => (
          <TicketCard key={t.id} t={t} v={view} align={align} highlighted={t.id === hl} />
        ))}
      </EvGrid>
    );
  };

  return (
    <WithData source="tickets" block={block} isEmpty={(d) => visible(d).length === 0}>
      {(data) => {
        const cats = visible(data);
        const all = cats.flatMap((c) => c.tickets);
        if (layout === "list")
          return (
            <div className="tb-ev-table">
              {all.map((t) => (
                <TicketRow key={t.id} t={t} v={view} showCategory={cats.length > 1} />
              ))}
            </div>
          );
        if (layout === "all" || layout === "pricing") return grid(all);
        if (layout === "tabs") return <Tabs name={`tk-${block.nodeId}`} tabs={cats.map((c) => ({ id: c.id || c.name, label: c.name, content: grid(c.tickets) }))} />;
        const titled = cats.length > 1 || !categoryFilter;
        return <Groups groups={cats.map((c) => ({ key: c.id || c.name, title: titled ? c.name : undefined, content: grid(c.tickets) }))} />;
      }}
    </WithData>
  );
}
