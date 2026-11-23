"use client";

import { useState } from "react";
import { useBuilder } from "../../../store";
import { blankTheme, starterTheme } from "../../../defaults";
import { navbar, simpleFooter } from "../../../presets";
import { ulid } from "../../../ulid";
import { Field, TextInput } from "../../../ui/controls";
import { FormActions } from "../../../ui/common";
import { PaletteButtons } from "./PaletteButtons";

type Content = "starter" | "blank" | "copy" | "mahatma";

/** Create a theme: starter site, blank, the alumni template, or a copy of the current theme. */
export function NewThemeForm({ onDone }: { onDone: () => void }) {
  const { state, theme, dispatch } = useBuilder();
  const [name, setName] = useState("");
  const [content, setContent] = useState<Content>("starter");
  const [palette, setPalette] = useState("light");

  const create = async () => {
    const n = name.trim();
    if (content === "copy") dispatch({ type: "DUPLICATE_THEME", id: theme.id });
    else if (content === "mahatma") {
      // Large template: only downloaded when someone creates it.
      const { mahatmaTheme } = await import("../../../presets/mahatma");
      dispatch({ type: "ADD_THEME", theme: { ...mahatmaTheme(), name: n || "Mahatma Alumni Meetup 2026" } });
    } else {
      const fallback = `Theme ${state.project.themes.length + 1}`;
      const th = content === "starter" ? starterTheme(n || fallback, palette) : { ...blankTheme(n || fallback, palette), header: [navbar()], footer: [simpleFooter()] };
      dispatch({ type: "ADD_THEME", theme: { ...th, id: ulid() } });
    }
    onDone();
  };

  return (
    <div className="b-card" style={{ marginTop: 10 }}>
      <Field label="Theme name" full>
        <TextInput value={name} onChange={setName} placeholder="e.g. Summer Sale" />
      </Field>
      <Field label="Content" full>
        <select className="b-input" value={content} onChange={(e) => setContent(e.target.value as Content)}>
          <option value="starter">Starter site (3 pages)</option>
          <option value="blank">Blank (header, footer, empty home)</option>
          <option value="mahatma">Alumni homecoming (Mahatma)</option>
          <option value="copy">Copy of current theme</option>
        </select>
      </Field>
      {content !== "copy" && content !== "mahatma" ? (
        <Field label="Color & font style" full>
          <PaletteButtons selected={palette} onPick={(id) => setPalette(id)} />
        </Field>
      ) : null}
      <FormActions submitLabel="Create theme" onSubmit={() => void create()} onCancel={onDone} />
    </div>
  );
}
