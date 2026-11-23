import type { TBNode } from "../../types";
import { GOLD, mix, eyebrow, section, container } from "./helpers";
import { aboutIntro } from "./about-intro";
import { signingUp } from "./signing-up";
import { givingBack } from "./giving-back";
import { registration } from "./registration";

export function about(): TBNode {
  return section(
    "About",
    [
      container([
        eyebrow("About the homecoming"),
        aboutIntro(),
        ...signingUp(),
        givingBack(),
        registration(),
      ]),
    ],
    { backgroundColor: "var(--tb-background)", backgroundImage: `linear-gradient(180deg, var(--tb-background) 0%, ${mix("var(--tb-background)", 92, GOLD)} 100%)` },
    "about"
  );
}
