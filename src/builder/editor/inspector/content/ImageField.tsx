"use client";

import { placeholderImage } from "../../../registry";
import { TextInput } from "../../../ui/controls";
import { UploadButton } from "../../../ui/common";

/** Image preview with upload, placeholder/remove and a URL field. */
export function ImageField({ value, onChange, isImageNode }: { value: string; onChange: (v: string) => void; isImageNode: boolean }) {
  return (
    <div className="b-imgfield">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value ? <img src={value} alt="" /> : <div className="b-imgfield-empty">No image</div>}
      <div className="b-inline">
        <UploadButton onData={onChange} />
        <button className="b-btn small ghost" onClick={() => onChange(isImageNode ? placeholderImage() : "")}>
          {isImageNode ? "Placeholder" : "Remove"}
        </button>
      </div>
      <TextInput value={value.startsWith("data:") ? "" : value} onChange={onChange} placeholder="…or paste an image URL" />
    </div>
  );
}
