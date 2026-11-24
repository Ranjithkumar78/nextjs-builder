import { createElement } from "react";
import { str } from "../../lib/values";
import { Icon } from "../../ui/Icon";
import { InlineText } from "../InlineText";
import type { Renderer } from "../types";

/** Accordion and tabs. Children render inside a [data-kids] wrapper so canvas drops land in the right place. */
const accordion: Renderer = ({ p, attrs, kids }) => createElement("div", { ...attrs, "data-tb-accordion": p.single ? "single" : "multi" }, kids());

/** Native <details>: works without a script; always open while editing so its content can be edited. */
const accordionItem: Renderer = ({ node, p, attrs, rc, kids }) =>
  createElement(
    "details",
    { ...attrs, open: rc.edit || !!p.open },
    <summary className="tb-acc-head">
      <InlineText node={node} rc={rc} tag="span" textKey="title" singleLine />
      <Icon name="chevronDown" size="18" className="tb-acc-icon" />
    </summary>,
    <div className="tb-acc-body" data-kids="">
      {kids()}
    </div>,
  );

/** CSS-only tabs (radio inputs + labels), sharing the event-block tab styles; works in exported HTML. */
const tabs: Renderer = ({ node, attrs, kids }) => {
  const panels = node.children ?? [];
  const name = `tabs-${node.id}`;
  return createElement(
    "div",
    { ...attrs, className: `${attrs.className} tb-ev-tabs` },
    panels.map((t, i) => <input key={t.id} type="radio" name={name} id={`${name}-${i}`} defaultChecked={i === 0} />),
    <div className="tb-ev-tablist" role="tablist">
      {panels.map((t, i) => (
        <label key={t.id} htmlFor={`${name}-${i}`} role="tab">
          {str(t.props.title, `Tab ${i + 1}`)}
        </label>
      ))}
    </div>,
    <div className="tb-ev-panels" data-kids="">
      {kids()}
    </div>,
  );
};

const tab: Renderer = ({ attrs, kids }) => createElement("div", { ...attrs, className: `${attrs.className} tb-ev-panel`, role: "tabpanel" }, kids());

export const INTERACTIVE_RENDERERS: Record<string, Renderer> = { accordion, "accordion-item": accordionItem, tabs, tab };
