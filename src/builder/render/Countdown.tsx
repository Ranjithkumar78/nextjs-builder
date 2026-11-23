"use client";

import { useEffect, useState } from "react";
import { COUNTDOWN_UNITS, countdownParts } from "../lib/countdown";

/** Live countdown boxes (exports keep ticking through COUNTDOWN_SCRIPT and the data-cd markers). */
export function Countdown({ target, labels }: { target: string; labels: boolean }) {
  const [parts, setParts] = useState<string[]>(["00", "00", "00", "00"]);
  useEffect(() => {
    const tick = () => setParts(countdownParts(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <>
      {parts.map((v, i) => (
        <div className="tb-cd-box" key={i}>
          <span className="tb-cd-num" data-cd={i}>
            {v}
          </span>
          {labels ? <span className="tb-cd-label">{COUNTDOWN_UNITS[i]}</span> : null}
        </div>
      ))}
    </>
  );
}
