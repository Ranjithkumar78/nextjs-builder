export const COUNTDOWN_UNITS = ["Days", "Hours", "Minutes", "Seconds"];

/** Days, hours, minutes and seconds left until the target, as two-digit strings. */
export function countdownParts(target: string, now = Date.now()): string[] {
  const t = new Date(target).getTime();
  let diff = isNaN(t) ? 0 : Math.max(0, Math.floor((t - now) / 1000));
  const d = Math.floor(diff / 86400);
  diff -= d * 86400;
  const h = Math.floor(diff / 3600);
  diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const sec = diff - m * 60;
  return [d, h, m, sec].map((n) => String(n).padStart(2, "0"));
}

/** Inline script used by exported HTML to keep countdowns ticking. */
export const COUNTDOWN_SCRIPT = `(function(){function p(t){var x=new Date(t).getTime(),d=isNaN(x)?0:Math.max(0,Math.floor((x-Date.now())/1e3));var a=Math.floor(d/86400);d-=a*86400;var b=Math.floor(d/3600);d-=b*3600;var c=Math.floor(d/60);return[a,b,c,d-c*60].map(function(n){return(n<10?"0":"")+n})}function u(){document.querySelectorAll("[data-countdown]").forEach(function(el){var v=p(el.getAttribute("data-countdown"));el.querySelectorAll("[data-cd]").forEach(function(n){n.textContent=v[+n.getAttribute("data-cd")]})})}u();setInterval(u,1000)})();`;
