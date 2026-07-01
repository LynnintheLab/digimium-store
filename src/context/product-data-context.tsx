import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { contacts as fallbackContacts } from "@/data/contacts";
import { products as fallbackProducts } from "@/data/products";
import type { ContactLink, Product, ProductPlan } from "@/types";

type DataSource = "api" | "fallback";

interface ProductDataContextValue {
  products: Product[];
  contacts: ContactLink[];
  source: DataSource;
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

function normalizeContact(contact: ContactLink & { image_url?: string; background_url?: string; sort_order?: number }): ContactLink {
  return {
    ...contact,
    imageUrl: contact.imageUrl || contact.image_url || "",
    backgroundUrl: contact.backgroundUrl || contact.background_url || "",
    sortOrder: contact.sortOrder ?? contact.sort_order ?? 0,
  };
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json() as Promise<T>;
}

export function ProductDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => fallbackProducts.map(normalizeProduct));
  const [contacts, setContacts] = useState<ContactLink[]>(fallbackContacts);
  const [source, setSource] = useState<DataSource>("fallback");
  const [isLoading, setIsLoading] = useState(true);
  const shouldUseApi = import.meta.env.PROD || import.meta.env.VITE_USE_API === "1";

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
        setSource("api");
      } catch {
        if (!isMounted) return;
        setProducts(fallbackProducts.map(normalizeProduct));
        setContacts(fallbackContacts);
        setSource("fallback");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [shouldUseApi]);

  const value = useMemo<ProductDataContextValue>(() => ({
    products,
    contacts,
    source,
    isLoading,
    findProduct: (productId: string) => products.find((product) => product.id === productId),
  }), [contacts, isLoading, products, source]);

  return <ProductDataContext.Provider value={value}>{children}</ProductDataContext.Provider>;
}

export function useProductData() {
  const context = useContext(ProductDataContext);
  if (!context) throw new Error("useProductData must be used within ProductDataProvider");
  return context;
}
