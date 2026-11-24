"use client";

import { moveItem } from "../../../lib/values";
import { TextInput } from "../../../ui/controls";
import { IconButton, UploadButton } from "../../../ui/common";

/** Ordered list of images (gallery): thumbnails, reorder, remove, upload or paste a URL. */
export function ImagesField({ images, onChange }: { images: string[]; onChange: (v: string[]) => void }) {
  const move = (i: number, d: number) => {
    const moved = moveItem(images, i, i + d);
    if (moved !== images) onChange(moved);
  };
  return (
    <div className="b-listed">
      {images.map((src, i) => (
        <div className="b-imgrow" key={i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
          <TextInput value={src.startsWith("data:") ? "" : src} onChange={(x) => onChange(images.map((y, j) => (j === i ? x : y)))} placeholder="Image URL" />
          <IconButton icon="up" title="Up" size={12} className="b-icon-btn" onClick={() => move(i, -1)} />
          <IconButton icon="down" title="Down" size={12} className="b-icon-btn" onClick={() => move(i, 1)} />
          <IconButton icon="trash" title="Remove" size={12} className="b-icon-btn" onClick={() => onChange(images.filter((_, j) => j !== i))} />
        </div>
      ))}
      <UploadButton label="Add image" icon="plus" onData={(url) => onChange([...images, url])} />
    </div>
  );
}
