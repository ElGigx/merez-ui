# merez-ui

The single source of truth for Merez's visual skin, and the base for client sites.
Every Merez frontend (merez-admin, merez-web) and every client site **consumes** this
package — none copies it. See ADR-059 (gigxOS `SYSTEM/ADR/ADR-059.md`).

The skin was extracted verbatim from merez-admin, which held the mature design system.
merez-admin remains the reference; while any consumer still carries an inline copy, the
authority is this package.

## Architecture: a CSS core, Tailwind is optional

The foundation is **framework-agnostic CSS**. The source of truth is CSS custom
properties (`tokens.css`) plus plain CSS component classes (`components.css`) — they
work in any site (Next, Vite, WordPress, plain HTML) with **no build step and no
Tailwind**. Tailwind is only a thin *optional adapter* for the frontends that already
use it; it is not the foundation and a consumer never has to adopt it.

| File | What it is | For |
|---|---|---|
| `tokens.css` | Layer 1 primitives + Layer 2 semantic roles + the light/dark theme (`prefers-color-scheme` and `[data-theme]`). Pure custom properties. | everyone |
| `components.css` | Shared component classes in pure CSS (`.btn-cta`, `.btn-primary`, `.btn-secondary`, `.field-input`, `.status-chip`, `.icon`, focus ring, body base, scrollbar). Built on the tokens. | everyone |
| `fonts.css` | The Google Fonts `@import` (Alegreya display, Nunito body, JetBrains mono). | everyone |
| `merez.css` | Convenience bundle = fonts + tokens + components in one import. | zero-build consumers |
| `brand-template.css` | The client override contract: the tokens a client redefines to make the base its own. | client sites |
| `tailwind-preset.js` | Maps the semantic tokens to Tailwind utilities. Optional. | Tailwind consumers only |

## How to consume

### Zero-build site (a client, plain HTML)

```html
<link rel="stylesheet" href="merez-ui/merez.css" />
<link rel="stylesheet" href="my-brand.css" />
```

### A frontend that uses Tailwind (merez-admin, merez-web)

Entry CSS — import fonts and tokens before the Tailwind directives, components after
the component layer:

```css
@import "merez-ui/fonts.css";
@import "merez-ui/tokens.css";

@tailwind base;
@tailwind components;
@import "merez-ui/components.css";
@tailwind utilities;
```

Tailwind config:

```js
import merezPreset from "merez-ui/tailwind-preset";

export default {
  presets: [merezPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

Installed as a git dependency (no registry):

```json
"merez-ui": "github:ElGigx/merez-ui#<ref>"
```

During local development a consumer may point at the working copy with
`"merez-ui": "file:../merez-ui"` and switch to the pinned git ref when publishing.

## Client sites: base of Merez, brand of the site

A client loads the Merez base (`merez.css` or `tokens.css` + `components.css`) and then
its own brand override that redefines the brand tokens — fonts, the gold/attention role
and the action role — for both themes. Copy `brand-template.css`, rename it, and edit
the values. This is ADR-016: the base is Merez's, the brand is the Site's.

## The three brand roles (they do not change between themes)

- **Forest green → ACTION and affirmation.** `--secondary` (read) / `--secondary-container` (fill). Only things that can be executed. Class: `.btn-cta`.
- **Gold → BRAND and attention.** `--gold`, `--gold-line`, `--gold-tint`.
- **Ground → background and hierarchy.** `--background`, `--surface-*`.

A fourth, functional and not a brand color: **rust** (`--tertiary` / `--critical-red` / `--error`) — what broke or expired.

### Buttons: the panel convention wins

- `.btn-cta` — the green ACTION / primary call-to-action.
- `.btn-primary` — the neutral ink button.
- `.btn-secondary` — outlined.

(merez-web previously used `.btn-primary` for the green action; on adoption it migrates
that usage to `.btn-cta`.)

## Why the ground changes temperature between themes

- Darkening a bright yellow turns it to brown. On cream paper no bright gold reaches
  4.5:1 for text, so in **light** theme gold is a **surface** (dark ink on top) and
  never small text. In **dark** theme gold reads (7.5:1) and can be ink.
- A warm ground at low luminance turns muddy and dulls what sits on it. So the dark
  theme keeps the cold **slate** family (#343A40): there the brand is carried by gold
  and green, not by the ground.

The action accent needs **two** tokens, not one: `--secondary` is what is read,
`--secondary-container` is what is filled. In light they coincide; in dark they do not,
and a single value leaves buttons washed out.

## The data palette is not a fourth role

`--data-credits`, `--data-storage`, `--data-products`, `--data-users`, `--data-courses`,
`--data-learners` give identity to unrelated data categories. It is the categorical use
of color (identity, not state or hierarchy). The green here is **not** the action green
and must not be used for buttons or links. When a resource crosses 80% its bar goes to
rust: state wins over identity.

## The rule

Components never reference a raw hex or a Layer 1 primitive directly — only the Layer 2
semantic roles. merez-admin enforces this with `src/lib/design-tokens.test.ts`; new
consumers should carry the same guard.
