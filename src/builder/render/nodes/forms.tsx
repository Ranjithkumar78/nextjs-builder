import { createElement, type ReactNode } from "react";
import { str } from "../../lib/values";
import type { RenderArgs, Renderer } from "../types";

/** A form field wrapper: optional label above the control. */
function field({ p, attrs }: RenderArgs, control: ReactNode) {
  return createElement("div", { ...attrs, className: `${attrs.className} tb-field` }, p.label ? <label className="tb-field-label">{str(p.label)}</label> : null, control);
}

/** In the editor, fields are read-only and skipped by Tab so they don't steal focus. */
const editLock = (edit: boolean) => ({ readOnly: edit, tabIndex: edit ? -1 : undefined });

/** Form, inputs, text areas and dropdowns. */
export const FORM_RENDERERS: Record<string, Renderer> = {
  form: ({ p, attrs, rc, kids }) =>
    createElement(
      "form",
      { ...attrs, action: rc.edit ? undefined : str(p.action) || undefined, method: str(p.method, "post"), onSubmit: rc.edit ? (e: Event) => e.preventDefault() : undefined },
      kids(),
    ),
  input: (a) =>
    field(a, <input className="tb-field-input" type={str(a.p.inputType, "text")} name={str(a.p.name)} placeholder={str(a.p.placeholder)} required={!!a.p.required && !a.rc.edit} {...editLock(a.rc.edit)} />),
  textarea: (a) =>
    field(a, <textarea className="tb-field-input" name={str(a.p.name)} placeholder={str(a.p.placeholder)} rows={Number(a.p.rows) || 4} required={!!a.p.required && !a.rc.edit} {...editLock(a.rc.edit)} />),
  select: (a) => {
    const items = Array.isArray(a.p.items) ? (a.p.items as string[]) : [];
    return field(
      a,
      <select className="tb-field-input" name={str(a.p.name)} tabIndex={a.rc.edit ? -1 : undefined}>
        {items.map((it, i) => (
          <option key={i}>{str(it)}</option>
        ))}
      </select>,
    );
  },
};
