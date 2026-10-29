import React from "react";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoneyTextProps {
  amount: number;
  className?: string;
  symbolClassName?: string;
  showDecimals?: boolean;
}

export function MoneyText({
  amount,
  className,
  symbolClassName,
}: MoneyTextProps) {
  const formatted = formatINR(amount, false);

  return (
    <span className={cn("tabular-nums font-semibold tracking-tight inline-flex items-baseline", className)}>
      <span className={cn("text-[0.85em] font-medium mr-0.5 text-gold-dark", symbolClassName)}>₹</span>
      <span>{formatted}</span>
    </span>
  );
}
