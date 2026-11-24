/** Slider arrows, dots and autoplay (the track itself scrolls natively). Self-contained: exports inline its source. */
export function runtimeSlider(): () => void {
  const doc = document;
  const timers = new Map<Element, number>();
  const trackOf = (s: Element) => s.querySelector<HTMLElement>(":scope > .tb-slider-track");
  const slideWidth = (t: HTMLElement) => ((t.firstElementChild as HTMLElement | null)?.offsetWidth || t.clientWidth) + (parseFloat(getComputedStyle(t).columnGap) || 0);
  const step = (s: Element, dir: number) => {
    const t = trackOf(s);
    if (!t) return;
    const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
    if (dir > 0 && atEnd) t.scrollTo({ left: 0 });
    else if (dir < 0 && t.scrollLeft <= 2) t.scrollTo({ left: t.scrollWidth });
    else t.scrollBy({ left: dir * slideWidth(t) });
  };
  const syncDots = (s: Element) => {
    const box = s.querySelector(":scope > .tb-slider-dots");
    const t = trackOf(s);
    if (!box || !t) return;
    const n = t.children.length;
    if (box.children.length !== n) {
      box.textContent = "";
      for (let i = 0; i < n; i++) {
        const b = doc.createElement("button");
        b.type = "button";
        b.dataset.tbDot = String(i);
        b.setAttribute("aria-label", `Slide ${i + 1}`);
        box.appendChild(b);
      }
    }
    const active = Math.round(t.scrollLeft / slideWidth(t));
    Array.from(box.children).forEach((b, i) => (i === active ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
  };
  const setup = () => {
    timers.forEach((id, s) => {
      if (doc.contains(s)) return;
      clearInterval(id);
      timers.delete(s);
    });
    doc.querySelectorAll("[data-tb-slider]").forEach((s) => {
      syncDots(s);
      const sec = Number(s.getAttribute("data-autoplay")) || 0;
      if (sec > 0 && !timers.has(s)) timers.set(s, window.setInterval(() => !s.matches(":hover") && step(s, 1), sec * 1000));
    });
  };
  const onClick = (e: MouseEvent) => {
    const t = e.target as Element | null;
    const s = t?.closest?.("[data-tb-slider]");
    if (!t || !s) return;
    const arrow = t.closest("[data-tb-slide]");
    if (arrow) step(s, Number(arrow.getAttribute("data-tb-slide")));
    const dot = t.closest("[data-tb-dot]");
    const track = trackOf(s);
    const slide = dot && track ? (track.children[Number(dot.getAttribute("data-tb-dot"))] as HTMLElement | undefined) : undefined;
    if (track && slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft });
  };
  const onScroll = (e: Event) => {
    const t = e.target;
    if (t instanceof Element && t.classList.contains("tb-slider-track") && t.parentElement) syncDots(t.parentElement);
  };
  const mo = new MutationObserver(setup);
  setup();
  mo.observe(doc.body, { childList: true, subtree: true });
  doc.addEventListener("click", onClick);
  doc.addEventListener("scroll", onScroll, true);
  return () => {
    mo.disconnect();
    timers.forEach((id) => clearInterval(id));
    doc.removeEventListener("click", onClick);
    doc.removeEventListener("scroll", onScroll, true);
  };
}
