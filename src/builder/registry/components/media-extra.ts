import type { ComponentDef } from "../types";
import { pairOptions } from "../../lib/values";
import { placeholderImage } from "../fields";

/** Gallery, audio and shape divider. */
export const MEDIA_EXTRA_COMPONENTS: ComponentDef[] = [
  {
    type: "gallery",
    label: "Gallery",
    category: "Media",
    icon: "images",
    defaultProps: { images: [1, 2, 3, 4, 5, 6].map((i) => placeholderImage(`Photo ${i}`, 800, 600)), columns: 3, gap: 12, ratio: "4 / 3", lightbox: true },
    defaultStyles: { width: "100%" },
    fields: [
      { key: "images", label: "Images", type: "images" },
      { key: "columns", label: "Columns", type: "number", help: "Phones show at most 2." },
      { key: "gap", label: "Space between images (px)", type: "number" },
      { key: "ratio", label: "Image shape", type: "select", options: pairOptions([["4 / 3", "4:3"], ["1 / 1", "Square"], ["3 / 4", "Portrait"], ["16 / 9", "16:9"], ["auto", "Original"]]) },
      { key: "lightbox", label: "Open full screen on click", type: "toggle" },
    ],
  },
  {
    type: "audio",
    label: "Audio",
    category: "Media",
    icon: "audio",
    defaultProps: { url: "" },
    defaultStyles: { width: "100%" },
    fields: [{ key: "url", label: "Audio file URL (.mp3)", type: "url" }],
  },
  {
    type: "shape",
    label: "Shape divider",
    category: "Layout",
    icon: "shape",
    defaultProps: { shape: "wave", flip: false, mirror: false },
    defaultStyles: { width: "100%", height: "80px", color: "var(--tb-surface)", lineHeight: "0" },
    fields: [
      { key: "shape", label: "Shape", type: "select", options: pairOptions([["wave", "Wave"], ["curve", "Curve"], ["slant", "Slant"], ["triangle", "Triangle"], ["zigzag", "Zigzag"]]) },
      { key: "flip", label: "Upside down", type: "toggle" },
      { key: "mirror", label: "Mirror left/right", type: "toggle" },
    ],
  },
];
