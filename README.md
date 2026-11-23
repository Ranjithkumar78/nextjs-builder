# Custom Theme Builder

A drag-and-drop website theme builder built with Next.js. It uses no third-party UI, drag-and-drop or state libraries: every component, control and icon is written in this project.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:4350](http://localhost:4350).

## Features

- **Multiple themes:** each theme has its own colors, fonts, pages, header and footer. You can create a theme from a starter site, a blank theme or a copy of another theme, and apply style presets.
- **Multiple pages:** add pages from templates, then rename, duplicate, reorder or delete them, and give each one a URL slug.
- **Global header and footer:** each theme has one header and one footer, edited once and shown on every page. You can turn them off for individual pages.
- **Drag and drop:** drag elements or ready-made blocks from the left panel onto the canvas or the Layers tree. You can also drag elements already on the canvas to move them.
- **Full style control:** set typography, colors, a visual margin/padding editor, size, flex/grid layout, background images and gradients, borders, shadows, opacity, transforms, position and raw custom CSS.
- **Responsive and hover styles:** add separate overrides for tablet (≤1024px) and mobile (≤640px) screens, plus a `:hover` state.
- **Inline text editing:** double-click any text on the canvas to edit it.
- **Theme tokens:** theme colors and fonts are CSS variables, so changing one updates every element that uses it.
- **Undo/redo and autosave:** your work is saved in browser localStorage.
- **Live preview:** `/preview` opens your site in a new tab and updates as you edit.
- **Export:** download a single page as HTML, a whole theme as a ZIP of static HTML files, or a JSON backup of every theme that you can import again.

## Text formatting

In headings, paragraphs, badges and list items you can write `*words*` for an italic accent, colored with the element's *Accent color* setting, and `**words**` for bold. Line breaks are kept.

## Included themes

- **Mahatma Alumni Meetup 2026:** an alumni homecoming homepage with a live countdown, agenda, rules and terms. Its images are in `public/mahatma/`; replace them with your own photos, keeping the same file names, or upload new ones in the inspector.
- **Starter Light** and **Midnight Agency:** general starter sites with three pages each.

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| Ctrl/⌘ + Z | Undo |
| Ctrl/⌘ + Shift + Z, Ctrl + Y | Redo |
| Ctrl/⌘ + D | Duplicate |
| Ctrl/⌘ + C / V | Copy / paste element |
| Delete / Backspace | Delete element |
| Alt + ↑ / ↓ | Move element up / down |
| Esc | Select parent |
| ↑ / ↓ in number fields | Change the value (hold Shift for ×10) |

## Project structure

Every source file is kept under 100 lines. Shared pieces live in one place and are reused.

```
src/
  app/
    page.tsx              → the editor
    preview/page.tsx      → live preview
    styles/               → editor styles, one file per area (index.ts imports them in order)
    api/theme-builder/    → proxy routes to the Stutzee API
  server/                 → API settings and the shared proxy helper (server only)
  builder/
    types.ts              → data model (Project → Theme → Page → Node)
    lib/                  → small shared helpers (values, HTML, embeds, countdown, download, zip)
    registry/             → component definitions, one file per category (add new components here)
    presets/              → ready-made blocks and page templates; mahatma/ is the alumni theme
    defaults.ts           → starter themes and style presets
    store/                → state: reducers (nodes, themes, pages), undo/redo, sync/ (load + autosave)
    css/                  → turns element styles and theme tokens into CSS
    tree/                 → node tree helpers and page helpers
    dnd/                  → drag state and drop position logic
    api/                  → API client and data mapping
    eventData/            → live event data (speakers, sponsors, tickets, sessions): types, loading, formatting
    exporter/             → HTML and ZIP export
    render/               → renders elements (editor, preview and export)
      nodes/              → one renderer map per category (layout, text, media, forms, events)
      event-blocks/       → Speakers, Sponsors, Tickets and Sessions blocks and their shared parts
    preview/              → the live preview page
    editor/
      top-bar/  canvas/  left-panel/  inspector/  quick-edit/
    ui/
      controls/           → inputs (text, unit, select, color, toggle, box model, …)
      common/             → reusable pieces (panel, list item, icon button, upload button, …)
      hooks/              → useDismiss (click outside), useDraft (typing-safe inputs)
```

### Adding a new component

1. Add a `ComponentDef` to the matching category file in `src/builder/registry/components/` (or `registry/events/`).
2. Add a renderer for its `type` to the matching map in `src/builder/render/nodes/`.

The new component then appears in the left panel, and the inspector's Style tab works with it automatically.
