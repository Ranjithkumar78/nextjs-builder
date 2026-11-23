"use client";

import type { ReactNode } from "react";
import { useBuilder, type LeftTab } from "../../store";
import { Icon } from "../../ui/Icon";
import { AddTab } from "./add/AddTab";
import { LayersTab } from "./layers/LayersTab";
import { PagesTab } from "./pages/PagesTab";
import { ThemesTab } from "./themes/ThemesTab";

const TABS: { id: LeftTab; icon: string; label: string }[] = [
  { id: "components", icon: "components", label: "Add" },
  { id: "layers", icon: "layers", label: "Layers" },
  { id: "pages", icon: "pages", label: "Pages" },
  { id: "themes", icon: "palette", label: "Themes" },
];

const PANELS: Record<LeftTab, () => ReactNode> = { components: AddTab, layers: LayersTab, pages: PagesTab, themes: ThemesTab };

/** Icon rail on the far left and the panel of the chosen tab. */
export function LeftPanel() {
  const { state, dispatch } = useBuilder();
  const tab = state.ui.leftTab;
  const Body = PANELS[tab];
  return (
    <aside className="b-left">
      <nav className="b-rail">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => dispatch({ type: "UI", patch: { leftTab: t.id } })} title={t.label}>
            <Icon name={t.icon} size={19} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
      <div className="b-left-body">
        <Body />
      </div>
    </aside>
  );
}
