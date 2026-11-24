/** Icon list, counter, progress bar, star rating, alert box and table. */
export function widgetRules(r: string): string {
  return `:where(${r}) .tb-t-icon svg{display:block}
:where(${r}) .tb-t-iconlist{list-style:none}
:where(${r}) .tb-t-iconlist li{display:flex;align-items:flex-start;gap:10px}
:where(${r}) .tb-il-icon{display:inline-flex;flex-shrink:0;margin-top:.2em}
:where(${r}) .tb-progress-head{display:flex;justify-content:space-between;gap:12px}
:where(${r}) .tb-progress-track{height:10px;border-radius:999px;background:var(--tb-border);overflow:hidden}
:where(${r}) .tb-progress-bar{height:100%;border-radius:inherit;background:var(--tb-primary);transform-origin:left}
.tb-js :where(${r}) [data-tb-reveal] .tb-progress-bar{transform:scaleX(0);transition:transform 1.2s ease}
.tb-js :where(${r}) [data-tb-reveal].tb-in .tb-progress-bar{transform:none}
:where(${r}) .tb-stars{letter-spacing:2px;line-height:1;background:linear-gradient(90deg,currentColor var(--tb-rating),color-mix(in srgb,currentColor 25%,transparent) var(--tb-rating));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
:where(${r}) .tb-rating-label{font-size:.7em;font-weight:500;color:var(--tb-muted)}
:where(${r}) .tb-t-alert{position:relative;--tb-alert:var(--tb-primary);border:1px solid color-mix(in srgb,var(--tb-alert) 35%,transparent);background:color-mix(in srgb,var(--tb-alert) 10%,var(--tb-background));color:var(--tb-text)}
:where(${r}) .tb-alert--success{--tb-alert:#16a34a}
:where(${r}) .tb-alert--warning{--tb-alert:#d97706}
:where(${r}) .tb-alert--error{--tb-alert:#dc2626}
:where(${r}) .tb-alert-icon{flex-shrink:0;margin-top:.1em;color:var(--tb-alert)}
:where(${r}) .tb-alert-body{display:flex;flex-direction:column;gap:2px}
:where(${r}) .tb-t-alert .tb-dismiss{top:14px;transform:none}
:where(${r}) .tb-table-wrap{overflow-x:auto}
:where(${r}) .tb-table{width:100%;border-collapse:collapse}
:where(${r}) .tb-table th,:where(${r}) .tb-table td{padding:10px 14px;border-bottom:1px solid var(--tb-border);text-align:left;vertical-align:top}
:where(${r}) .tb-table th{font-weight:700;background:var(--tb-surface)}
:where(${r}) .tb-table--striped tbody tr:nth-child(even){background:color-mix(in srgb,var(--tb-surface) 60%,transparent)}
`;
}
