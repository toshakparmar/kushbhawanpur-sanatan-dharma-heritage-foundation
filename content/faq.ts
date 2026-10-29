import { siteConfig } from "./site.config";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "donation" | "tax" | "seva" | "general";
  visible: boolean;
}

export const faqs: FAQItem[] = [
  {
    id: "safe-donation",
    question: "Is my donation secure and verifiable?",
    answer: "Yes. All donations are received exclusively through the foundation's official institutional bank account and verified UPI ID. We do not use intermediary collection agents or third-party personal accounts. You will receive an official reference receipt upon confirmation.",
    category: "donation",
    visible: true,
  },
  {
    id: "how-to-receipt",
    question: "How do I get an official receipt for my contribution?",
    answer: "After making your transfer via UPI or direct Bank Transfer, please send an email to " + siteConfig.contact.donationEmail + " with your Name, Address, PAN (recommended for regulatory compliance), Donation Amount, and Bank UTR/Transaction Reference number. A signed digital receipt will be emailed to you within 24 to 48 hours.",
    category: "donation",
    visible: true,
  },
  {
    id: "tax-exemption",
    question: "Are donations eligible for Section 80G tax deduction?",
    answer: siteConfig.verification.has80GApproval
      ? "Yes, contributions are eligible for deduction under Section 80G of the Indian Income Tax Act. Please provide your PAN number to receive an 80G compliant certificate."
      : "The foundation's formal 80G tax exemption registration is currently under statutory review with tax authorities. While contributions directly fund ongoing heritage conservation and cow care, 80G tax exemption certificates will be issued once the statutory registration order is finalized.",
    category: "tax",
    visible: true, // Visible with accurate legal status explanation
  },
  {
    id: "monthly-giving",
    question: "Can I set up a recurring monthly donation?",
    answer: siteConfig.banking.onlineGateway.monthlyGivingEnabled
      ? "Yes, you can configure recurring monthly seva through our secure online payment link."
      : "Currently, recurring monthly giving is supported via recurring standing instructions (SI/e-Mandate) set up directly in your bank's netbanking portal or UPI app to our official account details. Online auto-debit integration is being prepared.",
    category: "donation",
    visible: true,
  },
  {
    id: "in-kind-donations",
    question: "Can I donate in kind (books, fodder, construction material)?",
    answer: "Yes, we warmly welcome contributions in kind! Useful items include fresh cattle fodder, construction grade lime and stone for temple conservation, Sanskrit granthas and gurukul stationery, and satvik grocery grains for Annadanam. Please write to " + siteConfig.contact.email + " to coordinate logistics before dispatch.",
    category: "seva",
    visible: true,
  },
  {
    id: "fund-utilization",
    question: "How are the funds utilized and accounted for?",
    answer: "100% of donor contributions are allocated directly to dharmic activities, including stone masonry restoration, food provisions for cows, scholarly stipends, and satvik prasad distribution. Administrative overheads are kept strictly minimal, and detailed accounts are maintained by our chartered accountant.",
    category: "general",
    visible: true,
  },
  {
    id: "refund-policy",
    question: "What is your refund policy regarding contributions?",
    answer: "Since charitable donations are immediately committed toward ongoing field operations (e.g., cow fodder procurement, restoration supplies), voluntary donations are normally non-refundable. However, in cases of inadvertent double payments or technical bank errors, refund requests submitted within 7 days with valid bank proofs will be reviewed and refunded.",
    category: "donation",
    visible: true,
  },
  {
    id: "csr-partnerships",
    question: "How can corporate organizations contribute under CSR?",
    answer: "Corporations seeking to fulfill CSR mandates in cultural preservation, national heritage protection (Schedule VII Item v), or animal welfare are invited to partner with us. Please reach out to our institutional desk at " + siteConfig.contact.email + " for project dossiers and compliance documentation.",
    category: "general",
    visible: true,
  },
];
