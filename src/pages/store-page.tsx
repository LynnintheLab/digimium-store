import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PageCanvas } from "@/components/layout/page-canvas";
import ProductCard from "@/components/ui/cards";
import { useCart } from "@/context/cart-context";
import { useProductData } from "@/context/product-data-context";
import { categories, getFirstPurchasableOption, isProductPurchasable, isProductVisible } from "@/data/products";
import { getProductLogo } from "@/lib/product-logos";
import type { Category, Product } from "@/types";

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const activeCategory = categories.includes(categoryParam as (typeof categories)[number])
    ? categoryParam as (typeof categories)[number]
    : "All";
  const [query, setQuery] = useState("");
  const { addItem, setIsOpen } = useCart();
  const { products } = useProductData();

  const availableProducts = useMemo(() => products.filter((product) => isProductVisible(product) && getProductLogo(product)), [products]);

  const visibleProducts = useMemo(() => availableProducts.filter((product) => {
    const categoryMatches = activeCategory === "All" || product.category === activeCategory;
    const queryMatches = `${product.name} ${product.category} ${product.summary}`.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatches && queryMatches;
  }), [activeCategory, query, availableProducts]);

  const selectCategory = (category: "All" | Category) => {
    const next = new URLSearchParams(searchParams);
    if (category === "All") next.delete("category");
    else next.set("category", category);
    setSearchParams(next, { replace: true });
  };

  const addProduct = (product: Product) => {
    if (!isProductPurchasable(product)) return;
    const option = getFirstPurchasableOption(product);
    if (!option) return;
    addItem(product.id, option.duration.label, option.plan.id);
    setIsOpen(true);
  };

  return (
    <PageCanvas className="store-canvas">
      <section className="store-hero page-shell">
        <div><p>THE STORE</p><h1>Pick your digital essentials.</h1></div>
        <p>Clean choices, clear durations, and no payment forms. Your final order moves to Telegram.</p>
      </section>

      <section className="store-catalog page-shell" aria-labelledby="catalog-title">
        <div className="catalog-tools">
          <div className="catalog-title"><SlidersHorizontal aria-hidden="true" /><div><h2 id="catalog-title">All products</h2><span>{visibleProducts.length} products</span></div></div>
          <label className="product-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" type="search" />
          </label>
        </div>

        <div className="category-filters" aria-label="Filter by category">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => selectCategory(category)} aria-pressed={activeCategory === category}>
              {category}
            </button>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addProduct} />)}
          </div>
        ) : (
          <div className="no-products"><Search aria-hidden="true" /><h2>No products found.</h2><p>Try a different name or category.</p><button type="button" onClick={() => { setQuery(""); selectCategory("All"); }}>Clear filters</button></div>
        )}
      </section>
    </PageCanvas>
  );
}
