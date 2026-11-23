export type Device = "desktop" | "tablet" | "mobile";
export type StyleState = Device | "hover";

/** camelCase CSS property -> CSS value. Special key "__custom" holds raw declarations. */
export type StyleMap = Record<string, string>;

export interface NodeStyles {
  desktop: StyleMap;
  tablet?: StyleMap;
  mobile?: StyleMap;
  hover?: StyleMap;
}

export interface LinkItem {
  label: string;
  href: string;
}

export type PropValue = string | number | boolean | string[] | LinkItem[] | undefined;
export type NodeProps = Record<string, PropValue>;

export interface TBNode {
  id: string;
  type: string;
  name?: string;
  props: NodeProps;
  styles: NodeStyles;
  children?: TBNode[];
  hidden?: boolean;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  nodes: TBNode[];
  showHeader: boolean;
  showFooter: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  /** Background of dark sections. */
  dark: string;
  /** Text color used on dark sections. */
  onDark: string;
}

export interface ThemeTokens {
  colors: ThemeColors;
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;
  radius: string;
  containerWidth: string;
}

export interface Theme {
  id: string;
  name: string;
  /** Stutzee event whose speakers, sponsors, tickets and sessions the event-data components show. */
  eventId?: string;
  tokens: ThemeTokens;
  header: TBNode[];
  footer: TBNode[];
  pages: Page[];
  customCss: string;
}

export interface Project {
  version: 1;
  themes: Theme[];
  activeThemeId: string;
  activePageId: string;
}

export type Zone = "header" | "page" | "footer";

export interface DropTarget {
  zone: Zone;
  parentId: string | null;
  index: number;
}
