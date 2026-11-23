"use client";

import { useCallback } from "react";
import type { Zone } from "../../types";
import { useBuilder } from "../../store";
import type { RenderCtx } from "../../render";

/** Render context for one canvas zone: edit mode, inline text editing and the theme's event. */
export function useEditRenderCtx(editingId: string | null, stopEditing: () => void): (zone: Zone) => RenderCtx {
  const { dispatch, theme } = useBuilder();
  return useCallback(
    (zone: Zone): RenderCtx => ({
      edit: true,
      zone,
      eventId: theme.eventId,
      editingId,
      onTextCommit: (id, key, text) => dispatch({ type: "UPDATE_PROPS", id, props: { [key]: text } }),
      onTextDone: stopEditing,
    }),
    [editingId, dispatch, theme.eventId, stopEditing],
  );
}
