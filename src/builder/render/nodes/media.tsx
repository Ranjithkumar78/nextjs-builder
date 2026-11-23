import { createElement } from "react";
import { str } from "../../lib/values";
import { mapEmbed, videoEmbed } from "../../lib/embeds";
import { Countdown } from "../Countdown";
import type { Renderer } from "../types";

/** Image, video, map, countdown and HTML embed. */
export const MEDIA_RENDERERS: Record<string, Renderer> = {
  image: ({ p, attrs, rc, href }) => {
    const img = createElement("img", { ...attrs, src: str(p.src) || undefined, alt: str(p.alt), loading: "lazy", draggable: rc.edit ? true : undefined });
    if (!rc.edit && p.href)
      return (
        <a href={href(p.href)} style={{ display: "contents" }}>
          {img}
        </a>
      );
    return img;
  },
  video: ({ p, attrs }) => {
    const v = videoEmbed(str(p.url));
    return createElement(
      "div",
      attrs,
      <div className="tb-embed-ratio">
        {v.kind === "iframe" ? (
          <iframe src={v.src} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <video src={v.src} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>,
    );
  },
  map: ({ p, attrs }) =>
    createElement(
      "div",
      attrs,
      <div className="tb-embed-ratio">
        <iframe src={mapEmbed(str(p.query), Number(p.zoom) || 13)} title="Map" loading="lazy" />
      </div>,
    ),
  countdown: ({ p, attrs }) => createElement("div", { ...attrs, "data-countdown": str(p.target) }, <Countdown target={str(p.target)} labels={p.showLabels !== false} />),
  embed: ({ p, attrs }) => createElement("div", { ...attrs, dangerouslySetInnerHTML: { __html: str(p.html) } }),
};
