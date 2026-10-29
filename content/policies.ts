/**
 * Legal Policy Templates for Kushbhawanpur Sanatan Dharma & Heritage Foundation
 * NOTE: Review with foundation legal counsel before publishing.
 */

export interface PolicyDocument {
  id: "privacy" | "terms" | "refund";
  title: string;
  lastUpdated: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export const policies: Record<string, PolicyDocument> = {
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    lastUpdated: "October 2026",
    sections: [
      {
        heading: "1. Commitment to Donor Privacy",
        content: "Kushbhawanpur Sanatan Dharma & Heritage Foundation is deeply committed to protecting your personal information. We do not sell, rent, trade, or otherwise transfer your personally identifiable information to outside parties.",
      },
      {
        heading: "2. Information We Collect",
        content: "When you make a donation or reach out through our contact form, we collect the details you voluntarily provide: your name, email address, phone number, postal address, and Permanent Account Number (PAN) when requested for statutory tax receipt issuance.",
      },
      {
        heading: "3. How Your Information is Used",
        content: "Your information is used strictly to issue formal acknowledgement receipts, communicate updates regarding foundation seva projects, comply with legal and income tax auditing requirements, and respond to your inquiries.",
      },
      {
        heading: "4. Data Security",
        content: "We implement rigorous administrative and digital security protocols to preserve the confidentiality of donor data. Financial transactions are conducted entirely through verified banking channels and UPI apps; no debit/credit card or banking passwords are ever collected or stored on our servers.",
      },
      {
        heading: "5. Contacting Us",
        content: "For any questions or requests regarding your personal records, please email us at contact@kushbhawanpur-foundation.org.",
      },
    ],
  },
  terms: {
    id: "terms",
    title: "Terms & Conditions",
    lastUpdated: "October 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content: "By browsing this website or offering voluntary seva contributions to Kushbhawanpur Sanatan Dharma & Heritage Foundation, you acknowledge and agree to comply with these terms.",
      },
      {
        heading: "2. Voluntary Nature of Contributions",
        content: "All financial and in-kind offerings made to the Foundation are strictly voluntary dharmic gifts intended solely for charitable, religious, environmental, and heritage preservation initiatives.",
      },
      {
        heading: "3. Intellectual Property & Scriptural Respect",
        content: "All photographic documentation, architectural records, emblem designs, and articles published on this portal are the intellectual property of the Foundation or used under licensed attribution. Sacred texts and shlokas are reproduced with profound reverence.",
      },
      {
        heading: "4. Limitation of Liability",
        content: "While we strive for absolute accuracy in documenting our field work, the Foundation shall not be held liable for temporary technical interruptions or unauthorized modifications made by malicious third parties.",
      },
      {
        heading: "5. Governing Law and Jurisdiction",
        content: "These terms and any disputes arising in connection with contributions shall be governed exclusively by the laws of India, subject to the jurisdiction of courts in Kushbhawanpur (Sultanpur) / Uttar Pradesh.",
      },
    ],
  },
  refund: {
    id: "refund",
    title: "Donation & Refund Policy",
    lastUpdated: "October 2026",
    sections: [
      {
        heading: "1. General Principle",
        content: "Donations once remitted to Kushbhawanpur Sanatan Dharma & Heritage Foundation are treated as irrevocable charitable contributions immediately directed towards daily goshala nourishment, temple restoration material procurement, and community seva.",
      },
      {
        heading: "2. Erroneous or Duplicate Deductions",
        content: "In genuine events of banking transmission glitches, unintentional double debit, or incorrect amounts entered by the donor, a written refund request must be lodged within seven (7) calendar days of the transaction timestamp.",
      },
      {
        heading: "3. Refund Procedure",
        content: "To initiate an inquiry, email donations@kushbhawanpur-foundation.org attaching bank transaction confirmation, UTR reference number, and payment date. Upon verification with our banker, eligible refunds will be reimbursed to the original originating account within 7 to 10 working days.",
      },
      {
        heading: "4. Cancellation of Pledges",
        content: "Donors wishing to modify or cancel pending pledges or intended recurring instructions may do so freely at any time by updating their respective bank or contacting our seva desk.",
      },
    ],
  },
};
