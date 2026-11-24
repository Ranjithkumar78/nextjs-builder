/** Share networks offered by the Share buttons element. */
export const SHARE_LABELS = { facebook: "Facebook", x: "X", linkedin: "LinkedIn", whatsapp: "WhatsApp", email: "Email", copy: "Copy link" } as const;

export type ShareNetwork = keyof typeof SHARE_LABELS;

/** Share URL templates; the runtime script fills in {url} and {title} with the page being viewed. */
export const SHARE_URLS: Record<Exclude<ShareNetwork, "copy">, string> = {
  facebook: "https://www.facebook.com/sharer/sharer.php?u={url}",
  x: "https://twitter.com/intent/tweet?url={url}&text={title}",
  linkedin: "https://www.linkedin.com/sharing/share-offsite/?url={url}",
  whatsapp: "https://wa.me/?text={title}%20{url}",
  email: "mailto:?subject={title}&body={url}",
};

/** Click-to-chat link for a WhatsApp number (digits only) with a pre-filled message. */
export function whatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
