export function formatPrice(price: number | null, currency: string): string {
  if (price === null || price === 0) return "Free";
  const amount = Number.isInteger(price) ? price.toLocaleString("en-IN") : price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency}${amount}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
