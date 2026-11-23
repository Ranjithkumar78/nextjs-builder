"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps a local draft of a text value while its input is focused, so typing is never
 * interrupted by store updates. Spread `focusProps` onto the input.
 */
export function useDraft(value: string, onBlurCommit: (draft: string, setDraft: (v: string) => void) => void) {
  const [draft, setDraft] = useState(value);
  const focusedRef = useRef(false);
  useEffect(() => {
    if (!focusedRef.current) setDraft(value);
  }, [value]);
  const focusProps = {
    onFocus: () => {
      focusedRef.current = true;
    },
    onBlur: () => {
      focusedRef.current = false;
      onBlurCommit(draft, setDraft);
    },
  };
  return { draft, setDraft, focusProps };
}
