import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/data/products";
import { cn } from "@/lib/utils";
import type { DurationOption, ProductFeatureGroup, ProductStatus } from "@/types";

interface PricingCardProps {
  title: string;
  planName?: string;
  description: string;
  status?: ProductStatus;
  statusNote?: string;
  duration: DurationOption;
  durations: DurationOption[];
  features: ProductFeatureGroup[];
  onDurationChange: (duration: DurationOption) => void;
  buttonText?: string;
  contactHref?: string;
  disabled?: boolean;
  onButtonClick?: () => void;
}

export function PricingCard({
  title,
  planName,
  description,
  status = "available",
  statusNote,
  duration,
  durations,
  features,
  onDurationChange,
  buttonText = "Add to cart",
  contactHref,
  disabled = false,
  onButtonClick,
}: PricingCardProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isOutOfStock = status === "out-of-stock";
  const isDmForPrice = status === "dm-for-price";
  const statusLabel = isOutOfStock ? "Out of stock" : isDmForPrice ? "DM for price" : null;
  const priceText = isOutOfStock ? "Out of stock" : isDmForPrice ? "DM Admin" : formatMoney(duration.price);
  const priceNote = statusNote ?? (
    isOutOfStock
      ? "This product is visible but cannot be ordered right now."
      : isDmForPrice
        ? "Price depends on current availability. Message admin to confirm."
        : "one-time payment for the selected period"
  );

  return (
    <section ref={containerRef} className={cn("pricing-section", isVisible && "is-visible")}>
      <div className="border bg-card text-card-foreground pricing-card">
        <div className="pricing-card-layout">
          <div className="pricing-card-summary">
            <div>
              <div className="flex flex-col space-y-1.5 p-0">
                {statusLabel && <span className={cn("pricing-status", `pricing-status--${status}`)}>{statusLabel}</span>}
                {planName && <span className="pricing-plan-name">{planName}</span>}
                <h1 className="pricing-title">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              <fieldset className="duration-options">
                <legend>Choose duration</legend>
                <div>
                  {durations.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      className={option.label === duration.label ? "is-selected" : ""}
                      onClick={() => onDurationChange(option)}
                      aria-pressed={option.label === duration.label}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className={cn("pricing-price", (isOutOfStock || isDmForPrice) && "pricing-price--state")}>
                <span>{priceText}</span>
                {!isOutOfStock && !isDmForPrice && duration.originalPrice && <del>{formatMoney(duration.originalPrice)}</del>}
                <small>{priceNote}</small>
              </div>
            </div>
            {contactHref ? (
              <Button asChild className="w-full" size="lg" variant={isDmForPrice ? "default" : "outline"}>
                <a href={contactHref} target="_blank" rel="noreferrer">{buttonText}</a>
              </Button>
            ) : (
              <Button className="w-full" size="lg" onClick={onButtonClick} disabled={disabled}>{buttonText}</Button>
            )}
          </div>

          <hr className="shrink-0 bg-border h-px w-full pricing-mobile-separator" />

          <div className="pricing-features">
            {features.map((feature, featureIndex) => (
              <div key={feature.title}>
                <h3>{feature.title}</h3>
                <ul>
                  {feature.items.map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {featureIndex < features.length - 1 && <hr className="shrink-0 bg-border h-px w-full my-6" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
