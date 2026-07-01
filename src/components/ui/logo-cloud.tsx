import type { CSSProperties, ReactNode } from "react";

import { rotatingProductLogos } from "@/lib/product-logos";
import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  children: ReactNode;
  gap?: number;
  duration?: number;
  reverse?: boolean;
  className?: string;
};

function InfiniteSlider({ children, gap = 84, duration = 42, reverse = false, className }: InfiniteSliderProps) {
  return (
    <div
      className={cn("infinite-slider", className)}
      style={{
        "--logo-cloud-gap": `${gap}px`,
        "--logo-cloud-duration": `${duration}s`,
      } as CSSProperties}
    >
      <div className={cn("infinite-slider-track", reverse && "is-reverse")}>
        <div className="logo-cloud-set">{children}</div>
        <div aria-hidden="true" className="logo-cloud-set">{children}</div>
      </div>
    </div>
  );
}

export default function LogoCloud() {
  const logos = rotatingProductLogos.map((logo) => (
    <span className="product-wordmark" key={logo.key} aria-label={logo.name}>
      <img src={logo.src} alt="" loading="lazy" />
    </span>
  ));

  return (
    <section className="logo-cloud-section" aria-labelledby="available-products-title">
      <div className="logo-cloud-shell page-shell">
        <div className="available-products-label">
          <h2 id="available-products-title"><span>Available</span><span>Digital Product</span></h2>
        </div>
        <div className="logo-cloud-marquee">
          <InfiniteSlider gap={112} duration={62}>
            {logos}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
