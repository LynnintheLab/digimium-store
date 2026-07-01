import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { PageCanvas } from "@/components/layout/page-canvas";
import { PricingCard } from "@/components/ui/pricing-card";
import { useCart } from "@/context/cart-context";
import { useProductData } from "@/context/product-data-context";
import { formatMoney, getProductPlans, getProductStatus, isProductVisible } from "@/data/products";
import { usePageMeta } from "@/hooks/use-page-meta";
import { productDmUrl } from "@/lib/telegram";
import type { DurationOption } from "@/types";

export function ProductPage() {
  const { productId = "" } = useParams();
  const { findProduct, isLoading } = useProductData();
  const product = findProduct(productId);
  const plans = product ? getProductPlans(product).filter((plan) => (plan.status ?? "available") !== "hidden") : [];
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? "");
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | undefined>(selectedPlan?.durations[0]);
  const { addItem, setIsOpen } = useCart();

  usePageMeta({
    title: product ? product.name : "Product",
    description: product ? product.description : undefined,
    path: `/product/${productId}`,
  });

  useEffect(() => {
    const nextPlans = product ? getProductPlans(product).filter((plan) => (plan.status ?? "available") !== "hidden") : [];
    const nextPlan = nextPlans[0];
    setSelectedPlanId(nextPlan?.id ?? "");
    setSelectedDuration(nextPlan?.durations.find((duration) => (duration.status ?? "available") !== "hidden"));
  }, [product]);

  if (!product && isLoading) return <PageCanvas className="product-canvas"><div className="route-loading" role="status">Loading…</div></PageCanvas>;
  if (!product || !selectedPlan || !selectedDuration || !isProductVisible(product)) return <Navigate to="/store" replace />;

  const productStatus = getProductStatus(product);
  const status = productStatus !== "available"
    ? productStatus
    : (selectedPlan.status ?? "available") !== "available"
      ? selectedPlan.status ?? "available"
      : selectedDuration.status ?? "available";
  const canBuy = status === "available";
  const dmForPrice = status === "dm-for-price";

  const addToCart = () => {
    if (!canBuy) return;
    addItem(product.id, selectedDuration.label, selectedPlan.id);
    setIsOpen(true);
  };

  const selectPlan = (planId: string) => {
    const plan = plans.find((candidate) => candidate.id === planId);
    const duration = plan?.durations.find((option) => (option.status ?? "available") !== "hidden");
    if (!plan || !duration) return;
    setSelectedPlanId(plan.id);
    setSelectedDuration(duration);
  };

  return (
    <PageCanvas className="product-canvas">
      <div className="product-page-head page-shell">
        <Link to="/store"><ArrowLeft aria-hidden="true" /> Back to store</Link>
        <span>{product.category}</span>
      </div>
      <div className="page-shell">
        {plans.length > 1 && (
          <section className="plan-picker" aria-labelledby="plan-picker-title">
            <div className="plan-picker-head">
              <h1 id="plan-picker-title">Choose a plan</h1>
              <span>Swipe or scroll to see every option</span>
            </div>
            <div className="plan-picker-rail">
              {plans.map((plan) => {
                const firstDuration = plan.durations.find((duration) => (duration.status ?? "available") === "available") ?? plan.durations[0];
                return (
                  <button
                    className={plan.id === selectedPlan.id ? "is-active" : ""}
                    key={plan.id}
                    onClick={() => selectPlan(plan.id)}
                    type="button"
                    aria-pressed={plan.id === selectedPlan.id}
                  >
                    <span>{plan.name}</span>
                    <p>{plan.description || `${plan.durations.length} duration option${plan.durations.length === 1 ? "" : "s"}`}</p>
                    <strong>{(plan.status ?? "available") === "dm-for-price" ? "DM for price" : firstDuration ? `From ${formatMoney(firstDuration.price)}` : "No price yet"}</strong>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        <PricingCard
          title={product.name}
          planName={selectedPlan.name}
          description={product.description}
          status={status}
          statusNote={product.statusNote}
          duration={selectedDuration}
          durations={selectedPlan.durations.filter((duration) => (duration.status ?? "available") !== "hidden")}
          features={product.features}
          onDurationChange={setSelectedDuration}
          buttonText={dmForPrice ? "DM admin for price" : canBuy ? "Add to cart" : "Out of stock"}
          contactHref={dmForPrice ? productDmUrl(product.name) : undefined}
          disabled={!canBuy}
          onButtonClick={addToCart}
        />
      </div>
    </PageCanvas>
  );
}
