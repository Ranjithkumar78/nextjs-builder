import { createElement } from "react";
import { str } from "../../lib/values";
import { escapeHtml } from "../../lib/html";
import type { Renderer } from "../types";

/**
 * Muted, looping video behind a section's content. Written as HTML because React does not output the
 * \`muted\` attribute, which browsers require for autoplay (also in exported pages).
 */
function BackgroundVideo({ src, shade }: { src: string; shade: string }) {
  const html = `<video class="tb-bgvideo" src="${escapeHtml(src)}" autoplay muted loop playsinline aria-hidden="true"></video>`;
  return (
    <>
      <div className="tb-bgvideo-wrap" dangerouslySetInnerHTML={{ __html: html }} />
      {shade ? <div className="tb-bgvideo-wrap" style={{ background: shade }} /> : null}
    </>
  );
}

/** Layout containers, spacer and divider. */
const div: Renderer = ({ attrs, kids }) => createElement("div", attrs, kids());

export const LAYOUT_RENDERERS: Record<string, Renderer> = {
  section: ({ p, attrs, kids }) => {
    const tag = str(p.tag, "section") || "section";
    if (!p.bgVideo) return createElement(tag, attrs, kids());
    return createElement(tag, { ...attrs, className: `${attrs.className} tb-has-bgvideo` }, <BackgroundVideo src={str(p.bgVideo)} shade={str(p.bgVideoShade)} />, kids());
  },
  box: ({ p, attrs, kids }) => createElement(str(p.tag, "div") || "div", attrs, kids()),
  container: div,
  row: div,
  column: div,
  grid: div,
  spacer: ({ attrs }) => createElement("div", { ...attrs, "aria-hidden": true }),
  divider: ({ attrs }) => createElement("hr", attrs),
};
