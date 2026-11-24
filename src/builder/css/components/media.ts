import type { QueryMode } from "../declarations";
import { atMost } from "../responsive";

/** Gallery, shape divider and section background video. */
export function mediaRules(r: string, mode: QueryMode): string {
  return (
    `:where(${r}) .tb-t-gallery{display:grid;grid-template-columns:repeat(var(--tb-gal-cols,3),minmax(0,1fr));gap:var(--tb-gal-gap,12px)}
:where(${r}) .tb-gal-img{width:100%;height:100%;aspect-ratio:var(--tb-gal-ratio,4 / 3);object-fit:cover;border-radius:calc(var(--tb-radius) / 2)}
:where(${r}) [data-tb-lightbox] .tb-gal-img{cursor:zoom-in}
:where(${r}) .tb-t-shape svg{display:block;width:100%;height:100%}
:where(${r}) .tb-media-empty{padding:16px;border:1px dashed var(--tb-border);border-radius:var(--tb-radius);color:var(--tb-muted);font-size:14px;text-align:center}
:where(${r}) .tb-shape-flip svg{transform:scaleY(-1)}
:where(${r}) .tb-shape-mirror svg{transform:scaleX(-1)}
:where(${r}) .tb-shape-flip.tb-shape-mirror svg{transform:scale(-1,-1)}
:where(${r}) .tb-has-bgvideo{position:relative;overflow:hidden;isolation:isolate}
:where(${r}) .tb-bgvideo-wrap{position:absolute;inset:0;z-index:-1;pointer-events:none}
:where(${r}) .tb-bgvideo{width:100%;height:100%;object-fit:cover}
` + atMost(mode, "mobile", `:where(${r}) .tb-t-gallery{grid-template-columns:repeat(var(--tb-gal-cm,2),minmax(0,1fr))}`)
  );
}
