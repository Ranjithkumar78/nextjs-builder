"use client";

import { imageUrlFor } from "../../api";
import { pickFile } from "../../lib/download";
import { Icon } from "../Icon";

/** Let the user pick an image, upload it and pass on its URL. */
export function uploadImage(onUrl: (url: string) => void): void {
  pickFile("image/*", (file) => void imageUrlFor(file).then((url) => url && onUrl(url)));
}

export function UploadButton({ onData, label = "Upload", icon = "upload" }: { onData: (url: string) => void; label?: string; icon?: string }) {
  return (
    <button className="b-btn small" onClick={() => uploadImage(onData)}>
      <Icon name={icon} size={13} /> {label}
    </button>
  );
}
