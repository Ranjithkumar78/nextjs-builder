import { createElement } from "react";
import { str } from "../../lib/values";
import type { Renderer } from "../types";

/** In the editor, fields don't take focus or change. */
const lock = (edit: boolean) => (edit ? { tabIndex: -1, readOnly: true } : {});

const checkbox: Renderer = ({ p, attrs, rc }) =>
  createElement(
    "label",
    { ...attrs, className: `${attrs.className} tb-check` },
    <input type="checkbox" name={str(p.name)} defaultChecked={!!p.checked} required={!!p.required && !rc.edit} {...lock(rc.edit)} />,
    <span>{str(p.label)}</span>,
  );

const radio: Renderer = ({ node, p, attrs, rc }) => {
  const items = Array.isArray(p.items) ? (p.items as string[]) : [];
  const name = str(p.name) || `radio-${node.id}`;
  return createElement(
    "fieldset",
    { ...attrs, className: `${attrs.className} tb-field` },
    p.label ? <legend className="tb-field-label">{str(p.label)}</legend> : null,
    items.map((it, i) => (
      <label key={i} className="tb-check">
        <input type="radio" name={name} value={str(it)} required={!!p.required && !rc.edit} {...lock(rc.edit)} />
        <span>{str(it)}</span>
      </label>
    )),
  );
};

const file: Renderer = ({ p, attrs, rc }) =>
  createElement(
    "div",
    { ...attrs, className: `${attrs.className} tb-field` },
    p.label ? <label className="tb-field-label">{str(p.label)}</label> : null,
    <input className="tb-field-input tb-file" type="file" name={str(p.name)} accept={str(p.accept) || undefined} multiple={!!p.multiple} required={!!p.required && !rc.edit} tabIndex={rc.edit ? -1 : undefined} />,
  );

export const FORM_EXTRA_RENDERERS: Record<string, Renderer> = { checkbox, radio, file };
