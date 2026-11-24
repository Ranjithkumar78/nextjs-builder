import { createElement, type CSSProperties } from "react";
import { num, str } from "../../lib/values";
import type { Renderer } from "../types";

/** Shape divider outlines (1200×120); the shape is filled with the element's text color. */
const SHAPES: Record<string, string> = {
  wave: "M0 64C200 112 400 16 600 64S1000 16 1200 64V120H0Z",
  curve: "M0 120Q600 0 1200 120Z",
  slant: "M0 120L1200 0V120Z",
  triangle: "M0 120L600 0L1200 120Z",
  zigzag: "M0 120V60L100 0L200 60L300 0L400 60L500 0L600 60L700 0L800 60L900 0L1000 60L1100 0L1200 60V120Z",
};

/** Image grid; with "lightbox" on, the runtime script opens images full screen. */
const gallery: Renderer = ({ p, attrs }) => {
  const images = Array.isArray(p.images) ? (p.images as string[]) : [];
  const cols = Math.max(1, Math.round(num(p.columns, 3)));
  const style = { "--tb-gal-cols": cols, "--tb-gal-cm": Math.min(2, cols), "--tb-gal-gap": `${num(p.gap, 12)}px`, "--tb-gal-ratio": str(p.ratio, "4 / 3") } as CSSProperties;
  return createElement(
    "div",
    { ...attrs, style, "data-tb-lightbox": p.lightbox ? "" : undefined },
    // eslint-disable-next-line @next/next/no-img-element
    images.map((src, i) => <img key={i} className="tb-gal-img" src={src} alt="" loading="lazy" />),
  );
};

/** Without a file the editor shows a placeholder (so the element can be found and selected); pages show nothing. */
const audio: Renderer = ({ p, attrs, rc }) =>
  createElement(
    "div",
    attrs,
    p.url ? <audio controls preload="metadata" src={str(p.url)} style={{ width: "100%" }} /> : rc.edit ? <div className="tb-media-empty">♪ Audio — add a file URL in the Edit tab</div> : null,
  );

const shape: Renderer = ({ p, attrs }) =>
  createElement(
    "div",
    { ...attrs, className: `${attrs.className}${p.flip ? " tb-shape-flip" : ""}${p.mirror ? " tb-shape-mirror" : ""}`, "aria-hidden": true },
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d={SHAPES[str(p.shape)] ?? SHAPES.wave} fill="currentColor" />
    </svg>,
  );

export const MEDIA_EXTRA_RENDERERS: Record<string, Renderer> = { gallery, audio, shape };
