import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageCanvasProps {
  children: ReactNode;
  className?: string;
}

export function PageCanvas({ children, className }: PageCanvasProps) {
  return (
    <div className={cn("page-canvas", className)}>
      <div className="page-canvas-content">{children}</div>
    </div>
  );
}
