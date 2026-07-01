import type { Product } from "@/types";

export type ProductLogo = {
  key: string;
  name: string;
  src: string;
};

const logoModules = import.meta.glob("../../logos/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const preferredOrder = [
  "chatgpt",
  "claude",
  "perplexity",
  "gemini",
  "manus",
  "grok",
  "suno",
  "netflix",
  "spotify",
  "canva",
  "capcut",
  "express",
  "hiddify",
  "ms365",
  "notion",
  "zoom",
  "duolingo",
  "untitled-1",
];

const productLogoAliases: Record<string, string[]> = {
  "chatgpt-plus": ["chatgpt"],
  "claude-pro": ["claude"],
  "perplexity-pro": ["perplexity"],
  "gemini-advanced": ["gemini"],
  "manus-pro": ["manus"],
  "grok-premium": ["grok"],
  "suno-pro": ["suno"],
  netflix: ["netflix"],
  "spotify-premium": ["spotify"],
  "canva-pro": ["canva"],
  "capcut-pro": ["capcut"],
  expressvpn: ["express", "expressvpn"],
  "hiddify-vpn": ["hiddify"],
  "microsoft-365": ["ms365", "microsoft-365"],
  "notion-plus": ["notion"],
  "zoom-pro": ["zoom"],
  "duolingo-super": ["duolingo"],
  "adobe-creative-cloud": ["untitled-1", "adobe", "creative-cloud"],
  surfshark: ["surfshark"],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function prettyName(path: string) {
  return path
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "")
    .replace(/ms365/i, "Microsoft 365")
    .replace(/untitled-1/i, "Adobe Creative Cloud")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Digital product";
}

export const productLogos: ProductLogo[] = Object.entries(logoModules)
  .map(([path, src]) => {
    const key = normalize(path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? path);
    return { key, name: prettyName(path), src };
  })
  .sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a.key);
    const bIndex = preferredOrder.indexOf(b.key);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex) || a.name.localeCompare(b.name);
  });

export const rotatingProductLogos = productLogos.filter((logo) => !logo.key.includes("surfshark"));

export function getProductLogo(product: Pick<Product, "id" | "name" | "logoUrl">) {
  if (product.logoUrl) {
    return { key: product.id, name: product.name, src: product.logoUrl };
  }

  const candidates = [
    ...(productLogoAliases[product.id] ?? []),
    normalize(product.id),
    normalize(product.name),
    normalize(product.name.replace(/\b(plus|pro|premium)\b/gi, "")),
  ];

  return candidates.reduce<ProductLogo | undefined>((match, candidate) => {
    if (match) return match;
    return productLogos.find((logo) => logo.key === candidate || candidate.includes(logo.key) || logo.key.includes(candidate));
  }, undefined);
}
