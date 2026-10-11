import { contrast, roleToken } from "./palette-data.mjs";

const surfaces = [
  "background",
  "surface",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
  "surface-variant",
];

const baseSurfaces = ["background", "surface", "surface-container-lowest", "surface-container"];

const rules = [];

for (const surface of surfaces) {
  rules.push({ group: "text", text: "on-surface", ground: surface, minimum: 7 });
  rules.push({ group: "text", text: "on-background", ground: surface, minimum: 7 });
  rules.push({ group: "secondary text", text: "on-surface-variant", ground: surface, minimum: 4.5 });
}

const buttonPairs = [
  ["on-primary", "primary"],
  ["on-primary-container", "primary-container"],
  ["on-secondary", "secondary"],
  ["on-secondary", "secondary-container"],
  ["on-secondary-container", "secondary-container"],
  ["on-gold", "gold"],
  ["on-error", "error"],
  ["on-tertiary", "tertiary"],
];
for (const [text, ground] of buttonPairs) {
  rules.push({ group: "button text", text, ground, minimum: 4.5 });
}

for (const ground of baseSurfaces) {
  rules.push({ group: "border", text: "outline", ground, minimum: 3 });
}

const extraPairs = [
  ["extra text", "secondary", "background", 4.5],
  ["extra text", "error", "background", 4.5],
  ["extra text", "on-surface", "primary-fixed", 7],
  ["extra text", "on-surface", "error-container", 7],
  ["extra text", "on-surface", "secondary-soft", 7],
  ["extra graphic", "gold-line", "background", 3],
  ["extra text", "status-vigente-fg", "status-vigente-bg", 4.5],
  ["extra text", "status-vencido-fg", "status-vencido-bg", 4.5],
  ["extra text", "status-pendiente-fg", "status-pendiente-bg", 4.5],
  ["extra text", "status-neutro-fg", "status-neutro-bg", 4.5],
];
for (const [group, text, ground, minimum] of extraPairs) {
  rules.push({ group, text, ground, minimum });
}

for (const dataRole of ["data-credits", "data-storage", "data-products", "data-users", "data-courses", "data-learners"]) {
  for (const ground of ["background", "surface", "surface-container-lowest", "surface-container-high"]) {
    rules.push({ group: "extra graphic", text: dataRole, ground, minimum: 3 });
  }
}

let failures = 0;
for (const mode of ["light", "dark"]) {
  console.log(`\n${mode} mode`);
  for (const rule of rules) {
    const textToken = roleToken(rule.text, mode);
    const groundToken = roleToken(rule.ground, mode);
    const ratio = contrast(textToken, groundToken);
    const ok = ratio >= rule.minimum;
    if (!ok) failures += 1;
    const label = `${rule.text} (${textToken}) on ${rule.ground} (${groundToken})`;
    console.log(`${ok ? "pass" : "FAIL"}  ${ratio.toFixed(2).padStart(6)}:1  min ${rule.minimum}  [${rule.group}]  ${label}`);
  }
}

console.log(failures === 0 ? "\nAll contrast pairs pass" : `\n${failures} contrast pair(s) fail`);
process.exit(failures === 0 ? 0 : 1);
