/** Small value helpers shared by the editor, the renderer and the presets. */

/** Any value as a string; null/undefined become the fallback. */
export function str(v: unknown, fallback = ""): string {
  return v === undefined || v === null ? fallback : String(v);
}

/** Any value as a number; empty or invalid values become the fallback. */
export function num(v: unknown, fallback: number): number {
  return v === "" || v === undefined || v === null || isNaN(Number(v)) ? fallback : Number(v);
}

/** Toggles default to on: only an explicit false (or "false") turns them off. */
export function on(v: unknown): boolean {
  return v !== false && v !== "false";
}

/** Option list where label and value are the same. */
export function sameOptions(values: string[]): { label: string; value: string }[] {
  return values.map((v) => ({ label: v, value: v }));
}

/** Option list from [value, label] pairs. */
export function pairOptions(pairs: [string, string][]): { label: string; value: string }[] {
  return pairs.map(([value, label]) => ({ value, label }));
}

/** Unique, non-empty strings as options, keeping their first order. */
export function uniqueOptions(values: string[]): { label: string; value: string }[] {
  return sameOptions([...new Set(values.filter(Boolean))]);
}

/** Group items by a key, keeping the order in which each group first appears. */
export function groupInOrder<T>(items: T[], keyOf: (item: T) => string): { name: string; items: T[] }[] {
  const groups: { name: string; items: T[] }[] = [];
  for (const item of items) {
    const name = keyOf(item);
    const group = groups.find((g) => g.name === name) ?? groups[groups.push({ name, items: [] }) - 1];
    group.items.push(item);
  }
  return groups;
}

/** Copy of a list with one item moved from one index to another (unchanged if out of range). */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

/** Deep copy of plain JSON data. */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/** "Summer Sale!" -> "summer-sale" (or the fallback when nothing is left). */
export function slugify(s: string, fallback = "page"): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

export function errorText(e: unknown, fallback = "unknown error"): string {
  return e instanceof Error ? e.message : fallback;
}

/** A counter's number: keeps its decimals; optional thousands separators (Indian grouping, like prices). */
export function formatCount(n: number, separator: boolean): string {
  const decimals = (String(n).split(".")[1] ?? "").length;
  return separator ? n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n.toFixed(decimals);
}
