import { useId, type CSSProperties, type SVGProps } from "react";

import { cn } from "@/lib/utils";

interface DotPatternProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  animated?: boolean;
  columns?: number;
  rows?: number;
  duration?: number;
}

export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  animated = false,
  columns = 62,
  rows = 38,
  duration = 8,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  if (animated) {
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

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full fill-slate-500/30", className)}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
