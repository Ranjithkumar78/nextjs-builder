"use client";

import type { StyleMap } from "../../../types";
import { useBuilder } from "../../../store";
import { Icon } from "../../../ui/Icon";
import { useStyleEditor } from "../StyleEditor";
import { TypographySection } from "./TypographySection";
import { SizeSection, SpacingSection } from "./SpacingSizeSections";
import { LayoutSection } from "./LayoutSection";
import { BackgroundSection } from "./BackgroundSection";
import { BorderSection, EffectsSection, PositionSection } from "./EffectsSections";

/** Copied styles stay available while switching between elements. */
let styleClipboard: StyleMap | null = null;

function StyleActions() {
  const { dispatch } = useBuilder();
  const { node, own, set, styleState } = useStyleEditor();
  return (
    <div className="b-insp-actions">
      <button
        className="b-btn small"
        onClick={() => {
          styleClipboard = { ...own };
        }}
      >
        <Icon name="copy" size={13} /> Copy styles
      </button>
      <button className="b-btn small" onClick={() => styleClipboard && set(styleClipboard)}>
        Paste styles
      </button>
      <button className="b-btn small ghost" onClick={() => dispatch({ type: "CLEAR_STYLE", id: node.id, state: styleState })}>
        Reset {styleState}
      </button>
    </div>
  );
}

/** Every CSS property of the selected element, for the current device or hover state. */
export function StyleTab() {
  return (
    <>
      <TypographySection />
      <SpacingSection />
      <SizeSection />
      <LayoutSection />
      <BackgroundSection />
      <BorderSection />
      <EffectsSection />
      <PositionSection />
      <StyleActions />
    </>
  );
}
