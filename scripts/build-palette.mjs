import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { paletteHtml } from "./palette-page.mjs";
import { families, steps, fonts, roles, tints, statuses, brandRoles, tripletText } from "./palette-data.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const paletteBlock = () => {
  const groups = families.map((family) =>
    steps.map((step) => `  --${family.name}-${step}: ${tripletText(`${family.name}-${step}`)};`).join("\n"),
  );
  return `:root {\n${groups.join("\n\n")}\n}\n`;
};

const modeLines = (mode, indent, includeAll) => {
  const index = mode === "light" ? 1 : 2;
  const lines = [];
  const wanted = includeAll ? roles : roles.filter((role) => brandRoles.includes(role[0]));
  for (const role of wanted) lines.push(`${indent}--${role[0]}: var(--${role[index]});`);
  for (const [name, source, percent] of tints) {
    lines.push(`${indent}--${name}: color-mix(in srgb, hsl(var(--${source})) ${percent}%, transparent);`);
  }
  if (includeAll) {
    for (const status of statuses) lines.push(`${indent}--${status[0]}: hsl(var(--${status[index]}));`);
  }
  return lines;
};

const fontLines = () => Object.entries(fonts).map(([name, value]) => `  --${name}: ${value};`);

const tokensCss = () => {
  const light = [`  color-scheme: light;`, ``, ...modeLines("light", "  ", true), ``, ...fontLines()];
  const darkMedia = [`    color-scheme: dark;`, ...modeLines("dark", "    ", true)];
  const darkAttribute = [`  color-scheme: dark;`, ...modeLines("dark", "  ", true)];
  return [
    paletteBlock(),
    `:root {\n${light.join("\n")}\n}\n`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${darkMedia.join("\n")}\n  }\n}\n`,
    `:root[data-theme="dark"] {\n${darkAttribute.join("\n")}\n}\n`,
  ].join("\n");
};

const brandCss = () => {
  const light = [...fontLines(), ``, ...modeLines("light", "  ", false)];
  const darkMedia = modeLines("dark", "    ", false);
  const darkAttribute = modeLines("dark", "  ", false);
  return [
    `:root {\n${light.join("\n")}\n}\n`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${darkMedia.join("\n")}\n  }\n}\n`,
    `:root[data-theme="dark"] {\n${darkAttribute.join("\n")}\n}\n`,
  ].join("\n");
};

const outputs = [
  ["tokens.css", tokensCss()],
  ["brand-template.css", brandCss()],
  ["docs/palette.html", paletteHtml()],
];

let stale = false;
for (const [file, content] of outputs) {
  const target = join(root, file);
  if (check) {
    let current = "";
    try {
      current = readFileSync(target, "utf8");
    } catch {
      current = "";
    }
    if (current !== content) {
      stale = true;
      console.error(`${file} does not match the palette script output. Run: node scripts/build-palette.mjs`);
    }
  } else {
    writeFileSync(target, content);
    console.log(`wrote ${file}`);
  }
}

if (check) {
  if (stale) process.exit(1);
  console.log("generated files match the palette script");
}
