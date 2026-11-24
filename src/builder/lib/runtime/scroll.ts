/**
 * On scroll: entrance animations ([data-tb-anim]), counters ([data-tb-count]), progress bars ([data-tb-reveal])
 * and the back-to-top button. Self-contained: exports inline its source.
 */
export function runtimeScroll(): () => void {
  const doc = document;
  const fmt = (n: number, dec: number, sep: boolean) => (sep ? n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : n.toFixed(dec));
  const countUp = (el: HTMLElement, run: boolean) => {
    const out = el.querySelector(".tb-count-num");
    if (!out) return;
    const end = Number(el.dataset.tbCount) || 0;
    const from = Number(el.dataset.from) || 0;
    const dec = (String(end).split(".")[1] || "").length;
    const sep = el.dataset.sep !== "0";
    if (!run) return void (out.textContent = fmt(from, dec, sep));
    const dur = Number(el.dataset.duration) || 2000;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      out.textContent = fmt(from + (end - from) * (1 - Math.pow(1 - k, 3)), dec, sep);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        io.unobserve(el);
        setTimeout(() => {
          el.classList.add("tb-in");
          if (el.dataset.tbCount !== undefined) countUp(el, true);
        }, Number(el.dataset.tbDelay) || 0);
      }),
    { threshold: 0.15 },
  );
  // Re-scans after the page changes (live preview edits can replace elements or their classes).
  const scan = () =>
    doc.querySelectorAll<HTMLElement>("[data-tb-anim],[data-tb-count],[data-tb-reveal]").forEach((el) => {
      if (el.classList.contains("tb-in") || el.dataset.tbWatched === "1") return;
      el.dataset.tbWatched = "1";
      if (el.dataset.tbCount !== undefined) countUp(el, false);
      io.observe(el);
    });
  const mo = new MutationObserver(() => {
    doc.querySelectorAll<HTMLElement>("[data-tb-watched]:not(.tb-in)").forEach((el) => io.observe(el));
    scan();
  });
  const onScroll = () => doc.querySelectorAll("[data-tb-totop][data-tb-float]").forEach((b) => b.classList.toggle("tb-show", window.scrollY > 400));
  scan();
  mo.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  return () => {
    io.disconnect();
    mo.disconnect();
    window.removeEventListener("scroll", onScroll);
  };
}
