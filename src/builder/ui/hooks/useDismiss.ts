"use client";

import { useEffect, type RefObject } from "react";

/**
 * Close a popover or menu when the user clicks outside it (and, optionally, scrolls outside it).
 * Does nothing while `open` is false.
 */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void, closeOnScroll = false): void {
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", outside);
    if (closeOnScroll) window.addEventListener("scroll", outside, true);
    return () => {
      window.removeEventListener("mousedown", outside);
      if (closeOnScroll) window.removeEventListener("scroll", outside, true);
    };
  }, [ref, open, onClose, closeOnScroll]);
}
