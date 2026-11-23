"use client";

import { useState } from "react";
import { useBuilder } from "../../../store";
import { newPage } from "../../../tree";
import { slugify } from "../../../lib/values";
import { PAGE_TEMPLATES } from "../../../presets";
import { Field, TextInput } from "../../../ui/controls";
import { Options } from "../../../ui/controls/SelectInput";
import { FormActions } from "../../../ui/common";

/** Name and starting template for a new page; the slug is made unique within the theme. */
export function NewPageForm({ onDone }: { onDone: () => void }) {
  const { theme, dispatch } = useBuilder();
  const [name, setName] = useState("");
  const [tpl, setTpl] = useState("blank");

  const create = () => {
    const n = name.trim() || `Page ${theme.pages.length + 1}`;
    let slug = slugify(n);
    while (theme.pages.some((p) => p.slug === slug)) slug += "-2";
    const t = PAGE_TEMPLATES.find((x) => x.id === tpl) ?? PAGE_TEMPLATES[0];
    dispatch({ type: "ADD_PAGE", page: newPage(n, slug, t.build(n)) });
    onDone();
  };

  return (
    <div className="b-card">
      <Field label="Page name" full>
        <TextInput value={name} onChange={setName} placeholder="e.g. Services" />
      </Field>
      <Field label="Start from" full>
        <select className="b-input" value={tpl} onChange={(e) => setTpl(e.target.value)}>
          <Options options={PAGE_TEMPLATES.map((t) => ({ value: t.id, label: t.label }))} />
        </select>
      </Field>
      <FormActions submitLabel="Create page" onSubmit={create} onCancel={onDone} />
    </div>
  );
}
