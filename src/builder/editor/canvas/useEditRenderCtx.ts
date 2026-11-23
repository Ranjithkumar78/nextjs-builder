"use client";

import { useMemo } from "react";
import type { Zone } from "../../types";
import { useBuilder } from "../../store";
import type { RenderCtx } from "../../render";

/**
 * Render context per canvas zone: edit mode, inline text editing and the theme's event.
 * The objects stay the same until one of their inputs changes, so memoized nodes skip re-rendering.
 */
export function useEditRenderCtx(editingId: string | null, stopEditing: () => void): Record<Zone, RenderCtx> {
  const { dispatch, theme } = useBuilder();
  const eventId = theme.eventId;
  return useMemo(() => {
    const base = {
      edit: true,
      eventId,
      editingId,
      onTextCommit: (id: string, key: string, text: string) => dispatch({ type: "UPDATE_PROPS", id, props: { [key]: text } }),
      onTextDone: stopEditing,
    };
    return { header: { ...base, zone: "header" }, page: { ...base, zone: "page" }, footer: { ...base, zone: "footer" } };
  }, [editingId, dispatch, eventId, stopEditing]);
}
