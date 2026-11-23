"use client";

import { useBuilder } from "../../../store";
import { Icon } from "../../../ui/Icon";
import { Panel } from "../../../ui/common";
import { ThemeColorsSection } from "./ThemeColorsSection";
import { TypographySection } from "./TypographySection";
import { ThemeListSection } from "./ThemeListSection";
import { CustomCssSection, EventDataSection } from "./ThemeExtrasSections";

/** Theme settings: colors, fonts, shape, presets, the theme list, event data and custom CSS. */
export function ThemesTab() {
  const { theme } = useBuilder();
  const head = (
    <div className="b-panel-title">
      <Icon name="palette" size={15} /> {theme.name}
    </div>
  );
  return (
    <Panel head={head}>
      <ThemeColorsSection />
      <TypographySection />
      <ThemeListSection />
      <EventDataSection />
      <CustomCssSection />
    </Panel>
  );
}
