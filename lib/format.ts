/**
 * Indian Rupee and number formatting utilities
 */

export function formatINR(amount: number, includeSymbol = true): string {
  if (isNaN(amount)) return includeSymbol ? "₹0" : "0";

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);

  return includeSymbol ? `₹${formatted}` : formatted;
}

export function parseINR(value: string): number {
  const clean = value.replace(/[^0-9]/g, "");
  return clean ? parseInt(clean, 10) : 0;
}
