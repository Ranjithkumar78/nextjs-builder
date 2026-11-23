import type { StyleMap, TBNode } from "../../types";
import { cloneNode, containsId, getZoneNodes, insertNode, locate, removeNode, updateNode, type Located } from "../../tree";
import { deepClone } from "../../lib/values";
import { commit } from "../history";
import { activePage, activeTheme, mapZone } from "../selectors";
import type { NodeAction, State } from "../types";

/** Locate a node in the active theme/page, or null. */
function find(state: State, id: string): Located | null {
  return locate(activeTheme(state.project), activePage(state.project), id);
}

/** Update one node in place and record the edit. */
function edit(state: State, id: string, fn: (n: TBNode) => TBNode, key?: string): State {
  const loc = find(state, id);
  if (!loc) return state;
  return commit(state, mapZone(state.project, loc.zone, (nodes) => updateNode(nodes, id, fn)), key);
}

function patchStyle(n: TBNode, state: keyof TBNode["styles"], patch: StyleMap): TBNode {
  const current: StyleMap = { ...(n.styles[state] ?? {}) };
  for (const [k, v] of Object.entries(patch)) {
    if (v === "" || v === undefined || v === null) delete current[k];
    else current[k] = v;
  }
  return { ...n, styles: { ...n.styles, [state]: current } };
}

/** Remove a node and insert it at a new position. */
function move(state: State, loc: Located, zone: Located["zone"], parentId: string | null, index: number, selectIt: boolean): State {
  let np = mapZone(state.project, loc.zone, (nodes) => removeNode(nodes, loc.node.id).nodes);
  np = mapZone(np, zone, (nodes) => insertNode(nodes, parentId, index, loc.node));
  return commit(state, np, undefined, selectIt ? { selectedId: loc.node.id } : undefined);
}

function insert(state: State, node: TBNode, zone: Located["zone"], parentId: string | null, index: number): State {
  const np = mapZone(state.project, zone, (nodes) => insertNode(nodes, parentId, index, node));
  return commit(state, np, undefined, { selectedId: node.id });
}

export function nodesReducer(state: State, a: NodeAction): State {
  switch (a.type) {
    case "ADD_NODE":
      return insert(state, a.node, a.target.zone, a.target.parentId, a.target.index);
    case "PASTE":
      return state.ui.clipboard ? insert(state, cloneNode(state.ui.clipboard), a.target.zone, a.target.parentId, a.target.index) : state;
    case "MOVE_NODE": {
      const loc = find(state, a.id);
      if (!loc || (a.target.parentId && containsId(loc.node, a.target.parentId))) return state;
      const sameParent = loc.zone === a.target.zone && (loc.parent?.id ?? null) === a.target.parentId;
      const index = sameParent && loc.index < a.target.index ? a.target.index - 1 : a.target.index;
      if (sameParent && loc.index === index) return state;
      return move(state, loc, a.target.zone, a.target.parentId, index, true);
    }
    case "MOVE_SIBLING": {
      const loc = find(state, a.id);
      if (!loc) return state;
      const siblings = loc.parent ? (loc.parent.children ?? []) : getZoneNodes(activeTheme(state.project), activePage(state.project), loc.zone);
      const to = loc.index + a.dir;
      if (to < 0 || to >= siblings.length) return state;
      return move(state, loc, loc.zone, loc.parent?.id ?? null, to, false);
    }
    case "DELETE_NODE": {
      const loc = find(state, a.id);
      if (!loc) return state;
      const np = mapZone(state.project, loc.zone, (nodes) => removeNode(nodes, a.id).nodes);
      return commit(state, np, undefined, { selectedId: loc.parent?.id ?? null });
    }
    case "DUPLICATE_NODE": {
      const loc = find(state, a.id);
      return loc ? insert(state, cloneNode(loc.node), loc.zone, loc.parent?.id ?? null, loc.index + 1) : state;
    }
    case "COPY": {
      const loc = find(state, a.id);
      return loc ? { ...state, ui: { ...state.ui, clipboard: deepClone(loc.node) } } : state;
    }
    case "UPDATE_PROPS":
      return edit(state, a.id, (n) => ({ ...n, props: { ...n.props, ...(a.props as TBNode["props"]) } }), a.key);
    case "UPDATE_STYLE":
      return edit(state, a.id, (n) => patchStyle(n, a.state, a.patch), a.key);
    case "CLEAR_STYLE":
      return edit(state, a.id, (n) => ({ ...n, styles: { ...n.styles, [a.state]: {} } }));
    case "RENAME_NODE":
      return edit(state, a.id, (n) => ({ ...n, name: a.name || undefined }), "rename:" + a.id);
    case "TOGGLE_HIDDEN":
      return edit(state, a.id, (n) => ({ ...n, hidden: !n.hidden }));
  }
}
