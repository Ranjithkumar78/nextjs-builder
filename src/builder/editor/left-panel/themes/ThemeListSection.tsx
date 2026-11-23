"use client";

import { useState } from "react";
import { useBuilder } from "../../../store";
import { Icon } from "../../../ui/Icon";
import { Field, Section, TextInput } from "../../../ui/controls";
import { ColorDots, IconButton, ListItem, ListText } from "../../../ui/common";
import { NewThemeForm } from "./NewThemeForm";

/** All themes: switch, duplicate, delete, rename the open one, or create a new one. */
export function ThemeListSection() {
  const { state, theme, dispatch } = useBuilder();
  const [creating, setCreating] = useState(false);
  const themes = state.project.themes;
  return (
    <Section title={`All themes (${themes.length})`}>
      <div className="b-list">
        {themes.map((th) => (
          <ListItem
            key={th.id}
            active={th.id === theme.id}
            onSelect={() => dispatch({ type: "SET_THEME", id: th.id })}
            lead={<ColorDots colors={th.tokens.colors} />}
            actions={
              <>
                <IconButton icon="copy" title="Duplicate" onClick={() => dispatch({ type: "DUPLICATE_THEME", id: th.id })} />
                <IconButton icon="trash" title="Delete" className="danger" disabled={themes.length <= 1} onClick={() => confirm(`Delete theme "${th.name}" and all its pages?`) && dispatch({ type: "DELETE_THEME", id: th.id })} />
              </>
            }
          >
            <ListText title={th.name} caption={`${th.pages.length} pages`} />
          </ListItem>
        ))}
      </div>
      <Field label="Rename this theme" full>
        <TextInput value={theme.name} onChange={(v) => dispatch({ type: "RENAME_THEME", id: theme.id, name: v })} />
      </Field>
      {creating ? (
        <NewThemeForm onDone={() => setCreating(false)} />
      ) : (
        <button className="b-btn small primary" style={{ marginTop: 10 }} onClick={() => setCreating(true)}>
          <Icon name="plus" size={13} /> New theme
        </button>
      )}
    </Section>
  );
}
