"use client";

import { Section, SelectInput, TextInput } from "../../../ui/controls";
import { UploadButton } from "../../../ui/common";
import { useStyleEditor } from "../StyleEditor";
import { StyleColor, StyleField, StyleSelect } from "./fields";
import { GRADIENTS, V } from "./options";

const UPLOADED = "(uploaded image)";

/** Upload an image, pick a gradient preset, or paste an image URL / CSS gradient. */
function BackgroundImage() {
  const { get, ph, set } = useStyleEditor();
  const image = get("backgroundImage");
  return (
    <StyleField k="backgroundImage" label="Image / gradient" full>
      {image ? <div className="b-bgprev" style={{ backgroundImage: image, backgroundSize: "cover", backgroundPosition: "center" }} /> : null}
      <div className="b-inline">
        <UploadButton onData={(d) => set({ backgroundImage: `url("${d}")`, backgroundSize: get("backgroundSize") || "cover", backgroundPosition: get("backgroundPosition") || "center" })} />
        <SelectInput value="" onChange={(v) => v && set({ backgroundImage: v })} options={GRADIENTS} placeholder="Gradient presets…" />
      </div>
      <TextInput
        value={image.startsWith('url("data:') ? UPLOADED : image}
        onChange={(v) => {
          if (v === UPLOADED) return;
          set({ backgroundImage: /^https?:\/\//.test(v.trim()) ? `url("${v.trim()}")` : v });
        }}
        placeholder={ph("backgroundImage") ? "Inherited" : "Paste image URL or CSS gradient"}
      />
    </StyleField>
  );
}

export function BackgroundSection() {
  return (
    <Section title="Background">
      <div className="b-grid2">
        <StyleColor k="backgroundColor" label="Color" />
        <BackgroundImage />
        <StyleSelect k="backgroundSize" label="Size" options={V.bgSize} />
        <StyleSelect k="backgroundPosition" label="Position" options={V.bgPosition} />
        <StyleSelect k="backgroundRepeat" label="Repeat" options={V.bgRepeat} />
        <StyleSelect k="backgroundAttachment" label="Attachment" options={V.bgAttachment} />
      </div>
    </Section>
  );
}
