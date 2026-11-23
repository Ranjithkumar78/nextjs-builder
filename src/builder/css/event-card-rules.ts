/** Event-data blocks: grids, cards, photos, logos, chips and buttons. */
export function eventCardRules(r: string): string {
  return `
:where(${r}) .tb-ev-grid{width:100%;display:grid;gap:var(--ev-gap,24px);grid-template-columns:repeat(auto-fill,minmax(max(var(--ev-min,200px),calc((100% - (var(--ev-cols,4) - 1) * var(--ev-gap,24px)) / var(--ev-cols,4))),1fr))}
:where(${r}) .tb-ev-stack{display:flex;flex-direction:column;gap:16px}
:where(${r}) .tb-ev-stack--lg{gap:40px}
:where(${r}) .tb-ev-group{display:flex;flex-direction:column;gap:18px}
:where(${r}) .tb-ev-group-title{font-size:1.35em;color:var(--tb-text)}
:where(${r}) .tb-ev-align-center{text-align:center;align-items:center}
:where(${r}) .tb-ev-align-left{text-align:left;align-items:flex-start}
:where(${r}) .tb-ev-card{position:relative;display:flex;flex-direction:column;gap:8px;padding:22px;border-radius:var(--tb-radius);background:color-mix(in srgb,var(--tb-surface) 55%,var(--tb-background));color:var(--tb-text);transition:transform .2s,box-shadow .2s}
:where(${r}) .tb-ev-card--elevated{box-shadow:0 1px 2px rgba(15,23,42,.06),0 8px 24px rgba(15,23,42,.08)}
:where(${r}) .tb-ev-card--elevated:hover{transform:translateY(-3px);box-shadow:0 2px 4px rgba(15,23,42,.08),0 16px 32px rgba(15,23,42,.12)}
:where(${r}) .tb-ev-card--bordered{border:1px solid var(--tb-border)}
:where(${r}) .tb-ev-card--filled{background:var(--tb-surface)}
:where(${r}) .tb-ev-card--flat{background:transparent;padding:0}
:where(${r}) .tb-ev-title{font-size:1.1em;line-height:1.3;color:inherit}
:where(${r}) .tb-ev-name{font-weight:600;line-height:1.3}
:where(${r}) .tb-ev-sub{font-size:.875em;color:var(--tb-muted)}
:where(${r}) .tb-ev-desc{font-size:.9em;color:var(--tb-muted);white-space:pre-line;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
:where(${r}) .tb-ev-body{display:flex;flex-direction:column;gap:6px;min-width:0;flex:1}
:where(${r}) .tb-ev-note{padding:18px 20px;border:1px dashed var(--tb-border);border-radius:var(--tb-radius);font-size:14px;color:var(--tb-muted);background:var(--tb-surface)}
:where(${r}) .tb-ev-note--error{border-color:#fca5a5;color:#b91c1c;background:#fef2f2}
:where(${r}) .tb-ev-empty{color:var(--tb-muted);text-align:center;padding:24px 0}
:where(${r}) .tb-ev-skel{height:220px;border-radius:var(--tb-radius);background:linear-gradient(90deg,var(--tb-surface) 25%,var(--tb-border) 50%,var(--tb-surface) 75%);background-size:200% 100%;animation:tb-ev-shine 1.4s linear infinite;opacity:.6}
@keyframes tb-ev-shine{to{background-position:-200% 0}}
:where(${r}) .tb-ev-photo{object-fit:cover;flex-shrink:0;background:var(--tb-surface)}
:where(${r}) .tb-ev-photo--circle{border-radius:50%}
:where(${r}) .tb-ev-photo--rounded{border-radius:calc(var(--tb-radius) + 4px)}
:where(${r}) .tb-ev-photo--square{border-radius:0}
:where(${r}) .tb-ev-photo--lg{width:120px;height:120px;margin-bottom:6px}
:where(${r}) .tb-ev-photo--md{width:84px;height:84px}
:where(${r}) .tb-ev-photo--xs{width:24px;height:24px;font-size:10px}
:where(${r}) .tb-ev-initials{display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:1.6em;color:var(--tb-primary);background:color-mix(in srgb,var(--tb-primary) 12%,transparent)}
:where(${r}) .tb-ev-align-center>.tb-ev-photo,:where(${r}) .tb-ev-align-center .tb-ev-compact>.tb-ev-photo{margin-left:auto;margin-right:auto}
:where(${r}) .tb-ev-row{flex-direction:row;align-items:flex-start;gap:20px}
:where(${r}) .tb-ev-compact{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
:where(${r}) .tb-ev-spot{padding:0;overflow:hidden}
:where(${r}) .tb-ev-spot-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:flex;font-size:3em}
:where(${r}) .tb-ev-spot-text{display:flex;flex-direction:column;gap:6px;padding:16px 18px 20px}
:where(${r}) .tb-ev-scroll{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(220px,260px);gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 2px 16px}
:where(${r}) .tb-ev-scroll>*{scroll-snap-align:start}
:where(${r}) .tb-ev-logo{height:var(--ev-logo-h,64px);width:auto;max-width:100%;object-fit:contain;display:block}
:where(${r}) .tb-ev-logo-text{display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--tb-muted)}
:where(${r}) .tb-ev-logo-card{align-items:center;justify-content:center;text-align:center;min-height:calc(var(--ev-logo-h,64px) + 44px)}
:where(${r}) .tb-ev-logo-box{display:flex;align-items:center;min-height:var(--ev-logo-h,64px)}
:where(${r}) .tb-ev-align-center .tb-ev-logo-box{justify-content:center}
:where(${r}) .tb-ev-grey .tb-ev-logo{filter:grayscale(1);opacity:.7;transition:filter .2s,opacity .2s}
:where(${r}) .tb-ev-grey :hover>.tb-ev-logo,:where(${r}) .tb-ev-grey .tb-ev-logo:hover{filter:none;opacity:1}
:where(${r}) .tb-ev-strip{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:28px 48px}
:where(${r}) .tb-ev-strip-item{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
:where(${r}) .tb-ev-marquee{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
:where(${r}) .tb-ev-marquee-track{display:flex;width:max-content;gap:56px;animation:tb-ev-marquee 30s linear infinite}
:where(${r}) .tb-ev-marquee:hover .tb-ev-marquee-track{animation-play-state:paused}
:where(${r}) .tb-ev-marquee-copy{display:flex;gap:56px}
@keyframes tb-ev-marquee{to{transform:translateX(calc(-50% - 28px))}}
:where(${r}) .tb-ev-chip{display:inline-flex;align-items:center;align-self:flex-start;gap:4px;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;color:var(--ev-chip,var(--tb-primary));background:color-mix(in srgb,var(--ev-chip,var(--tb-primary)) 12%,transparent)}
:where(${r}) .tb-ev-align-center .tb-ev-chip{align-self:center}
:where(${r}) .tb-ev-chip--off{--ev-chip:#dc2626}
:where(${r}) .tb-ev-link{font-size:.9em;font-weight:600;color:var(--tb-primary)}
`;
}
