/**
 * UPI deep linking and QR string generation
 * Follows NPCI specifications for UPI URLs
 */

export interface UpiPaymentParams {
  upiId: string;
  payeeName: string;
  amount?: number;
  note?: string;
  merchantCode?: string;
  transactionRef?: string;
}

export function generateUpiUrl(params: UpiPaymentParams): string {
  const url = new URL("upi://pay");
  url.searchParams.set("pa", params.upiId);
  url.searchParams.set("pn", params.payeeName);
  url.searchParams.set("cu", "INR");

  if (params.amount && params.amount > 0) {
    url.searchParams.set("am", params.amount.toFixed(2));
  }

  if (params.note) {
    // Keep note safe, alphanumeric and simple spaces/dashes
    const sanitizedNote = params.note.slice(0, 50).trim();
    if (sanitizedNote) {
      url.searchParams.set("tn", sanitizedNote);
    }
  }

  if (params.merchantCode) {
    url.searchParams.set("mc", params.merchantCode);
  }

  if (params.transactionRef) {
    url.searchParams.set("tr", params.transactionRef);
  }

  return url.toString();
}
