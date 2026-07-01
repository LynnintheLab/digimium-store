import type { Product } from "@/types";

const commonPerks = ["Telegram order support", "Clear price before confirmation", "Simple digital delivery"];

export const products: Product[] = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "AI Tools",
    summary: "Everyday AI for writing, research, and coding.",
    description: "A flexible AI subscription for faster answers, stronger models, and productive daily workflows.",
    promoted: true,
    promotionLabel: "This week only",
    promotionNote: "Save on longer plans while the offer is active.",
    tone: "blue",
    durations: [
      { label: "1 month", price: 15000 },
      { label: "3 months", price: 42000, originalPrice: 45000 },
      { label: "1 year", price: 150000, originalPrice: 180000 },
    ],
    plans: [
      {
        id: "chatgpt-plus-shared",
        name: "Shared",
        description: "Budget-friendly access for everyday AI use.",
        status: "available",
        durations: [
          { label: "1 month", price: 15000 },
          { label: "3 months", price: 42000, originalPrice: 45000 },
          { label: "1 year", price: 150000, originalPrice: 180000 },
        ],
      },
      {
        id: "chatgpt-plus-private",
        name: "Private",
        description: "A private account option with dedicated access.",
        status: "available",
        durations: [
          { label: "1 month", price: 49000 },
          { label: "3 months", price: 140000, originalPrice: 147000 },
        ],
      },
      {
        id: "chatgpt-plus-own-mail",
        name: "Your own mail",
        description: "ChatGPT Plus activated using your own email.",
        status: "available",
        durations: [{ label: "1 month", price: 135000 }],
      },
    ],
    features: [
      { title: "What you get", items: ["Advanced AI models", "Writing and coding help", "Image and file tools", "Faster availability"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    category: "AI Tools",
    summary: "Long-form thinking for documents and analysis.",
    description: "A thoughtful AI plan designed for deeper documents, analysis, planning, and long conversations.",
    tone: "orange",
    durations: [
      { label: "1 month", price: 16000 },
      { label: "3 months", price: 45000, originalPrice: 48000 },
      { label: "1 year", price: 168000, originalPrice: 192000 },
    ],
    features: [
      { title: "What you get", items: ["Long context conversations", "Document analysis", "Writing assistance", "Priority access"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    category: "AI Tools",
    summary: "Fast, source-backed answers for research.",
    description: "A focused research companion for exploring topics quickly with citations and advanced search tools.",
    tone: "green",
    durations: [
      { label: "1 month", price: 14000 },
      { label: "3 months", price: 39000, originalPrice: 42000 },
      { label: "1 year", price: 145000, originalPrice: 168000 },
    ],
    features: [
      { title: "What you get", items: ["Source-backed search", "Advanced research modes", "File analysis", "Higher usage limits"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "gemini-advanced",
    name: "Gemini Advanced",
    category: "AI Tools",
    summary: "Google AI for writing, planning, and everyday help.",
    description: "Advanced Gemini access for research, writing, image help, and Google-powered productivity.",
    tone: "blue",
    durations: [
      { label: "1 month", price: 15000 },
      { label: "3 months", price: 42000, originalPrice: 45000 },
      { label: "1 year", price: 150000, originalPrice: 180000 },
    ],
    features: [
      { title: "What you get", items: ["Advanced Gemini models", "Writing and planning help", "Image and file assistance", "Google ecosystem support"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "manus-pro",
    name: "Manus Pro",
    category: "AI Tools",
    summary: "Agentic AI help for tasks and workflows.",
    description: "A capable AI workspace for planning, executing, and organizing more complex digital work.",
    tone: "violet",
    durations: [
      { label: "1 month", price: 18000 },
      { label: "3 months", price: 51000, originalPrice: 54000 },
      { label: "1 year", price: 192000, originalPrice: 216000 },
    ],
    features: [
      { title: "What you get", items: ["Task-focused AI support", "Workflow assistance", "Research and planning", "Productivity tools"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "grok-premium",
    name: "Grok Premium",
    category: "AI Tools",
    summary: "Conversational AI for fast answers and ideas.",
    description: "Grok access for quick research, brainstorming, writing support, and conversational assistance.",
    status: "out-of-stock",
    statusNote: "Temporarily unavailable. It will stay visible here and return when stock is ready.",
    tone: "green",
    durations: [
      { label: "1 month", price: 12000 },
      { label: "3 months", price: 34000, originalPrice: 36000 },
      { label: "1 year", price: 132000, originalPrice: 144000 },
    ],
    features: [
      { title: "What you get", items: ["AI chat access", "Writing and idea support", "Research assistance", "Fast everyday answers"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "suno-pro",
    name: "Suno Pro",
    category: "Creative",
    summary: "AI music creation for songs and ideas.",
    description: "Create music concepts, demos, and song ideas with AI-powered generation tools.",
    tone: "orange",
    durations: [
      { label: "1 month", price: 13000 },
      { label: "3 months", price: 37000, originalPrice: 39000 },
      { label: "1 year", price: 144000, originalPrice: 156000 },
    ],
    features: [
      { title: "What you get", items: ["AI song generation", "Creative music drafts", "Prompt-based creation", "Expanded usage limits"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "Streaming",
    summary: "Movies and series ready when you are.",
    description: "Straightforward streaming access for series, films, documentaries, and family entertainment.",
    tone: "orange",
    durations: [
      { label: "1 month", price: 10000 },
      { label: "3 months", price: 30000 },
      { label: "1 year", price: 110000, originalPrice: 120000 },
    ],
    features: [
      { title: "What you get", items: ["Movies and series", "Multiple genres", "Smart recommendations", "Cross-device viewing"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    category: "Streaming",
    summary: "Ad-free music, playlists, and downloads.",
    description: "Premium listening for music and podcasts with downloads and uninterrupted playback.",
    tone: "green",
    durations: [
      { label: "1 month", price: 7000 },
      { label: "3 months", price: 20000, originalPrice: 21000 },
      { label: "1 year", price: 76000, originalPrice: 84000 },
    ],
    features: [
      { title: "What you get", items: ["Ad-free listening", "Offline downloads", "On-demand playback", "High-quality audio"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "expressvpn",
    name: "ExpressVPN",
    category: "VPN",
    summary: "Fast protection with a simple interface.",
    description: "A polished VPN choice for fast, stable, and private internet connections.",
    tone: "violet",
    durations: [
      { label: "1 month", price: 9500 },
      { label: "3 months", price: 27000, originalPrice: 28500 },
      { label: "1 year", price: 96000, originalPrice: 114000 },
    ],
    features: [
      { title: "What you get", items: ["Fast global servers", "Strong encryption", "Easy device apps", "Reliable connectivity"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "hiddify-vpn",
    name: "Hiddify VPN",
    category: "VPN",
    summary: "Simple VPN access for private browsing.",
    description: "A lightweight VPN option for safer everyday browsing and simple protected connections.",
    tone: "green",
    durations: [
      { label: "1 month", price: 6000 },
      { label: "3 months", price: 17000, originalPrice: 18000 },
      { label: "1 year", price: 65000, originalPrice: 72000 },
    ],
    features: [
      { title: "What you get", items: ["Private browsing", "Simple device setup", "Encrypted connection", "Everyday VPN access"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "canva-pro",
    name: "Canva Pro",
    category: "Creative",
    summary: "Fast design tools for everyday content.",
    description: "Create social posts, presentations, videos, and brand assets with expanded design tools.",
    tone: "violet",
    durations: [
      { label: "1 month", price: 8000 },
      { label: "3 months", price: 23000, originalPrice: 24000 },
      { label: "1 year", price: 82000, originalPrice: 96000 },
    ],
    features: [
      { title: "What you get", items: ["Premium templates", "Brand tools", "Background removal", "Expanded media library"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    category: "Creative",
    summary: "Professional tools for serious creative work.",
    description: "A full creative toolkit for design, photography, illustration, video, and production workflows.",
    status: "dm-for-price",
    statusNote: "Price depends on plan availability. DM admin for the current option.",
    tone: "blue",
    durations: [
      { label: "1 month", price: 18000 },
      { label: "3 months", price: 52000, originalPrice: 54000 },
      { label: "1 year", price: 198000, originalPrice: 216000 },
    ],
    features: [
      { title: "What you get", items: ["Creative desktop apps", "Cloud workflow", "Design and photo tools", "Video production tools"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro",
    category: "Creative",
    summary: "Quick video editing for social content.",
    description: "Easy, capable video editing with premium effects and tools for short-form content.",
    tone: "violet",
    durations: [
      { label: "1 month", price: 7500 },
      { label: "3 months", price: 21000, originalPrice: 22500 },
      { label: "1 year", price: 78000, originalPrice: 90000 },
    ],
    features: [
      { title: "What you get", items: ["Premium effects", "Advanced editing tools", "Cloud storage", "Social-ready exports"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    category: "Productivity",
    summary: "Office apps and cloud tools for daily work.",
    description: "Productivity access for Word, Excel, PowerPoint, cloud storage, and everyday document work.",
    tone: "blue",
    durations: [
      { label: "1 month", price: 10000 },
      { label: "3 months", price: 28000, originalPrice: 30000 },
      { label: "1 year", price: 105000, originalPrice: 120000 },
    ],
    features: [
      { title: "What you get", items: ["Office apps", "Cloud storage", "Document editing", "Cross-device workflow"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "notion-plus",
    name: "Notion Plus",
    category: "Productivity",
    summary: "A clean workspace for notes, docs, and projects.",
    description: "Notion access for organized notes, team spaces, project pages, and flexible planning.",
    tone: "orange",
    durations: [
      { label: "1 month", price: 9000 },
      { label: "3 months", price: 26000, originalPrice: 27000 },
      { label: "1 year", price: 98000, originalPrice: 108000 },
    ],
    features: [
      { title: "What you get", items: ["Unlimited blocks", "Organized workspaces", "Project pages", "Team-ready notes"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "zoom-pro",
    name: "Zoom Pro",
    category: "Productivity",
    summary: "Meetings and video calls without limits.",
    description: "Zoom access for longer calls, online classes, team meetings, and client sessions.",
    tone: "blue",
    durations: [
      { label: "1 month", price: 12000 },
      { label: "3 months", price: 34000, originalPrice: 36000 },
      { label: "1 year", price: 132000, originalPrice: 144000 },
    ],
    features: [
      { title: "What you get", items: ["Longer meetings", "Video conferencing", "Screen sharing", "Reliable meeting access"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
  {
    id: "duolingo-super",
    name: "Duolingo Super",
    category: "Learning",
    summary: "Language practice with fewer interruptions.",
    description: "A learning subscription for language practice, extra features, and smoother daily lessons.",
    tone: "green",
    durations: [
      { label: "1 month", price: 8000 },
      { label: "3 months", price: 23000, originalPrice: 24000 },
      { label: "1 year", price: 88000, originalPrice: 96000 },
    ],
    features: [
      { title: "What you get", items: ["Language lessons", "Ad-free practice", "Extra learning tools", "Daily study support"] },
      { title: "Digimium service", items: commonPerks },
    ],
  },
];

export const categories = ["All", "AI Tools", "Streaming", "VPN", "Creative", "Productivity", "Learning"] as const;

export function getProductStatus(product: Product) {
  return product.status ?? "available";
}

export function isProductVisible(product: Product) {
  return getProductStatus(product) !== "hidden";
}

export function isProductPurchasable(product: Product) {
  return getProductStatus(product) === "available" && getProductPlans(product).some((plan) => (
    (plan.status ?? "available") === "available"
    && plan.durations.some((duration) => (duration.status ?? "available") === "available")
  ));
}

export function getProductPlans(product: Product) {
  return product.plans?.length
    ? product.plans
    : [{
        id: `${product.id}-standard`,
        name: "Standard",
        description: "",
        status: product.status ?? "available",
        durations: product.durations,
      }];
}

export function getFirstPurchasableOption(product: Product) {
  for (const plan of getProductPlans(product)) {
    if ((plan.status ?? "available") !== "available") continue;
    const duration = plan.durations.find((option) => (option.status ?? "available") === "available");
    if (duration) return { plan, duration };
  }
  return undefined;
}

export function needsAdminPrice(product: Product) {
  return getProductStatus(product) === "dm-for-price";
}

export function productStatusLabel(product: Product) {
  switch (getProductStatus(product)) {
    case "out-of-stock":
      return "Out of stock";
    case "dm-for-price":
      return "DM for price";
    case "hidden":
      return "Hidden";
    case "available":
    default:
      return "Available";
  }
}

export function formatMoney(value: number) {
  return `${new Intl.NumberFormat("en-US").format(value)} Ks`;
}
