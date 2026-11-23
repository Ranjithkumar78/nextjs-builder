import type { CSSProperties, MouseEvent } from "react";
import type { Page, Theme } from "../types";
import { ZoneView } from "./NodeView";
import type { RenderCtx } from "./types";

interface Props {
  theme: Theme;
  page: Page;
  rc: RenderCtx;
  onClick?: (e: MouseEvent) => void;
  style?: CSSProperties;
}

/** A rendered page as visitors see it: global header, the page's content, global footer. */
export function SiteBody({ theme, page, rc, onClick, style }: Props) {
  return (
    <div className="tb-root" onClick={onClick} style={style}>
      {page.showHeader ? <ZoneView nodes={theme.header} rc={rc} /> : null}
      <main>
        <ZoneView nodes={page.nodes} rc={rc} />
      </main>
      {page.showFooter ? <ZoneView nodes={theme.footer} rc={rc} /> : null}
    </div>
  );
}
