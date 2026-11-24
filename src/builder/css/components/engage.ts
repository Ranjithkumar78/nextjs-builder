/** Announcement bar, floating buttons (back to top, WhatsApp), share buttons. */
export function engageRules(r: string): string {
  return `:where(${r}) .tb-t-announcement{position:relative}
:where(${r}) .tb-announce-link{font-weight:700;text-decoration:underline}
:where(${r}) .tb-dismiss{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:inline-flex;padding:4px;background:transparent;color:inherit;opacity:.8;cursor:pointer}
:where(${r}) .tb-dismiss:hover{opacity:1}
:where(${r}) [data-tb-dismissed]{display:none!important}
:where(${r}) [data-tb-float]{position:fixed;bottom:var(--tb-fy,24px);z-index:70}
:where(${r}) [data-tb-float="right"]{right:24px}
:where(${r}) [data-tb-float="left"]{left:24px}
.tb-js :where(${r}) .tb-t-backtotop[data-tb-float]{opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .25s,transform .25s}
.tb-js :where(${r}) .tb-t-backtotop[data-tb-float].tb-show{opacity:1;pointer-events:auto;transform:none}
:where(${r}) .tb-t-backtotop,:where(${r}) .tb-t-whatsapp{gap:8px;cursor:pointer;transition:opacity .2s,transform .2s}
:where(${r}) .tb-t-whatsapp:hover{opacity:.9}
:where(${r}) .tb-share-label{font-weight:600;margin-right:4px}
:where(${r}) .tb-share-btn{display:inline-flex;align-items:center;padding:7px 14px;border:1px solid var(--tb-border);border-radius:999px;background:var(--tb-background);color:var(--tb-text);font-size:inherit;font-weight:500;cursor:pointer;transition:border-color .2s,color .2s}
:where(${r}) .tb-share-btn:hover{border-color:var(--tb-primary);color:var(--tb-primary)}
`;
}

/** Checkbox and radio choices. */
export function choiceRules(r: string): string {
  return `:where(${r}) .tb-check{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:.95em}
:where(${r}) .tb-check input{width:18px;height:18px;margin-top:2px;flex-shrink:0;accent-color:var(--tb-primary)}
:where(${r}) fieldset.tb-field{gap:10px}
:where(${r}) .tb-file{padding:10px}
:where(${r}) .tb-t-calendar .tb-share-label{display:inline-flex;align-items:center;gap:6px}
`;
}
