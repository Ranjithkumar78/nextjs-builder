import { createElement } from "react";
import { richHtml, NEW_TAB } from "../../lib/html";
import { str } from "../../lib/values";
import { InlineText } from "../InlineText";
import type { Attrs, RenderArgs, Renderer } from "../types";

/** Text elements, buttons, links and the logo. */
const linkAttrs = ({ p, href }: RenderArgs): Attrs => ({ href: href(p.href), ...(p.newTab ? NEW_TAB : {}) });
const link: Renderer = (a) => a.text("a", { ...a.attrs, ...linkAttrs(a) });

export const TEXT_RENDERERS: Record<string, Renderer> = {
  heading: ({ p, attrs, text }) => text(str(p.level, "h2") || "h2", attrs),
  text: ({ attrs, text }) => text("p", attrs),
  badge: ({ attrs, text }) => text("span", attrs),
  button: link,
  link,
  submit: ({ attrs, rc, text }) => text("button", { ...attrs, type: rc.edit ? "button" : "submit" }),
  quote: ({ node, p, attrs, rc }) =>
    createElement(
      "blockquote",
      attrs,
      <InlineText node={node} rc={rc} tag="p" singleLine={false} />,
      p.cite ? <cite style={{ display: "block", marginTop: 10, fontSize: "0.8em", fontStyle: "normal", opacity: 0.75 }}>— {str(p.cite)}</cite> : null,
    ),
  list: ({ p, attrs }) => {
    const items = Array.isArray(p.items) ? (p.items as string[]) : [];
    return createElement(
      p.ordered ? "ol" : "ul",
      attrs,
      items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: richHtml(str(it)) }} />),
    );
  },
  logo: ({ node, p, attrs, rc, href }) =>
    createElement(
      "a",
      { ...attrs, href: href(p.href || "/") },
      // eslint-disable-next-line @next/next/no-img-element
      p.src ? <img src={str(p.src)} alt={str(p.text)} style={{ height: "1.6em", width: "auto" }} /> : null,
      <InlineText node={node} rc={rc} tag="span" singleLine plain />,
    ),
};
