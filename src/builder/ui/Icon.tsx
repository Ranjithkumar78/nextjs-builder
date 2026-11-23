import type { CSSProperties } from "react";

const PATHS: Record<string, string> = {
  section: "M3 5h18v14H3z M3 9h18",
  container: "M4 4h16v16H4z M8 8h8v8H8z",
  row: "M3 6h18v12H3z M9 6v12 M15 6v12",
  column: "M6 3h12v18H6z M6 9h12 M6 15h12",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  box: "M4 4h16v16H4z",
  spacer: "M12 3v18 M8 7l4-4 4 4 M8 17l4 4 4-4",
  divider: "M3 12h18",
  heading: "M6 4v16 M18 4v16 M6 12h12",
  text: "M4 6h16 M4 10h16 M4 14h10 M4 18h13",
  button: "M3 8h18v8H3z M8 12h8",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  list: "M9 6h12 M9 12h12 M9 18h12 M4 6h.01 M4 12h.01 M4 18h.01",
  quote: "M7 7h4v4c0 3-2 5-4 6 M15 7h4v4c0 3-2 5-4 6",
  badge: "M4 8h16v8H4z",
  image: "M3 5h18v14H3z M3 16l5-5 4 4 3-3 6 6 M15.5 9.5h.01",
  video: "M3 6h13v12H3z M16 10l5-3v10l-5-3",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z M9 4v14 M15 6v14",
  code: "M8 8l-4 4 4 4 M16 8l4 4-4 4 M14 5l-4 14",
  form: "M4 4h16v16H4z M7 8h10 M7 12h10 M7 16h5",
  input: "M3 8h18v8H3z M7 10v4",
  textarea: "M3 5h18v14H3z M7 9h10 M7 13h6",
  submit: "M3 8h18v8H3z M10 12l2 2 4-4",
  nav: "M4 7h16 M4 12h16 M4 17h16",
  logo: "M12 3l9 5v8l-9 5-9-5V8z",
  socials: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4",
  card: "M4 4h16v16H4z M4 12h16",
  hero: "M3 4h18v16H3z M7 10h10 M9 14h6",
  star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z",
  plus: "M12 5v14 M5 12h14",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
  copy: "M8 8h12v12H8z M4 16V4h12",
  up: "M12 19V5 M6 11l6-6 6 6",
  down: "M12 5v14 M6 13l6 6 6-6",
  parent: "M9 14L4 9l5-5 M4 9h11a5 5 0 0 1 0 10h-3",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeOff: "M3 3l18 18 M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9 M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 5.4-1.6 M9.9 9.9a3 3 0 0 0 4.2 4.2",
  undo: "M9 14L4 9l5-5 M4 9h10a6 6 0 0 1 0 12h-3",
  redo: "M15 14l5-5-5-5 M20 9H10a6 6 0 0 0 0 12h3",
  desktop: "M3 4h18v12H3z M8 20h8 M12 16v4",
  tablet: "M5 3h14v18H5z M11 18h2",
  mobile: "M7 2h10v20H7z M11 18h2",
  play: "M7 4l13 8-13 8z",
  download: "M12 3v12 M7 10l5 5 5-5 M4 20h16",
  upload: "M12 15V3 M7 8l5-5 5 5 M4 20h16",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
  pages: "M6 3h9l4 4v14H6z M14 3v5h5",
  palette: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1-.8-1.4-.8-2.3 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5z M7.5 11h.01 M10 7.5h.01 M14.5 7.5h.01",
  components: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M16.5 13v7 M13 16.5h7",
  chevronRight: "M9 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  close: "M6 6l12 12 M18 6L6 18",
  edit: "M4 20h4L19 9l-4-4L4 16z M14 6l4 4",
  check: "M5 12l5 5 9-10",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M21 21l-5-5",
  drag: "M9 5h.01 M15 5h.01 M9 12h.01 M15 12h.01 M9 19h.01 M15 19h.01",
  home: "M3 11l9-8 9 8 M5 10v10h14V10",
  alignLeft: "M4 6h16 M4 10h10 M4 14h16 M4 18h10",
  alignCenter: "M4 6h16 M7 10h10 M4 14h16 M7 18h10",
  alignRight: "M4 6h16 M10 10h10 M4 14h16 M10 18h10",
  alignJustify: "M4 6h16 M4 10h16 M4 14h16 M4 18h16",
  link2: "M8 12h8 M9 7H7a5 5 0 0 0 0 10h2 M15 7h2a5 5 0 0 1 0 10h-2",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3a14 14 0 0 1 0 18 M12 3a14 14 0 0 0 0 18",
  header: "M3 4h18v16H3z M3 9h18",
  footer: "M3 4h18v16H3z M3 15h18",
  file: "M6 3h9l4 4v14H6z",
  pricing: "M12 3v18 M16 7H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H8",
  users: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 20v-2a4 4 0 0 0-3-3.9 M16 2.1a4 4 0 0 1 0 7.8",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3 M12 17h.01",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  mail: "M3 5h18v14H3z M3 6l9 7 9-7",
  more: "M5 12h.01 M12 12h.01 M19 12h.01",
  mic: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M5 11a7 7 0 0 0 14 0 M12 18v3 M8 21h8",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.2 13.9 7 22l5-3 5 3-1.2-8.1",
  ticket: "M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z M14 6v12",
  calendar: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z M4 10h16 M8 2v4 M16 2v4",
  refresh: "M20 11a8 8 0 0 0-14.9-3.5 M4 4v4h4 M4 13a8 8 0 0 0 14.9 3.5 M20 20v-4h-4",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
};

export type IconName = keyof typeof PATHS | string;

export function Icon({ name, size = 16, style, className }: { name: IconName; size?: number; style?: CSSProperties; className?: string }) {
  const d = PATHS[name] ?? PATHS.box;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}
