/** Accordion, tab panels, slider and popup. */
export function interactiveRules(r: string): string {
  return `:where(${r}) .tb-acc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;font-weight:600;cursor:pointer;list-style:none}
:where(${r}) .tb-acc-head::-webkit-details-marker{display:none}
:where(${r}) .tb-acc-icon{flex-shrink:0;transition:transform .2s}
:where(${r}) [open]>.tb-acc-head .tb-acc-icon{transform:rotate(180deg)}
:where(${r}) .tb-acc-body{display:flex;flex-direction:column;gap:12px;padding:0 20px 18px}
:where(${r}) .tb-t-tab>*+*{margin-top:12px}
`;
}

/** Slider: slides per view come from inline variables (desktop / mobile). */
export function sliderRules(r: string): string {
  return `:where(${r}) .tb-slider{position:relative;--tb-spv:var(--tb-spv-d,1)}
:where(${r}) .tb-slider-track{display:flex;gap:var(--tb-sgap,16px);overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none}
:where(${r}) .tb-slider-track::-webkit-scrollbar{display:none}
:where(${r}) .tb-slider-track>*{flex:0 0 calc((100% - (var(--tb-spv) - 1) * var(--tb-sgap,16px)) / var(--tb-spv));min-width:0;scroll-snap-align:start}
:where(${r}) .tb-slider-btn{position:absolute;top:50%;z-index:2;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;margin-top:-22px;border-radius:999px;background:var(--tb-background);color:var(--tb-text);box-shadow:0 4px 16px rgba(0,0,0,.15);cursor:pointer}
:where(${r}) .tb-slider-prev{left:12px}
:where(${r}) .tb-slider-next{right:12px}
:where(${r}) .tb-slider-dots{display:flex;justify-content:center;gap:8px;margin-top:14px}
:where(${r}) .tb-slider-dots button{width:9px;height:9px;border-radius:999px;background:var(--tb-border);cursor:pointer;transition:width .2s,background .2s}
:where(${r}) .tb-slider-dots button[aria-current]{width:22px;background:var(--tb-primary)}
:where(${r}) dialog.tb-popup{width:100%;max-width:min(92vw,560px);max-height:90vh;margin:auto;padding:0;border:0;overflow:auto;border-radius:var(--tb-radius);background:var(--tb-background);color:var(--tb-text);box-shadow:0 30px 80px -20px rgba(0,0,0,.5)}
:where(${r}) dialog.tb-popup::backdrop{background:rgba(15,23,42,.6)}
:where(${r}) .tb-popup-body{display:flex;flex-direction:column;gap:14px;padding:32px}
:where(${r}) .tb-popup-close{position:absolute;top:10px;right:10px;display:inline-flex;padding:6px;border-radius:999px;background:transparent;color:inherit;cursor:pointer}
:where(${r}) .tb-popup-edit{border:2px dashed var(--tb-primary);border-radius:var(--tb-radius)}
:where(${r}) .tb-popup-tag{padding:6px 12px;font:600 12px system-ui,sans-serif;color:var(--tb-primary);background:color-mix(in srgb,var(--tb-primary) 10%,transparent)}
`;
}
