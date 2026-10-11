import { families, steps, roles, statuses, tripletText, hexOf, videoReferences } from "./palette-data.mjs";

const lightStepLimit = 50;

const labelColor = (step) => (step <= lightStepLimit ? "hsl(var(--ink-95))" : "hsl(var(--paper-2))");

const familySection = (family) => {
  const cells = steps
    .map((step) => {
      const token = `${family.name}-${step}`;
      return `<div class="step" style="background:hsl(var(--${token}));color:${labelColor(step)}"><b>${step}</b><span>${tripletText(token)}</span></div>`;
    })
    .join("");
  return `<section class="family"><h3>${family.name} <small>tono ${family.hue}&deg;</small></h3><div class="scroll"><div class="steps">${cells}</div></div></section>`;
};

const modeVariables = (mode) => {
  const index = mode === "light" ? 1 : 2;
  const declarations = [
    ...roles.map((role) => `--${role[0]}:var(--${role[index]});`),
    ...statuses.map((status) => `--${status[0]}:hsl(var(--${status[index]}));`),
  ].join("");
  return `.mode-${mode}{${declarations}--gold-tint:color-mix(in srgb,hsl(var(--gold)) 16%,transparent);}`;
};

const surfaceRoles = [
  ["background", "Fondo de página"],
  ["surface-container-lowest", "Superficie más clara"],
  ["surface", "Superficie"],
  ["surface-container", "Contenedor"],
  ["surface-container-high", "Contenedor alto"],
  ["surface-container-highest", "Contenedor más alto"],
];

const modePanel = (mode, title) => {
  const index = mode === "light" ? 1 : 2;
  const tokenOf = (name) => roles.concat(statuses).find((role) => role[0] === name)[index];
  const cards = surfaceRoles
    .map(
      ([name, label]) =>
        `<div class="card" style="background:hsl(var(--${name}));border:1px solid hsl(var(--outline-variant))"><p class="label">${label}<br><code>${name} &middot; ${tokenOf(name)}</code></p><p style="color:hsl(var(--on-surface));font-weight:700">Texto principal sobre esta superficie</p><p style="color:hsl(var(--on-surface-variant))">Texto secundario de apoyo</p><p style="color:hsl(var(--on-surface));border:1px solid hsl(var(--outline));padding:6px 10px;border-radius:8px;display:inline-block">Borde (outline)</p></div>`,
    )
    .join("");
  const buttons = `<div class="row"><span class="btn" style="background:hsl(var(--primary));color:hsl(var(--on-primary))">Principal</span><span class="btn" style="background:hsl(var(--secondary-container));color:hsl(var(--on-secondary))">Acción</span><span class="btn" style="background:hsl(var(--gold));color:hsl(var(--on-gold))">Marca</span><span class="btn" style="background:hsl(var(--error));color:hsl(var(--on-error))">Error</span><span class="btn" style="background:hsl(var(--secondary-soft));color:hsl(var(--on-surface))">Acción suave</span><span class="btn" style="background:hsl(var(--gold-tint));color:hsl(var(--on-surface));outline:2px solid hsl(var(--gold-line))">Tinte de marca</span></div>`;
  const chips = `<div class="row"><span class="chip" style="background:var(--status-vigente-bg);color:var(--status-vigente-fg)">Vigente</span><span class="chip" style="background:var(--status-vencido-bg);color:var(--status-vencido-fg)">Vencido</span><span class="chip" style="background:var(--status-pendiente-bg);color:var(--status-pendiente-fg)">Pendiente</span><span class="chip" style="background:var(--status-neutro-bg);color:var(--status-neutro-fg)">Neutro</span><span class="chip" style="background:var(--error-container);color:hsl(var(--error))">Error</span></div>`;
  const data = ["data-credits", "data-storage", "data-products", "data-users", "data-courses", "data-learners"]
    .map((name) => `<span class="bar" style="background:hsl(var(--${name}))"><i>${name.replace("data-", "")}</i></span>`)
    .join("");
  const roleTable = roles
    .map((role) => `<tr><td>${role[0]}</td><td>${role[index]}</td><td>${tripletText(role[index])}</td><td><i class="dot" style="background:hsl(var(--${role[index]}))"></i></td></tr>`)
    .join("");
  return `<section class="mode mode-${mode}" style="background:hsl(var(--background));color:hsl(var(--on-background))"><h3 style="color:hsl(var(--on-background))">${title}</h3><div class="cards">${cards}</div>${buttons}${chips}<div class="row">${data}</div><details open><summary>Roles y pasos</summary><table>${roleTable}</table></details></section>`;
};

const referenceStrip = () => {
  const rows = videoReferences
    .map((reference) => {
      const tokenCells = reference.tokens
        .map(
          (token) =>
            `<div class="pair-cell" style="background:hsl(var(--${token}));color:${labelColor(Number(token.split("-").pop()))}"><b>${token}</b><span>${hexOf(token)}</span><span>${tripletText(token)}</span></div>`,
        )
        .join("");
      return `<div class="pair"><div class="pair-cell video" style="background:${reference.hex};color:${labelColor(reference.darkness)}"><b>${reference.name}</b><span>${reference.hex}</span><span>oscuridad ${reference.darkness}</span></div>${tokenCells}</div>`;
    })
    .join("");
  return `<section><h2>Videos (merez-studio) frente a los pasos nuevos</h2><p>Izquierda: el color de <code>reel/src/theme.ts</code>. A la derecha, los pasos del sistema con oscuridad más cercana.</p><div class="pairs">${rows}</div></section>`;
};

export function paletteHtml() {
  const style = `
:root{color-scheme:light}
*{box-sizing:border-box}
body{margin:0;padding:24px 20px 60px;background:hsl(var(--paper-5));color:hsl(var(--ink-95));font-family:var(--font-body-family);font-weight:500}
h1,h2,h3{font-family:var(--font-display-family);margin:0 0 10px}
h1{font-size:34px}h2{font-size:24px;margin-top:36px}h3{font-size:18px}
small{font-weight:600;opacity:.7}
code{font-family:var(--font-mono-family);font-size:11px}
p{margin:6px 0}
.scroll{overflow-x:auto}
.steps{display:grid;grid-template-columns:repeat(${steps.length},minmax(58px,1fr));gap:2px;min-width:1240px}
.step{height:84px;padding:6px 5px;display:flex;flex-direction:column;justify-content:space-between;font-size:9px;line-height:1.15;border-radius:4px}
.step b{font-size:13px}
.family{margin-bottom:14px}
.modes{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:1100px){.modes{grid-template-columns:1fr}}
.mode{padding:18px;border-radius:14px;border:1px solid hsl(var(--outline-variant))}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:14px}
.card{padding:12px;border-radius:10px;font-size:13px}
.card .label{font-size:11px;opacity:.85;color:hsl(var(--on-surface-variant))}
.row{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.btn{padding:10px 18px;border-radius:8px;font-weight:700;font-size:13px}
.chip{padding:3px 12px;border-radius:999px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.02em}
.bar{display:inline-flex;align-items:flex-end;height:42px;min-width:92px;padding:4px 8px;border-radius:6px}
.bar i{font-style:normal;font-size:10px;font-weight:700;color:hsl(var(--background))}
details{margin-top:12px;font-size:12px}
table{border-collapse:collapse;width:100%;margin-top:6px}
td{padding:2px 8px 2px 0;border-bottom:1px solid hsl(var(--outline-variant));font-family:var(--font-mono-family);font-size:11px}
.dot{display:inline-block;width:22px;height:12px;border-radius:3px;border:1px solid hsl(var(--outline))}
.pairs{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:10px}
.pair{display:flex;gap:2px;align-items:stretch;flex-wrap:nowrap}
.pair small{align-self:center;padding-left:8px;font-size:10px}
.pair-cell{flex:1;min-height:92px;padding:8px;display:flex;flex-direction:column;justify-content:space-between;font-size:10px;border-radius:6px}
.pair-cell b{font-size:13px}
.video{outline:2px dashed hsl(var(--ink-95) / .5);outline-offset:-4px}
${modeVariables("light")}
${modeVariables("dark")}
`;
  const familySections = families.map(familySection).join("");
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Muestrario del sistema de color de Merez</title>
<link rel="stylesheet" href="../fonts.css">
<link rel="stylesheet" href="../tokens.css">
<style>${style}</style>
</head>
<body>
<h1>Sistema de color de Merez</h1>
<p>Todo color es HSL. El número de cada paso es su oscuridad: <b>número = 100 &minus; luz</b>. 0 es blanco puro y 100 es negro puro. El mismo número tiene la misma luz en cualquier familia.</p>
<h2>Roles en claro y oscuro</h2>
<div class="modes">${modePanel("light", "Modo claro")}${modePanel("dark", "Modo oscuro")}</div>
${referenceStrip()}
<h2>Familias por paso</h2>
${familySections}
</body>
</html>
`;
}
