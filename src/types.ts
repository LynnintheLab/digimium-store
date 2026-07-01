export type Category = "AI Tools" | "Streaming" | "VPN" | "Creative" | "Productivity" | "Learning";

export interface DurationOption {
  id?: string | number;
  label: string;
  price: number;
  originalPrice?: number;
  status?: ProductStatus;
  sortOrder?: number;
}

export type ProductStatus = "available" | "out-of-stock" | "dm-for-price" | "hidden";

export interface ProductPlan {
  id: string;
  name: string;
  description?: string;
  status?: ProductStatus;
  sortOrder?: number;
  durations: DurationOption[];
}

export interface ProductFeatureGroup {
  title: string;
  items: string[];
  sortOrder?: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  summary: string;
  status?: ProductStatus;
  statusNote?: string;
  logoUrl?: string;
  logoBackground?: string;
  promoted?: boolean;
  promotionLabel?: string;
  promotionNote?: string;
  sortOrder?: number;
  plans?: ProductPlan[];
  durations: DurationOption[];
  features: ProductFeatureGroup[];
  tone: "blue" | "violet" | "green" | "orange";
}

export interface CartItem {
  productId: string;
  planId?: string;
  duration: string;
  quantity: number;
}

export interface ContactLink {
  id: string;
  type: "facebook" | "telegram-channel" | "telegram-admin" | "telegram" | string;
  title: string;
  subtitle: string;
  url: string;
  imageUrl?: string;
  backgroundUrl?: string;
  status?: ProductStatus;
  sortOrder?: number;
}
