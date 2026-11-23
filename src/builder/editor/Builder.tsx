"use client";

import { BuilderProvider, useBuilder } from "../store";
import { useShortcuts } from "./useShortcuts";
import { LoadingScreen } from "./LoadingScreen";
import { TopBar } from "./top-bar/TopBar";
import { LeftPanel } from "./left-panel/LeftPanel";
import { Canvas } from "./canvas/Canvas";
import { Inspector } from "./inspector/Inspector";

function Workspace() {
  useShortcuts();
  return (
    <div className="b-app">
      <TopBar />
      <div className="b-main">
        <LeftPanel />
        <main className="b-center">
          <Canvas />
        </main>
        <aside className="b-right">
          <Inspector />
        </aside>
      </div>
    </div>
  );
}

function Shell() {
  const { state } = useBuilder();
  return state.ready ? <Workspace /> : <LoadingScreen sync={state.sync} />;
}

/** The theme builder app: loads themes from the API, then shows the editor. */
export default function Builder() {
  return (
    <BuilderProvider>
      <Shell />
    </BuilderProvider>
  );
}
