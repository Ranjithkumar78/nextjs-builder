"use client";

import { createContext, useContext, type Dispatch } from "react";
import type { Page, Theme } from "../types";
import type { Action, State } from "./types";

export interface BuilderCtx {
  state: State;
  dispatch: Dispatch<Action>;
  theme: Theme;
  page: Page;
  /** Try sending unsaved changes to the API again. */
  retrySync: () => void;
}

export const BuilderContext = createContext<BuilderCtx | null>(null);

export function useBuilder(): BuilderCtx {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used inside BuilderProvider");
  return ctx;
}
