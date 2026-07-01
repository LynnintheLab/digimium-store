import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";

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
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) setHasAnimated(true);
  }, [isInView, hasAnimated]);

  const visible = hasAnimated || reduceMotion;
  const itemVariants = {
    hidden: { y: reduceMotion ? 0 : 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: reduceMotion ? 0 : 0.45, ease: "easeOut" as const } },
  };
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
    <motion.section
      ref={containerRef}
      className="pricing-section"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
    >
      <div className="border bg-card text-card-foreground pricing-card">
        <div className="pricing-card-layout">
          <motion.div className="pricing-card-summary" variants={itemVariants}>
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

              <motion.div className={cn("pricing-price", (isOutOfStock || isDmForPrice) && "pricing-price--state")} variants={itemVariants}>
                <span>{priceText}</span>
                {!isOutOfStock && !isDmForPrice && duration.originalPrice && <del>{formatMoney(duration.originalPrice)}</del>}
                <small>{priceNote}</small>
              </motion.div>
            </div>
            {contactHref ? (
              <Button asChild className="w-full" size="lg" variant={isDmForPrice ? "default" : "outline"}>
                <a href={contactHref} target="_blank" rel="noreferrer">{buttonText}</a>
              </Button>
            ) : (
              <Button className="w-full" size="lg" onClick={onButtonClick} disabled={disabled}>{buttonText}</Button>
            )}
          </motion.div>

          <hr className="shrink-0 bg-border h-px w-full pricing-mobile-separator" />

          <motion.div className="pricing-features" variants={itemVariants}>
            {features.map((feature, featureIndex) => (
              <div key={feature.title}>
                <h3>{feature.title}</h3>
                <ul>
                  {feature.items.map((item) => (
                    <motion.li key={item} variants={itemVariants}>
                      <Check aria-hidden="true" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                {featureIndex < features.length - 1 && <hr className="shrink-0 bg-border h-px w-full my-6" />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
