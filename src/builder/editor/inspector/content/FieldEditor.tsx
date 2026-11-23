"use client";

import type { LinkItem, Page, PropValue, ThemeColors } from "../../../types";
import type { FieldDef } from "../../../registry";
import { ColorInput, TextInput, Toggle } from "../../../ui/controls";
import { Options } from "../../../ui/controls/SelectInput";
import { DataFilterSelect } from "./DataFilterSelect";
import { ImageField } from "./ImageField";
import { ItemsField, LinksField } from "./ListFields";
import { LinkPicker } from "./LinkPicker";

interface Props {
  field: FieldDef;
  value: PropValue;
  onChange: (v: unknown) => void;
  pages: Page[];
  colors: ThemeColors;
  /** The event used by the node (for "datafilter" fields). */
  eventId: string;
  isImageNode: boolean;
}

/** The input for one content field, chosen by the field's type. */
export function FieldEditor({ field: f, value: v, onChange: set, pages, colors, eventId, isImageNode }: Props) {
  const text = String(v ?? "");
  switch (f.type) {
    case "textarea":
      return <TextInput multiline rows={4} value={text} onChange={set} placeholder={f.placeholder} />;
    case "code":
      return <TextInput multiline mono rows={8} value={text} onChange={set} placeholder={f.placeholder} />;
    case "url":
      return <LinkPicker value={text} onChange={set} pages={pages} />;
    case "number":
      return <TextInput value={text} onChange={(x) => set(x === "" ? "" : Number(x) || 0)} />;
    case "select":
      return (
        <select className="b-input" value={text} onChange={(e) => set(e.target.value)}>
          <Options options={f.options ?? []} />
        </select>
      );
    case "toggle":
      return <Toggle value={!!v} onChange={set} />;
    case "color":
      return <ColorInput value={text} onChange={set} colors={colors} />;
    case "image":
      return <ImageField value={text} onChange={set} isImageNode={isImageNode} />;
    case "items":
      return <ItemsField items={Array.isArray(v) ? (v as string[]) : []} onChange={set} />;
    case "links":
      return <LinksField links={Array.isArray(v) ? (v as LinkItem[]) : []} onChange={set} pages={pages} />;
    case "datafilter":
      return <DataFilterSelect facet={f.facet ?? "ticketCategory"} eventId={eventId} value={text} onChange={set} />;
    default:
      return <TextInput value={text} onChange={set} placeholder={f.placeholder} />;
  }
}
