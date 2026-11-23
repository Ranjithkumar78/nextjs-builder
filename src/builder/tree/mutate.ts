import type { TBNode } from "../types";
import { deepClone } from "../lib/values";

export function uid(prefix = "n"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

/** Replace one node (anywhere in the tree); unchanged branches keep their identity. */
export function updateNode(nodes: TBNode[], id: string, fn: (n: TBNode) => TBNode): TBNode[] {
  let changed = false;
  const out = nodes.map((n) => {
    if (n.id === id) {
      changed = true;
      return fn(n);
    }
    if (n.children) {
      const c = updateNode(n.children, id, fn);
      if (c !== n.children) {
        changed = true;
        return { ...n, children: c };
      }
    }
    return n;
  });
  return changed ? out : nodes;
}

export function removeNode(nodes: TBNode[], id: string): { nodes: TBNode[]; removed: TBNode | null } {
  let removed: TBNode | null = null;
  const walk = (list: TBNode[]): TBNode[] => {
    const idx = list.findIndex((n) => n.id === id);
    if (idx >= 0) {
      removed = list[idx];
      return [...list.slice(0, idx), ...list.slice(idx + 1)];
    }
    let changed = false;
    const out = list.map((n) => {
      if (!n.children || removed) return n;
      const c = walk(n.children);
      if (c !== n.children) {
        changed = true;
        return { ...n, children: c };
      }
      return n;
    });
    return changed ? out : list;
  };
  const result = walk(nodes);
  return { nodes: result, removed };
}

function insertAt<T>(list: T[], index: number, item: T): T[] {
  const i = Math.max(0, Math.min(index, list.length));
  return [...list.slice(0, i), item, ...list.slice(i)];
}

export function insertNode(nodes: TBNode[], parentId: string | null, index: number, node: TBNode): TBNode[] {
  if (parentId === null) return insertAt(nodes, index, node);
  return updateNode(nodes, parentId, (p) => ({ ...p, children: insertAt(p.children ?? [], index, node) }));
}

/** Deep copy with fresh ids. */
export function cloneNode(node: TBNode): TBNode {
  return {
    ...node,
    id: uid(),
    props: deepClone(node.props),
    styles: deepClone(node.styles),
    children: node.children?.map(cloneNode),
  };
}
