import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { mix, body, container, row, col } from "./helpers";

export function footer(): TBNode {
  return c(
    "section",
    { tag: "footer" },
    { padding: "48px 24px 0", backgroundColor: mix("var(--tb-background)", 92, "var(--tb-text)"), overflow: "hidden" },
    [
      container(
        [
          row(
            [
              col(
                [
                  c("heading", { text: "Mahatma Alumni Association", level: "p" }, { fontSize: "26px", fontWeight: "400" }),
                  body("A lifelong bond, a shared legacy.", { fontSize: "15px", lineHeight: "1.5" }),
                ],
                { flex: "0 1 auto", gap: "6px" }
              ),
              c(
                "navmenu",
                {
                  links: [
                    { label: "About", href: "#about" },
                    { label: "Schedule", href: "#schedule" },
                    { label: "Chief Guest", href: "#chief-guest" },
                    { label: "Sponsors", href: "#sponsors" },
                  ],
                },
                { gap: "26px", fontSize: "15px", fontWeight: "400" }
              ),
            ],
            { justifyContent: "space-between", alignItems: "center", gap: "20px" }
          ),
          c("heading", { text: "MAHATMA", level: "p" }, { fontSize: "190px", fontWeight: "400", lineHeight: "0.85", letterSpacing: "4px", textAlign: "center", color: mix("var(--tb-text)", 9), marginTop: "36px" }, undefined, {
            tablet: { fontSize: "130px" },
            mobile: { fontSize: "64px" },
          }),
        ],
        { gap: "0" }
      ),
    ],
    { name: "Footer" }
  );
}
