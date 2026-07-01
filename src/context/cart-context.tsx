import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getProductPlans, isProductPurchasable } from "@/data/products";
import { useProductData } from "@/context/product-data-context";
import type { CartItem } from "@/types";

const STORAGE_KEY = "digimium-react-cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (productId: string, duration: string, planId?: string) => void;
  changeQuantity: (productId: string, duration: string, delta: number, planId?: string) => void;
  removeItem: (productId: string, duration: string, planId?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function samePlan(left?: string, right?: string) {
  return !left || !right || left === right;
}

function loadCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(saved)) return [];

    return saved.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<CartItem>;
      return Boolean(
        typeof candidate.productId === "string"
        && typeof candidate.duration === "string"
        && Number.isInteger(candidate.quantity)
        && Number(candidate.quantity) > 0,
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const { findProduct, isLoading, products } = useProductData();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (isLoading) return;
    setItems((current) => current.filter((item) => {
      const product = findProduct(item.productId);
      const durationExists = product && getProductPlans(product).some((plan) => (
        (!item.planId || plan.id === item.planId)
        && plan.durations.some((duration) => duration.label === item.duration && (duration.status ?? "available") === "available")
      ));
      return Boolean(product && isProductPurchasable(product) && durationExists);
    }));
  }, [findProduct, isLoading, products]);

  const addItem = (productId: string, duration: string, planId?: string) => {
    const product = findProduct(productId);
    if (!product || !isProductPurchasable(product)) return;
    const plans = getProductPlans(product);
    const plan = plans.find((candidate) => candidate.id === planId) ?? plans[0];
    const option = plan?.durations.find((candidate) => candidate.label === duration);
    if (!plan || !option || (plan.status ?? "available") !== "available" || (option.status ?? "available") !== "available") return;

    setItems((current) => {
      const existing = current.find((item) => item.productId === productId && item.duration === duration && samePlan(item.planId, plan.id));
      if (existing) {
        return current.map((item) =>
          item.productId === productId && item.duration === duration && samePlan(item.planId, plan.id)
            ? { ...item, planId: plan.id, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId, planId: plan.id, duration, quantity: 1 }];
    });
  };

  const changeQuantity = (productId: string, duration: string, delta: number, planId?: string) => {
    setItems((current) => current
      .map((item) => item.productId === productId && item.duration === duration && samePlan(item.planId, planId)
        ? { ...item, planId: item.planId ?? planId, quantity: item.quantity + delta }
        : item)
      .filter((item) => item.quantity > 0));
  };

  const removeItem = (productId: string, duration: string, planId?: string) => {
    setItems((current) => current.filter((item) => !(
      item.productId === productId
      && item.duration === duration
      && samePlan(item.planId, planId)
    )));
  };

  const totals = useMemo(() => items.reduce(
    (result, item) => {
      const product = findProduct(item.productId);
      const plans = product ? getProductPlans(product) : [];
      const plan = plans.find((candidate) => candidate.id === item.planId) ?? plans[0];
      const duration = plan?.durations.find((option) => option.label === item.duration);
      return {
        count: result.count + item.quantity,
        total: result.total + (duration?.price ?? 0) * item.quantity,
      };
    },
    { count: 0, total: 0 },
  ), [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: totals.count,
    total: totals.total,
    isOpen,
    setIsOpen,
    addItem,
    changeQuantity,
    removeItem,
    clearCart: () => setItems([]),
  }), [items, totals, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
