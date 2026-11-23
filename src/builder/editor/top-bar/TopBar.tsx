"use client";

import { useBuilder } from "../../store";
import { Icon } from "../../ui/Icon";
import { ColorDots } from "../../ui/common";
import { ActiveSelects } from "./ActiveSelects";
import { DeviceSwitch } from "./DeviceSwitch";
import { SyncBadge } from "./SyncBadge";
import { ExportMenu } from "./ExportMenu";

export function TopBar() {
  const { state, dispatch, theme, page } = useBuilder();
  return (
    <header className="b-top">
      <div className="b-top-left">
        <div className="b-logo">
          <span className="b-logo-mark">
            <Icon name="palette" size={16} />
          </span>
          Theme Builder
        </div>
        <div className="b-top-sep" />
        <ActiveSelects />
      </div>

      <div className="b-top-center">
        <DeviceSwitch />
      </div>

      <div className="b-top-right">
        <button className="b-top-palette" title="Edit theme colors & fonts" onClick={() => dispatch({ type: "UI", patch: { leftTab: "themes", selectedId: null } })}>
          <ColorDots colors={theme.tokens.colors} keys={["primary", "secondary", "accent", "background", "text"]} />
          Theme colors
        </button>
        <SyncBadge />
        <button className="b-icon-btn" title="Undo (Ctrl+Z)" disabled={!state.past.length} onClick={() => dispatch({ type: "UNDO" })}>
          <Icon name="undo" size={16} />
        </button>
        <button className="b-icon-btn" title="Redo (Ctrl+Shift+Z)" disabled={!state.future.length} onClick={() => dispatch({ type: "REDO" })}>
          <Icon name="redo" size={16} />
        </button>
        <ExportMenu />
        <a className="b-btn primary" href={`/preview?theme=${theme.id}&page=${page.id}`} target="_blank" rel="noreferrer" title="Opens a live preview in a new tab — it updates as you edit">
          <Icon name="play" size={13} /> Preview
        </a>
      </div>
    </header>
  );
}
