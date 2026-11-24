/** Entrance animations (hidden only once the runtime script has started) and the lightbox. */
export function motionRules(r: string): string {
  const a = `.tb-js :where(${r}) [data-tb-anim`;
  return `${a}]{opacity:0;transition:opacity .7s ease,transform .7s ease}
${a}="fade-up"]{transform:translateY(32px)}
${a}="fade-down"]{transform:translateY(-32px)}
${a}="slide-left"]{transform:translateX(48px)}
${a}="slide-right"]{transform:translateX(-48px)}
${a}="zoom"]{transform:scale(.92)}
${a}].tb-in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){${a}]{opacity:1;transform:none;transition:none}}
.tb-lightbox{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:48px 64px;background:rgba(0,0,0,.92)}
.tb-lightbox img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px}
.tb-lightbox button{position:absolute;display:flex;align-items:center;justify-content:center;width:48px;height:48px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font:28px/1 system-ui,sans-serif;cursor:pointer}
.tb-lightbox button:hover{background:rgba(255,255,255,.25)}
.tb-lightbox [data-lb="close"]{top:16px;right:16px}
.tb-lightbox [data-lb="-1"]{left:12px;top:50%;margin-top:-24px}
.tb-lightbox [data-lb="1"]{right:12px;top:50%;margin-top:-24px}
`;
}
