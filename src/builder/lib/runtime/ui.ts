/**
 * Clicks: mobile menu, dismiss buttons, back to top, share/copy, popups (links to #id open a <dialog>),
 * and "only one open" accordions. Self-contained (no imports or outside variables): exports inline its source.
 */
export function runtimeUi(): () => void {
  const doc = document;
  doc.documentElement.classList.add("tb-js");
  const closeMenus = (except?: Element | null) =>
    doc.querySelectorAll(".tb-menu[data-open]").forEach((m) => {
      if (m === except) return;
      m.removeAttribute("data-open");
      m.querySelector("[data-tb-menu-toggle]")?.setAttribute("aria-expanded", "false");
    });
  const onClick = (e: MouseEvent) => {
    const t = e.target as Element | null;
    if (!t || !t.closest) return;
    const toggle = t.closest("[data-tb-menu-toggle]");
    if (toggle && toggle.parentElement) {
      const open = !toggle.parentElement.hasAttribute("data-open");
      closeMenus(toggle.parentElement);
      toggle.parentElement.toggleAttribute("data-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      return;
    }
    if (!t.closest(".tb-menu") || t.closest("a")) closeMenus();
    const dismiss = t.closest("[data-tb-dismiss]");
    if (dismiss) return void dismiss.closest("[data-tb-dismissable]")?.setAttribute("data-tb-dismissed", "");
    if (t.closest("[data-tb-totop]")) {
      e.preventDefault();
      return window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const share = t.closest("a[data-tb-share]") as HTMLAnchorElement | null;
    if (share) {
      const tpl = share.getAttribute("data-tb-share") ?? "";
      share.href = tpl.replace(/\{url\}/g, encodeURIComponent(location.href)).replace(/\{title\}/g, encodeURIComponent(doc.title));
      return;
    }
    const copy = t.closest("[data-tb-copy]");
    if (copy && navigator.clipboard) {
      const label = copy.textContent;
      void navigator.clipboard.writeText(location.href).then(() => {
        copy.textContent = "Copied!";
        setTimeout(() => (copy.textContent = label), 1500);
      });
      return;
    }
    const close = t.closest("[data-tb-close]");
    if (close) return void (close.closest("dialog") as HTMLDialogElement | null)?.close();
    if (t instanceof HTMLDialogElement && t.open) {
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      const r = t.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) t.close();
      return;
    }
    const link = t.closest('a[href^="#"]');
    const id = link ? decodeURIComponent((link.getAttribute("href") ?? "").slice(1)) : "";
    const target = id ? doc.getElementById(id) : null;
    if (target instanceof HTMLDialogElement) {
      e.preventDefault();
      target.showModal();
    }
  };
  const onToggle = (e: Event) => {
    const d = e.target;
    if (!(d instanceof HTMLDetailsElement) || !d.open || !d.parentElement?.matches('[data-tb-accordion="single"]')) return;
    d.parentElement.querySelectorAll(":scope > details[open]").forEach((o) => o !== d && o.removeAttribute("open"));
  };
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenus();
  doc.addEventListener("click", onClick);
  doc.addEventListener("toggle", onToggle, true);
  doc.addEventListener("keydown", onKey);
  return () => {
    doc.removeEventListener("click", onClick);
    doc.removeEventListener("toggle", onToggle, true);
    doc.removeEventListener("keydown", onKey);
  };
}
