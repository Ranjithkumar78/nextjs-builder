"use client";

import { useDraft } from "../hooks/useDraft";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  mono?: boolean;
}

/** Text field that reports every keystroke but never loses what you type to a store update. */
export function TextInput({ value, onChange, placeholder, multiline, rows = 3, mono }: Props) {
  const { draft, setDraft, focusProps } = useDraft(value, (d) => {
    if (d !== value) onChange(d);
  });
  const common = {
    className: `b-input ${mono ? "mono" : ""}`,
    value: draft,
    placeholder,
    ...focusProps,
    onChange: (e: { target: { value: string } }) => {
      setDraft(e.target.value);
      onChange(e.target.value);
    },
  };
  return multiline ? <textarea {...common} rows={rows} /> : <input {...common} />;
}
