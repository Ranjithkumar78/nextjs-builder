/** YouTube and Vimeo links become embeddable iframes; anything else plays in a <video>. */
export function videoEmbed(url: string): { kind: "iframe" | "video"; src: string } {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  return { kind: "video", src: u };
}

export function mapEmbed(query: string, zoom: number): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom || 13}&output=embed`;
}
