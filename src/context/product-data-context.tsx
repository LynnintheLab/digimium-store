import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { contacts as fallbackContacts, normalizeContact } from "@/data/contacts";
import { products as fallbackProducts } from "@/data/products";
import type { ContactLink, Product, ProductPlan } from "@/types";

interface ProductDataContextValue {
  products: Product[];
  contacts: ContactLink[];
  isLoading: boolean;
  findProduct: (productId: string) => Product | undefined;
}

const ProductDataContext = createContext<ProductDataContextValue | null>(null);

function normalizeProduct(product: Product): Product {
  const durations = product.durations ?? [];
  const plans: ProductPlan[] = product.plans?.length
    ? product.plans
    : [{
        id: `${product.id}-standard`,
        name: "Standard",
        description: "",
        status: product.status ?? "available",
        durations,
      }];
  return {
    ...product,
    status: product.status ?? "available",
    durations: plans[0]?.durations ?? durations,
    plans,
    features: product.features ?? [],
  };
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json() as Promise<T>;
}

const shouldUseApi = import.meta.env.PROD || import.meta.env.VITE_USE_API === "1";

export function ProductDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => fallbackProducts.map(normalizeProduct));
  const [contacts, setContacts] = useState<ContactLink[]>(fallbackContacts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!shouldUseApi) {
        setIsLoading(false);
        return;
      }

      try {
        const [productData, contactData] = await Promise.all([
          fetchJson<{ products: Product[] }>("/api/products"),
          fetchJson<{ contacts: ContactLink[] }>("/api/contacts"),
        ]);

        if (!isMounted) return;
        setProducts(productData.products.map(normalizeProduct));
        setContacts(contactData.contacts.map(normalizeContact));
      } catch {
        if (!isMounted) return;
        setProducts(fallbackProducts.map(normalizeProduct));
        setContacts(fallbackContacts);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<ProductDataContextValue>(() => ({
    products,
    contacts,
    isLoading,
    findProduct: (productId: string) => products.find((product) => product.id === productId),
  }), [contacts, isLoading, products]);

  return <ProductDataContext.Provider value={value}>{children}</ProductDataContext.Provider>;
}

export function useProductData() {
  const context = useContext(ProductDataContext);
  if (!context) throw new Error("useProductData must be used within ProductDataProvider");
  return context;
}
