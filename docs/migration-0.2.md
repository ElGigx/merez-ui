# Migrating to merez-ui 0.2.0

Version 0.2.0 replaces the whole color system (see gigxOS `BRANDS/Merez/Sistema-de-color.md`). The old RGB values are abandoned, not approximated: every color is HSL and the number of a step is its darkness (`number = 100 - L`).

## 1. The consumption rule

Every channel triplet is now HSL, so every consumer changes the wrapper:

| Before | After |
|---|---|
| `rgb(var(--secondary))` | `hsl(var(--secondary))` |
| `rgb(var(--secondary) / 0.5)` | `hsl(var(--secondary) / 0.5)` |
| `color-mix(in srgb, rgb(var(--gold)) 16%, transparent)` | `color-mix(in srgb, hsl(var(--gold)) 16%, transparent)` |
| Tailwind preset `rgb(var(--x) / <alpha-value>)` | `hsl(var(--x) / <alpha-value>)` (done inside `tailwind-preset.js`) |

A search and replace of `rgb(var(` with `hsl(var(` over the consumer's CSS and TSX is the whole mechanical part. Hard-coded `rgb(...)`/hex values that duplicated a token should be replaced by the role.

Roles keep their names (`--background`, `--on-surface`, `--secondary`, `--gold`, ...), so code that only uses roles or Tailwind utilities (`bg-surface`, `text-on-surface-variant`) needs nothing else. Only code that references palette steps directly (Layer 1) must change them.

## 2. Palette steps: old token to new token

The recommended token is the step of the same family whose darkness is closest to `100 - L` of the old value. Standard steps: 0, 2, 5, 10, 15, 20, 25, 30, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 98, 100.

| Old token | Old RGB | Darkness (100 - L) | New token | Note |
|---|---|---|---|---|
| `--white` | 255 255 255 | 0 | `--paper-0` | pure white |
| `--paper-25` | 251 248 241 | 4 | `--paper-5` |  |
| `--paper-50` | 244 239 228 | 7 | `--paper-5` |  |
| `--paper-100` | 236 229 215 | 12 | `--paper-10` |  |
| `--paper-150` | 233 225 210 | 13 | `--paper-15` |  |
| `--paper-200` | 226 217 199 | 17 | `--paper-15` |  |
| `--paper-300` | 221 212 194 | 19 | `--paper-20` |  |
| `--paper-500` | 196 185 163 | 30 | `--paper-30` |  |
| `--paper-600` | 138 131 119 | 50 | `--paper-50` |  |
| `--paper-700` | 92 85 75 | 67 | `--paper-65` |  |
| `--paper-800` | 58 53 44 | 80 | `--paper-80` |  |
| `--paper-900` | 38 36 31 | 86 | `--paper-85` |  |
| `--slate-50` | 233 236 239 | 7 | `--ink-5` | see note on slate |
| `--slate-100` | 206 212 218 | 17 | `--ink-15` | see note on slate |
| `--slate-200` | 173 181 189 | 29 | `--ink-30` | see note on slate |
| `--slate-300` | 134 142 150 | 44 | `--ink-40` | see note on slate |
| `--slate-400` | 108 117 125 | 54 | `--ink-55` | see note on slate |
| `--slate-500` | 63 69 76 | 73 | `--ink-75` | see note on slate |
| `--slate-600` | 52 58 64 | 77 | `--ink-75` | see note on slate |
| `--slate-700` | 42 47 52 | 82 | `--ink-80` | see note on slate |
| `--slate-750` | 40 44 49 | 83 | `--ink-85` | see note on slate |
| `--slate-800` | 35 39 44 | 85 | `--ink-85` | see note on slate |
| `--slate-850` | 33 37 41 | 85 | `--ink-85` | see note on slate |
| `--slate-900` | 26 29 33 | 88 | `--ink-90` | see note on slate |
| `--slate-950` | 22 25 28 | 90 | `--ink-90` | see note on slate |
| `--forest-50` | 223 236 228 | 10 | `--forest-10` |  |
| `--forest-200` | 127 201 160 | 36 | `--forest-40` |  |
| `--forest-300` | 70 172 118 | 53 | `--forest-55` |  |
| `--forest-400` | 30 122 82 | 70 | `--forest-70` |  |
| `--forest-500` | 31 77 58 | 79 | `--forest-80` |  |
| `--forest-900` | 22 48 42 | 86 | `--forest-85` |  |
| `--gold-50` | 243 232 207 | 12 | `--gold-10` |  |
| `--gold-300` | 224 182 92 | 38 | `--gold-40` |  |
| `--gold-400` | 214 166 68 | 45 | `--gold-40` |  |
| `--gold-450` | 201 154 60 | 49 | `--gold-50` |  |
| `--gold-500` | 184 134 43 | 55 | `--gold-55` |  |
| `--gold-600` | 174 125 38 | 58 | `--gold-60` |  |
| `--gold-700` | 122 87 20 | 72 | `--gold-70` |  |
| `--rust-50` | 246 226 218 | 9 | `--rust-10` |  |
| `--rust-200` | 232 160 141 | 27 | `--rust-25` |  |
| `--rust-300` | 224 128 107 | 35 | `--rust-40` |  |
| `--rust-600` | 154 59 34 | 63 | `--rust-65` |  |
| `--rust-700` | 125 47 27 | 70 | `--rust-70` |  |
| `--dv-green-600` | 18 148 106 | 67 | `--dv-green-65` |  |
| `--dv-green-400` | 43 163 107 | 60 | `--dv-green-60` |  |
| `--dv-violet-600` | 122 79 207 | 44 | `--dv-violet-40` |  |
| `--dv-violet-400` | 139 92 246 | 34 | `--dv-violet-30` |  |
| `--dv-amber-600` | 194 97 15 | 59 | `--dv-amber-60` |  |
| `--dv-amber-400` | 217 119 6 | 56 | `--dv-amber-55` |  |
| `--dv-blue-600` | 37 99 201 | 53 | `--dv-blue-55` |  |
| `--dv-blue-400` | 59 130 246 | 40 | `--dv-blue-40` |  |
| `--dv-magenta-600` | 163 23 95 | 64 | `--dv-magenta-65` |  |
| `--dv-magenta-400` | 224 64 127 | 44 | `--dv-magenta-40` |  |

### Families that changed purpose

- `slate` used to be the dark-mode ground (`slate-950` as page, `slate-50` as text). The dark-mode neutral is now `ink` (hue 226, 40 % saturation, grounds start at `ink-98` / `ink-95`), so the slate rows above recommend the `ink` step. `slate` still exists, but only as a desaturated cool gray (hue 212, 12 %) for borders and secondary text where the warm `paper` does not fit. If you need the old cool gray at the same darkness, use the same number in `slate` (for example `slate-85` instead of `ink-85`).
- Do not port the old dark-mode grounds one to one (they read as pastel mid-darks): use the roles `background` and `surface-container-*`, which start at 98 or 95.
- `--white` is gone: use `--paper-0` (pure white).
- `paper` and `gold` and the others keep their meaning. `--gold-450` (a one-off step) maps to `gold-50`.
- The data families (`dv-*`) keep their hues; their steps were `400` (dark mode) and `600` (light mode) and are now consumed through the `--data-*` roles. Prefer the roles.

## 3. Roles that changed value

Names are unchanged; values follow table 3 of the spec. Notable differences:

| Role | Before (light / dark) | Now (light / dark) |
|---|---|---|
| `--background` | paper-150 / slate-950 | paper-5 / ink-98 |
| `--surface`, `--surface-container-low` | paper-50 / slate-900, slate-800 | paper-2 / ink-95 |
| `--on-surface` | paper-900 / slate-50 | ink-95 / paper-2 |
| `--on-surface-variant` | paper-700 / slate-200 | paper-70 / paper-30 |
| `--outline` | paper-500 / slate-400 | paper-50 / ink-55 (moved from the spec's paper-30 / ink-70 to reach 3:1) |
| `--primary` | paper-900 / slate-100 | ink-95 / paper-5 |
| `--secondary`, `--secondary-container` | forest-500 / forest-300, forest-400 | forest-80 / forest-50 (both equal in each mode) |
| `--gold` | gold-500 / gold-400 | gold-55 / gold-40 |
| `--tertiary`, `--error`, `--critical-red` | rust-600 / rust-300 | rust-65 / rust-40 |

Two behavior changes:

- `--status-*-bg`, `--status-*-fg` and `--error-container` in dark mode used to be translucent `color-mix` over the page. They are now solid steps (background 10 in light and 90 in dark, text 75 in light and 25 in dark), so they no longer depend on what is underneath.
- `--on-secondary` and `--on-error` in light mode were pure white and are now `paper-0` (also pure white); in dark mode they are `ink-98` (near black) instead of white.

## 4. After migrating

1. Replace `rgb(var(` by `hsl(var(` (section 1).
2. Rename any direct Layer 1 token with the table in section 2, or better, switch to the role.
3. Update the version pin of `merez-ui` to `v0.2.0`.
4. Open `docs/palette.html` (from the package) to look at every family and the roles in both modes.
