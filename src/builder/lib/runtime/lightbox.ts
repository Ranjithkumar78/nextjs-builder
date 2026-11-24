/** Full-screen image viewer for galleries with [data-tb-lightbox]. Self-contained: exports inline its source. */
export function runtimeLightbox(): () => void {
  const doc = document;
  let box: HTMLDivElement | null = null;
  let list: string[] = [];
  let index = 0;
  const show = () => {
    const img = box?.querySelector("img");
    if (img) img.src = list[index];
  };
  const go = (d: number) => {
    index = (index + d + list.length) % list.length;
    show();
  };
  const close = () => {
    box?.remove();
    box = null;
    doc.documentElement.style.overflow = "";
  };
  const open = (images: string[], start: number) => {
    list = images;
    index = Math.max(0, start);
    box = doc.createElement("div");
    box.className = "tb-lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<img alt=""><button type="button" data-lb="close" aria-label="Close">×</button>' +
      '<button type="button" data-lb="-1" aria-label="Previous">‹</button><button type="button" data-lb="1" aria-label="Next">›</button>';
    doc.body.appendChild(box);
    doc.documentElement.style.overflow = "hidden";
    show();
  };
  const onClick = (e: MouseEvent) => {
    const t = e.target as Element | null;
    if (!t || !t.closest) return;
    if (box && box.contains(t)) {
      const action = t.closest("[data-lb]")?.getAttribute("data-lb");
      if (action === "close" || t === box) close();
      else if (action) go(Number(action));
      return;
    }
    const img = t.closest<HTMLImageElement>("[data-tb-lightbox] .tb-gal-img");
    const gallery = img?.closest("[data-tb-lightbox]");
    if (!img || !gallery) return;
    const all = Array.from(gallery.querySelectorAll<HTMLImageElement>(".tb-gal-img"));
    open(all.map((x) => x.currentSrc || x.src), all.indexOf(img));
  };
  const onKey = (e: KeyboardEvent) => {
    if (!box) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  };
  doc.addEventListener("click", onClick);
  doc.addEventListener("keydown", onKey);
  return () => {
    close();
    doc.removeEventListener("click", onClick);
    doc.removeEventListener("keydown", onKey);
  };
}
