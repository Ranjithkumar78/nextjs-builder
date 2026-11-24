import { createElement, type CSSProperties } from "react";
import { num, str } from "../../lib/values";
import { Icon } from "../../ui/Icon";
import type { Renderer } from "../types";

/** Scroll-snap track (swipeable without a script); arrows, dots and autoplay come from the runtime script. */
const slider: Renderer = ({ p, attrs, kids }) => {
  const style = { "--tb-spv-d": Math.max(1, num(p.perView, 1)), "--tb-spv-m": Math.max(1, num(p.perViewMobile, 1)), "--tb-sgap": `${num(p.gap, 16)}px` } as CSSProperties;
  return createElement(
    "div",
    { ...attrs, style, "data-tb-slider": "", "data-autoplay": num(p.autoplay, 0) || undefined },
    <div className="tb-slider-track" data-kids="">
      {kids()}
    </div>,
    p.arrows ? (
      <>
        <button type="button" className="tb-slider-btn tb-slider-prev" data-tb-slide="-1" aria-label="Previous slide">
          <Icon name="chevronLeft" size="22" />
        </button>
        <button type="button" className="tb-slider-btn tb-slider-next" data-tb-slide="1" aria-label="Next slide">
          <Icon name="chevronRight" size="22" />
        </button>
      </>
    ) : null,
    p.dots ? <div className="tb-slider-dots" aria-label="Slides" /> : null,
  );
};

const slide: Renderer = ({ attrs, kids }) => createElement("div", attrs, kids());

/** A native <dialog>, opened by links to #ID. While editing it is shown in place so it can be edited. */
const popup: Renderer = ({ p, attrs, rc, kids }) => {
  const body = (
    <div className="tb-popup-body" data-kids="">
      {kids()}
    </div>
  );
  if (rc.edit)
    return createElement("div", { ...attrs, className: `${attrs.className} tb-popup-edit` }, <div className="tb-popup-tag">Popup · opens from links to #{str(p.htmlId)}</div>, body);
  const close = p.closeButton ? (
    <button type="button" className="tb-popup-close" data-tb-close="" aria-label="Close">
      <Icon name="close" size="18" />
    </button>
  ) : null;
  return createElement("dialog", { ...attrs, className: `${attrs.className} tb-popup` }, close, body);
};

export const CAROUSEL_RENDERERS: Record<string, Renderer> = { slider, slide, popup };
