"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StyleMap, StyleState, TBNode, ThemeColors } from "../../types";
import { inheritedStyle } from "../../css";
import { useBuilder } from "../../store";

/** Everything the Style tab and the quick Design controls need to read and change the selected node. */
export interface StyleEditor {
  node: TBNode;
  styleState: StyleState;
  colors: ThemeColors;
  /** Styles set on this state. */
  own: StyleMap;
  /** Styles inherited from larger screens (or desktop, for hover). */
  inherited: StyleMap;
  /** What is in effect: inherited + own. */
  merged: StyleMap;
  get: (k: string) => string;
  /** Inherited value, shown as a placeholder. */
  ph: (k: string) => string;
  set: (patch: StyleMap) => void;
  reset: (...keys: string[]) => () => void;
  isSet: (...keys: string[]) => boolean;
  setProp: (key: string, value: unknown) => void;
}

const Ctx = createContext<StyleEditor | null>(null);

export function useStyleEditor(): StyleEditor {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStyleEditor must be used inside StyleEditorProvider");
  return ctx;
}

/** Edits a node's styles for the device (or hover state) chosen in the inspector. */
export function StyleEditorProvider({ node, styleState, children }: { node: TBNode; styleState: StyleState; children: ReactNode }) {
  const { dispatch, theme } = useBuilder();
  const own: StyleMap = node.styles[styleState] ?? {};
  const inherited = inheritedStyle(node.styles, styleState);
  const set = (patch: StyleMap) => dispatch({ type: "UPDATE_STYLE", id: node.id, state: styleState, patch, key: `style:${node.id}:${styleState}:${Object.keys(patch).join(",")}` });
  const value: StyleEditor = {
    node,
    styleState,
    colors: theme.tokens.colors,
    own,
    inherited,
    merged: { ...inherited, ...own },
    get: (k) => own[k] ?? "",
    ph: (k) => inherited[k] ?? "",
    set,
    reset: (...keys) => () => set(Object.fromEntries(keys.map((k) => [k, ""]))),
    isSet: (...keys) => keys.some((k) => !!own[k]),
    setProp: (k, v) => dispatch({ type: "UPDATE_PROPS", id: node.id, props: { [k]: v }, key: `props:${node.id}:${k}` }),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
