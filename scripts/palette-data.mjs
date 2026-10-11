export const steps = [0, 2, 5, 10, 15, 20, 25, 30, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 98, 100];

const flat = (value) => () => value;

const bands = (bandList) => (step) => {
  for (const [limit, saturation] of bandList) {
    if (step <= limit) return saturation;
  }
  return bandList[bandList.length - 1][1];
};

export const families = [
  { name: "paper", hue: 40, saturation: bands([[5, 50], [20, 40], [65, 22], [100, 14]]) },
  { name: "ink", hue: 226, saturation: flat(40) },
  { name: "gold", hue: 39, saturation: flat(66) },
  { name: "forest", hue: 152, saturation: bands([[50, 40], [100, 46]]) },
  { name: "rust", hue: 13, saturation: flat(62) },
  { name: "slate", hue: 212, saturation: flat(12) },
  { name: "dv-green", hue: 160, saturation: flat(75) },
  { name: "dv-violet", hue: 260, saturation: flat(80) },
  { name: "dv-amber", hue: 28, saturation: flat(90) },
  { name: "dv-blue", hue: 217, saturation: flat(80) },
  { name: "dv-magenta", hue: 330, saturation: flat(75) },
];

export const fonts = {
  "font-display-family": '"Alegreya", ui-serif, Georgia, "Times New Roman", serif',
  "font-body-family": '"Nunito", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  "font-mono-family": '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

export const roles = [
  ["primary", "ink-95", "paper-5"],
  ["primary-container", "ink-90", "ink-80"],
  ["primary-fixed", "paper-10", "ink-85"],
  ["on-primary", "paper-2", "ink-98"],
  ["on-primary-container", "paper-2", "paper-2"],

  ["secondary", "forest-80", "forest-50"],
  ["secondary-container", "forest-80", "forest-50"],
  ["secondary-soft", "forest-10", "forest-90"],
  ["on-secondary", "paper-0", "ink-98"],
  ["on-secondary-container", "paper-0", "ink-98"],

  ["gold", "gold-55", "gold-40"],
  ["gold-line", "gold-60", "gold-30"],
  ["on-gold", "ink-95", "ink-98"],

  ["tertiary", "rust-65", "rust-40"],
  ["critical-red", "rust-65", "rust-40"],
  ["on-tertiary", "paper-0", "ink-98"],

  ["error", "rust-65", "rust-40"],
  ["on-error", "paper-0", "ink-98"],

  ["data-credits", "dv-green-70", "dv-green-50"],
  ["data-storage", "dv-violet-50", "dv-violet-40"],
  ["data-products", "dv-amber-60", "dv-amber-50"],
  ["data-users", "dv-blue-55", "dv-blue-50"],
  ["data-courses", "dv-amber-60", "dv-amber-50"],
  ["data-learners", "dv-magenta-60", "dv-magenta-50"],

  ["background", "paper-5", "ink-95"],
  ["surface", "paper-2", "ink-90"],
  ["surface-container-lowest", "paper-0", "ink-90"],
  ["surface-container-low", "paper-10", "ink-85"],
  ["surface-container", "paper-5", "ink-90"],
  ["surface-container-high", "paper-10", "ink-85"],
  ["surface-container-highest", "paper-15", "ink-80"],
  ["surface-variant", "paper-10", "ink-85"],

  ["on-background", "ink-95", "paper-2"],
  ["on-surface", "ink-95", "paper-2"],
  ["on-surface-variant", "paper-70", "paper-30"],

  ["outline", "paper-50", "ink-50"],
  ["outline-variant", "paper-15", "ink-80"],
];

export const tints = [
  ["gold-tint", "gold", 16],
];

export const statuses = [
  ["error-container", "rust-10", "rust-90"],
  ["status-vigente-bg", "forest-10", "forest-90"],
  ["status-vigente-fg", "forest-75", "forest-25"],
  ["status-vencido-bg", "rust-10", "rust-90"],
  ["status-vencido-fg", "rust-75", "rust-25"],
  ["status-pendiente-bg", "gold-10", "gold-90"],
  ["status-pendiente-fg", "gold-75", "gold-25"],
  ["status-neutro-bg", "paper-10", "ink-85"],
  ["status-neutro-fg", "paper-75", "ink-25"],
];

export const brandRoles = [
  "gold",
  "gold-line",
  "on-gold",
  "secondary",
  "secondary-container",
  "secondary-soft",
  "on-secondary",
];

export function parseToken(token) {
  const match = /^(.*)-(\d+)$/.exec(token);
  return { family: match[1], step: Number(match[2]) };
}

export function triplet(token) {
  const { family, step } = parseToken(token);
  const definition = families.find((entry) => entry.name === family);
  if (!definition) throw new Error(`Unknown family for token ${token}`);
  if (!steps.includes(step)) throw new Error(`Unknown step for token ${token}`);
  return { hue: definition.hue, saturation: definition.saturation(step), lightness: 100 - step };
}

export function tripletText(token) {
  const { hue, saturation, lightness } = triplet(token);
  return `${hue} ${saturation}% ${lightness}%`;
}

export function toRgb(token) {
  const { hue, saturation, lightness } = triplet(token);
  const s = saturation / 100;
  const l = lightness / 100;
  const a = s * Math.min(l, 1 - l);
  const channel = (n) => {
    const k = (n + hue / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [channel(0), channel(8), channel(4)];
}

export function luminance(token) {
  const [r, g, b] = toRgb(token).map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(tokenA, tokenB) {
  const a = luminance(tokenA);
  const b = luminance(tokenB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function roleToken(roleName, mode) {
  const index = mode === "light" ? 1 : 2;
  const role = roles.find((entry) => entry[0] === roleName);
  if (role) return role[index];
  const status = statuses.find((entry) => entry[0] === roleName);
  if (status) return status[index];
  throw new Error(`Unknown role ${roleName}`);
}

export function hexOf(token) {
  return `#${toRgb(token)
    .map((value) => Math.round(value * 255).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export const videoReferences = [
  { name: "paperLight", hex: "#FBF8F1", darkness: 4, tokens: ["paper-2", "paper-5"] },
  { name: "paper", hex: "#F4EFE4", darkness: 7, tokens: ["paper-5", "paper-10"] },
  { name: "paperDeep", hex: "#ECE5D7", darkness: 12, tokens: ["paper-10", "paper-15"] },
  { name: "line", hex: "#DDD4C2", darkness: 19, tokens: ["paper-15", "paper-20"] },
  { name: "goldTint", hex: "#F3E8CF", darkness: 12, tokens: ["gold-10", "gold-15"] },
  { name: "goldBright", hex: "#D6A644", darkness: 45, tokens: ["gold-40", "gold-50"] },
  { name: "gold", hex: "#B8862B", darkness: 55, tokens: ["gold-55"] },
  { name: "goldDeep", hex: "#7A5714", darkness: 72, tokens: ["gold-70", "gold-75"] },
  { name: "green", hex: "#1F4D3A", darkness: 79, tokens: ["forest-80"] },
];
