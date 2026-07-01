import { Bot, BookOpen, BriefcaseBusiness, Palette, Play, ShieldCheck, ShoppingCart, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { formatMoney, getFirstPurchasableOption, getProductStatus, isProductPurchasable, needsAdminPrice, productStatusLabel } from "@/data/products";
import { getProductLogo } from "@/lib/product-logos";
import { productDmUrl } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const categoryIcons: Record<Product["category"], LucideIcon> = {
  "AI Tools": Bot,
  Streaming: Play,
  VPN: ShieldCheck,
  Creative: Palette,
  Productivity: BriefcaseBusiness,
  Learning: BookOpen,
};

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const Icon = categoryIcons[product.category];
  const firstDuration = getFirstPurchasableOption(product)?.duration ?? product.durations[0];
  const logo = getProductLogo(product);
  const status = getProductStatus(product);
  const canBuy = isProductPurchasable(product);
  const dmForPrice = needsAdminPrice(product);
  const isOutOfStock = status === "out-of-stock";
  const priceLabel = dmForPrice ? "DM for price" : isOutOfStock ? "Out of stock" : firstDuration ? `From ${formatMoney(firstDuration.price)}` : "No duration";

  return (
    <article className={cn("product-card", `product-card--${status}`)}>
      <Link
        className={cn("product-art", `product-art--${product.tone}`)}
        style={product.logoBackground ? { background: product.logoBackground } : undefined}
        to={`/product/${product.id}`}
        aria-label={`View ${product.name} details`}
      >
        <span className="product-art-grid" aria-hidden="true"></span>
        {status !== "available" && <span className="product-status-badge">{productStatusLabel(product)}</span>}
        {logo ? (
          <img className="product-art-logo" src={logo.src} alt="" loading="lazy" />
        ) : (
          <>
            <Icon aria-hidden="true" />
            <span className="product-art-code" aria-hidden="true">{product.name.slice(0, 2).toUpperCase()}</span>
          </>
        )}
      </Link>
      <div className="product-card-body">
        <div className="product-card-meta">
          <span>{product.category}</span>
          <span>{priceLabel}</span>
        </div>
        <Link className="product-card-title" to={`/product/${product.id}`}>{product.name}</Link>
        <p>{product.summary}</p>
        <div className="product-card-actions">
          <Link className="view-product-link" to={`/product/${product.id}`}>View details</Link>
          {dmForPrice ? (
            <Button asChild size="sm" variant="outline">
              <a href={productDmUrl(product.name)} target="_blank" rel="noreferrer" aria-label={`DM admin for ${product.name} price`}>
                DM
              </a>
            </Button>
          ) : (
            <Button size="sm" onClick={() => onAdd(product)} disabled={!canBuy} aria-label={canBuy ? `Add ${product.name} to cart` : `${product.name} is out of stock`}>
              <ShoppingCart aria-hidden="true" />
              {isOutOfStock ? "Out" : "Add"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
