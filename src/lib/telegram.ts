import { formatMoney, getProductPlans } from "@/data/products";
import type { CartItem, Product } from "@/types";

export const TELEGRAM_USERNAME = (import.meta.env.VITE_TELEGRAM_USERNAME ?? "").trim().replace(/^@/, "");
export const TELEGRAM_ADMIN_URL = `https://t.me/${TELEGRAM_USERNAME}`;

export function buildTelegramOrder(items: CartItem[], findProduct: (productId: string) => Product | undefined) {
  const lines = ["Hello Digimium, I would like to order:", ""];
  let total = 0;

  items.forEach((item, index) => {
    const product = findProduct(item.productId);
    const plans = product ? getProductPlans(product) : [];
    const plan = plans.find((candidate) => candidate.id === item.planId) ?? plans[0];
    const duration = plan?.durations.find((option) => option.label === item.duration);
    if (!product || !plan || !duration) return;
    const lineTotal = duration.price * item.quantity;
    total += lineTotal;
    lines.push(`${index + 1}. ${product.name} — ${plan.name} — ${duration.label} × ${item.quantity} — ${formatMoney(lineTotal)}`);
  });

  lines.push("", `Total: ${formatMoney(total)}`, "", "Please help me confirm availability and payment.");
  return lines.join("\n");
}

export function telegramUrl(message: string) {
  const username = TELEGRAM_USERNAME.trim().replace(/^@/, "");
  if (!username || username === "USERNAME") return null;
  return `https://t.me/${username}?text=${encodeURIComponent(message)}`;
}

export function productDmUrl(productName: string) {
  return telegramUrl(`Hello Digimium, I want to ask the current price for ${productName}.`) ?? TELEGRAM_ADMIN_URL;
}
