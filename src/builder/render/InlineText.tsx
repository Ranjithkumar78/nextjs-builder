import { createElement, type ReactNode } from "react";
import type { TBNode } from "../types";
import { richHtml } from "../lib/html";
import { str } from "../lib/values";
import { EditableText } from "./EditableText";
import type { Attrs, RenderCtx } from "./types";

interface Props {
  node: TBNode;
  rc: RenderCtx;
  tag: string;
  attrs?: Attrs;
  /** Which prop holds the text. */
  textKey?: string;
  singleLine: boolean;
  /** Show the text as-is instead of with **bold** / *accent* formatting (outside the editor). */
  plain?: boolean;
}

/** A node's text: editable in place on the canvas, static (formatted) HTML everywhere else. */
export function InlineText({ node, rc, tag, attrs = {}, textKey = "text", singleLine, plain }: Props): ReactNode {
  const value = str(node.props[textKey]);
  if (!rc.edit) return plain ? createElement(tag, attrs, value) : createElement(tag, { ...attrs, dangerouslySetInnerHTML: { __html: richHtml(value) } });
  return (
    <EditableText
      tag={tag}
      attrs={attrs}
      text={value}
      editing={rc.editingId === node.id}
      singleLine={singleLine}
      onCommit={(t) => rc.onTextCommit?.(node.id, textKey, t)}
      onDone={() => rc.onTextDone?.()}
    />
  );
}
