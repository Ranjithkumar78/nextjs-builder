/** Event-data blocks: tickets, tables, agenda, timeline and CSS-only tabs (up to 12, so they work in exported HTML). */
export function eventLayoutRules(r: string): string {
  return `
:where(${r}) .tb-ev-ticket-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
:where(${r}) .tb-ev-align-center .tb-ev-ticket-head{justify-content:center}
:where(${r}) .tb-ev-price{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
:where(${r}) .tb-ev-align-center .tb-ev-price{justify-content:center}
:where(${r}) .tb-ev-price-now{font-family:var(--tb-heading-font);font-size:1.75em;font-weight:700;color:var(--tb-text)}
:where(${r}) .tb-ev-price-was{color:var(--tb-muted)}
:where(${r}) .tb-ev-pricing .tb-ev-price-now{font-size:2.4em}
:where(${r}) .tb-ev-pricing .tb-ev-card{padding:30px 26px}
:where(${r}) .tb-ev-push{margin-top:auto;padding-top:8px;display:flex}
:where(${r}) .tb-ev-align-center .tb-ev-push{justify-content:center}
:where(${r}) .tb-ev-btn{display:inline-flex;align-items:center;justify-content:center;padding:11px 22px;border-radius:var(--tb-radius);background:var(--tb-primary);color:var(--tb-background);font-weight:600;font-size:.95em;transition:opacity .2s;cursor:pointer}
:where(${r}) .tb-ev-btn:hover{opacity:.88}
:where(${r}) .tb-ev-btn--off{background:var(--tb-border);color:var(--tb-muted);cursor:not-allowed}
:where(${r}) .tb-ev-pricing .tb-ev-btn{width:100%}
:where(${r}) .tb-ev-hl{outline:2px solid var(--tb-primary);outline-offset:-2px}
:where(${r}) .tb-ev-ribbon{position:absolute;top:14px;right:14px;padding:3px 10px;border-radius:999px;background:var(--tb-primary);color:var(--tb-background);font-size:11px;font-weight:700;letter-spacing:.3px}
:where(${r}) .tb-ev-sold{opacity:.65}
:where(${r}) .tb-ev-left{color:var(--tb-accent);font-weight:600}
:where(${r}) .tb-ev-table{display:flex;flex-direction:column;border:1px solid var(--tb-border);border-radius:var(--tb-radius);overflow:hidden}
:where(${r}) .tb-ev-table-row{display:flex;align-items:center;gap:20px;padding:16px 20px;background:var(--tb-background)}
:where(${r}) .tb-ev-table-row+.tb-ev-table-row{border-top:1px solid var(--tb-border)}
:where(${r}) .tb-ev-table-row .tb-ev-price-now{font-size:1.2em}
:where(${r}) .tb-ev-time{font-size:.85em;font-weight:600;color:var(--tb-primary);white-space:nowrap}
:where(${r}) .tb-ev-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}
:where(${r}) .tb-ev-people{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-top:2px}
:where(${r}) .tb-ev-person{display:inline-flex;align-items:center;gap:6px;font-size:.875em;font-weight:500}
:where(${r}) .tb-ev-person .tb-ev-initials{font-size:10px}
:where(${r}) .tb-ev-agenda{flex-direction:row;gap:24px}
:where(${r}) .tb-ev-agenda-time{flex:0 0 160px;padding-top:2px}
:where(${r}) .tb-ev-timeline{list-style:none;position:relative;display:flex;flex-direction:column;gap:22px;padding-left:28px}
:where(${r}) .tb-ev-timeline::before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--tb-border)}
:where(${r}) .tb-ev-timeline-item{position:relative;display:flex;flex-direction:column;gap:8px}
:where(${r}) .tb-ev-dot{position:absolute;left:-27px;top:3px;width:14px;height:14px;border-radius:50%;background:var(--ev-chip,var(--tb-primary));box-shadow:0 0 0 4px var(--tb-background)}
:where(${r}) .tb-ev-timeline-card{gap:6px}
:where(${r}) .tb-ev-tabs{display:flex;flex-direction:column;gap:22px}
:where(${r}) .tb-ev-tabs>input{position:absolute;opacity:0;pointer-events:none;width:0;height:0}
:where(${r}) .tb-ev-tablist{display:flex;flex-wrap:wrap;gap:8px}
:where(${r}) .tb-ev-tablist>label{padding:9px 18px;border:1px solid var(--tb-border);border-radius:999px;font-weight:600;font-size:.95em;cursor:pointer;background:var(--tb-background);transition:background .2s,color .2s}
:where(${r}) .tb-ev-panel{display:none}
${Array.from({ length: 12 }, (_, i) => i + 1)
  .map((n) => `:where(${r}) .tb-ev-tabs>input:nth-of-type(${n}):checked~.tb-ev-panels>.tb-ev-panel:nth-child(${n}){display:block}
:where(${r}) .tb-ev-tabs>input:nth-of-type(${n}):checked~.tb-ev-tablist>label:nth-child(${n}){background:var(--tb-primary);color:var(--tb-background);border-color:var(--tb-primary)}`)
  .join("\n")}
:where(${r}) .tb-ev-tabs>input:focus-visible~.tb-ev-tablist{outline:2px solid var(--tb-primary);outline-offset:4px;border-radius:12px}
:where(${r}) .tb-ev-agenda,:where(${r}) .tb-ev-row,:where(${r}) .tb-ev-table-row{flex-wrap:wrap}
:where(${r}) .tb-ev-agenda>.tb-ev-body,:where(${r}) .tb-ev-row>.tb-ev-body,:where(${r}) .tb-ev-table-row>.tb-ev-body{flex:1 1 240px}
`;
}
