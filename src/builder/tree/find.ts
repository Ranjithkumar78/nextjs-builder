import type { Page, TBNode, Theme, Zone } from "../types";

export interface Found {
  node: TBNode;
  parent: TBNode | null;
  index: number;
}

export type Located = Found & { zone: Zone };

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

export function containsId(node: TBNode, id: string): boolean {
  if (node.id === id) return true;
  return (node.children ?? []).some((c) => containsId(c, id));
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

export function locate(theme: Theme, page: Page | undefined, id: string): Located | null {
  const zones: Zone[] = ["header", "page", "footer"];
  for (const zone of zones) {
    const f = findNode(getZoneNodes(theme, page, zone), id);
    if (f) return { ...f, zone };
  }
  return null;
}
