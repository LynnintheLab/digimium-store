import type { ReactNode } from "react";

import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

interface PageCanvasProps {
  children: ReactNode;
  className?: string;
}

export function PageCanvas({ children, className }: PageCanvasProps) {
  return (
    <div className={cn("page-canvas", className)}>
      <DotPattern
        animated
        cy={1}
        cr={0.65}
        cx={1}
        className="page-dot-pattern [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
      />
      <div className="page-canvas-content">{children}</div>
    </div>
  );
}
