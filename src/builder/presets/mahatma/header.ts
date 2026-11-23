import type { TBNode } from "../../types";
import { createNode as c } from "../../registry";
import { GOLD, mix, container, row } from "./helpers";

export function header(): TBNode {
  return c(
    "section",
    { tag: "header" },
    { padding: "14px 24px", backgroundColor: "#ffffff", position: "sticky", top: "0", zIndex: "50", boxShadow: "0 1px 0 rgba(0,0,0,.06)" },
    [
      container(
        [
          c("logo", { text: "", src: "/mahatma/logo.png", href: "/" }, { fontSize: "34px" }),
          row(
            [
              c(
                "navmenu",
                {
                  links: [
                    { label: "About", href: "#about" },
                    { label: "Schedule", href: "#schedule" },
                    { label: "Chief Guests", href: "#chief-guest" },
                    { label: "Sponsors", href: "#sponsors" },
                  ],
                },
                { gap: "24px", color: mix(GOLD, 80, "#fff"), fontSize: "15px", fontWeight: "500" },
                undefined,
                { mobile: { display: "none" } }
              ),
              c("button", { text: "Buy Tickets", href: "#register" }, { backgroundColor: GOLD, color: "#ffffff", padding: "10px 22px", borderRadius: "8px", fontSize: "15px" }, undefined, {
                hover: { backgroundColor: mix(GOLD, 85, "#000") },
              }),
            ],
            { width: "auto", alignItems: "center", gap: "16px", flexWrap: "nowrap" }
          ),
        ],
        { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }
      ),
    ],
    { name: "Header" }
  );
}
