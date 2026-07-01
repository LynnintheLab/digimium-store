import { type CSSProperties, type SVGProps } from "react";

import { cn } from "@/lib/utils";

interface DotPatternProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  columns?: number;
  rows?: number;
  duration?: number;
}

export function DotPattern({
  width = 24,
  height = 24,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  columns = 62,
  rows = 38,
  duration = 8,
  className,
  ...props
}: DotPatternProps) {
  const dots = Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const delay = -((column * 0.08 + row * 0.17) % duration);
    const opacity = 0.24 + ((column + row) % 5) * 0.045;

    return (
      <circle
        className="wave-dot"
        cx={column * width + cx}
        cy={row * height + cy}
        key={`${column}-${row}`}
        r={cr}
        style={{
          "--dot-wave-delay": `${delay}s`,
          "--dot-wave-duration": `${duration}s`,
          "--dot-opacity": opacity,
        } as CSSProperties}
      />
    );
  });

  return (
    <svg
      aria-hidden="true"
      className={cn("wave-dot-pattern pointer-events-none absolute inset-0 h-full w-full", className)}
      preserveAspectRatio="xMidYMin slice"
      viewBox={`0 0 ${columns * width} ${rows * height}`}
      {...props}
    >
      {dots}
    </svg>
  );
}
