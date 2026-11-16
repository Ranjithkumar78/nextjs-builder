import type { Page, TBNode, Theme, Zone } from "./types";

export function uid(prefix = "n"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

export interface Found {
  node: TBNode;
  parent: TBNode | null;
  index: number;
}

export function findNode(nodes: TBNode[], id: string, parent: TBNode | null = null): Found | null {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) return { node, parent, index: i };
    if (node.children) {
      const f = findNode(node.children, id, node);
      if (f) return f;
    }
  }
  return null;
}

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

export function insertNode(nodes: TBNode[], parentId: string | null, index: number, node: TBNode): TBNode[] {
  if (parentId === null) {
    const i = Math.max(0, Math.min(index, nodes.length));
    return [...nodes.slice(0, i), node, ...nodes.slice(i)];
  }
  return updateNode(nodes, parentId, (p) => {
    const children = p.children ?? [];
    const i = Math.max(0, Math.min(index, children.length));
    return { ...p, children: [...children.slice(0, i), node, ...children.slice(i)] };
  });
}

export function containsId(node: TBNode, id: string): boolean {
  if (node.id === id) return true;
  return (node.children ?? []).some((c) => containsId(c, id));
}

export function cloneNode(node: TBNode): TBNode {
  return {
    ...node,
    id: uid(),
    props: JSON.parse(JSON.stringify(node.props)),
    styles: JSON.parse(JSON.stringify(node.styles)),
    children: node.children?.map(cloneNode),
  };
}

export function walkNodes(nodes: TBNode[], fn: (n: TBNode) => void): void {
  for (const n of nodes) {
    fn(n);
    if (n.children) walkNodes(n.children, fn);
  }
}

export function getZoneNodes(theme: Theme, page: Page | undefined, zone: Zone): TBNode[] {
  if (zone === "header") return theme.header;
  if (zone === "footer") return theme.footer;
  return page?.nodes ?? [];
}

export function setZoneNodes(theme: Theme, pageId: string, zone: Zone, nodes: TBNode[]): Theme {
  if (zone === "header") return { ...theme, header: nodes };
  if (zone === "footer") return { ...theme, footer: nodes };
  return { ...theme, pages: theme.pages.map((p) => (p.id === pageId ? { ...p, nodes } : p)) };
}

export function locate(theme: Theme, page: Page | undefined, id: string): (Found & { zone: Zone }) | null {
  const zones: Zone[] = ["header", "page", "footer"];
  for (const zone of zones) {
    const f = findNode(getZoneNodes(theme, page, zone), id);
    if (f) return { ...f, zone };
  }
  return null;
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page"
  );
}
