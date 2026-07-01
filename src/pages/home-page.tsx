import { ArrowRight, MessageCircleMore, MousePointerClick, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { PageCanvas } from "@/components/layout/page-canvas";
import { Button } from "@/components/ui/button";
import LogoCloud from "@/components/ui/logo-cloud";
import { useProductData } from "@/context/product-data-context";
import { formatMoney, getProductPlans, getProductStatus } from "@/data/products";
import { getProductLogo } from "@/lib/product-logos";

export function HomePage() {
  const { products } = useProductData();
  const checkoutSteps = [
    { icon: MousePointerClick, number: "01", title: "Choose a plan", description: "Select a product and duration." },
    { icon: ShoppingBag, number: "02", title: "Review the cart", description: "Confirm quantities and total." },
    { icon: MessageCircleMore, number: "03", title: "Continue on Telegram", description: "Send your prepared order." },
  ];

  const promotion = useMemo(() => {
    const available = products.filter((product) => getProductStatus(product) === "available");
    const product = available.find((candidate) => candidate.promoted)
      ?? available.find((candidate) => getProductPlans(candidate).some((plan) => plan.durations.some((duration) => (
        duration.originalPrice && duration.originalPrice > duration.price
      ))));
    if (!product) return undefined;

    const offers = getProductPlans(product).flatMap((plan) => plan.durations
      .filter((duration) => (duration.status ?? "available") === "available")
      .map((duration) => ({ plan, duration })));
    const offer = offers
      .filter(({ duration }) => duration.originalPrice && duration.originalPrice > duration.price)
      .sort((a, b) => ((b.duration.originalPrice ?? 0) - b.duration.price) - ((a.duration.originalPrice ?? 0) - a.duration.price))[0]
      ?? offers[0];
    if (!offer) return undefined;

    return { product, ...offer, logo: getProductLogo(product) };
  }, [products]);

  return (
    <PageCanvas className="home-canvas">
      <section className="landing-view" aria-labelledby="landing-title">
        <div className="landing-main page-shell">
          <div className="landing-copy">
            <h1 id="landing-title">digimium</h1>
            <p><span>Best Digital Supplier</span><span>For Myanmar People</span></p>
            <nav className="landing-actions" aria-label="Primary landing navigation">
              <Button asChild size="lg">
                <Link to="/store">Explore store <ArrowRight aria-hidden="true" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Contact us</Link>
              </Button>
            </nav>
          </div>

          {promotion && (
            <aside className="landing-promotion" aria-label={`${promotion.product.name} promotion`}>
              <span className="landing-promotion-grid" aria-hidden="true" />
              <div className="landing-promotion-topline">
                <span>{promotion.product.promotionLabel || "Limited offer"}</span>
                <span>{promotion.product.category}</span>
              </div>
              <div className="landing-promotion-product">
                {promotion.logo && <img src={promotion.logo.src} alt="" />}
                <div>
                  <h2>{promotion.product.name}</h2>
                  <p>{promotion.product.promotionNote || promotion.product.summary}</p>
                </div>
              </div>
              <div className="landing-promotion-offer">
                <div>
                  <span>{promotion.plan.name} · {promotion.duration.label}</span>
                  <strong>{formatMoney(promotion.duration.price)}</strong>
                  {promotion.duration.originalPrice && <del>{formatMoney(promotion.duration.originalPrice)}</del>}
                </div>
                <Link to={`/product/${promotion.product.id}`} aria-label={`View ${promotion.product.name} offer`}>
                  View offer <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </aside>
          )}
        </div>
      </section>

      <section className="checkout-section page-shell" aria-labelledby="checkout-title">
        <div className="checkout-intro">
          <h2 id="checkout-title">A checkout with no checkout theatre.</h2>
          <p>You choose. We prepare the message. Telegram handles the conversation.</p>
        </div>

        <ol className="checkout-steps">
          {checkoutSteps.map(({ icon: Icon, number, title, description }) => (
            <li key={number}>
              <div className="checkout-step-meta">
                <Icon aria-hidden="true" />
                <span>{number}</span>
              </div>
              <div className="checkout-step-copy">
                <h3><span>{title}</span></h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <LogoCloud />
    </PageCanvas>
  );
}
