/**
 * Kushbhawanpur Sanatan Dharma & Heritage Foundation
 * Master Configuration & Content Store
 * 
 * IMPORTANT:
 * - Real facts and registrations must be confirmed by the foundation.
 * - Flags toggle display of sections that depend on official verification.
 * - Unverified items are marked with TODO_ and will safely hide until verified.
 */

export interface FocusArea {
  id: string;
  title: string;
  hindiTitle: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  badge: string;
  suggestedAmount: number;
}

export interface ImpactItem {
  amount: number;
  label: string;
  outcome: string;
  description: string;
  iconName: string;
}

export interface SiteConfig {
  meta: {
    name: string;
    legalName: string;
    tagline: string;
    devanagariName: string;
    devanagariTagline: string;
    shloka: {
      sanskrit: string;
      transliteration: string;
      meaning: string;
      source: string;
    };
    siteUrl: string;
    city: string;
    state: string;
    country: string;
  };
  verification: {
    // Feature flags: set to true ONLY when official legal document numbers are provided
    has80GApproval: boolean;
    has12AApproval: boolean;
    hasRegistrationNumber: boolean;
    hasCsrApproval: boolean;
    registrationNumber: string | null;
    taxExemption80GNumber: string | null;
    taxExemption12ANumber: string | null;
    csrRegistrationNumber: string | null;
    darpanId: string | null;
    notes: string;
  };
  contact: {
    phone: string | null;
    email: string;
    donationEmail: string;
    whatsappNumber: string | null;
    registeredAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    mapEmbedUrl: string | null;
    socials: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  banking: {
    // UPI payment config
    upi: {
      enabled: boolean;
      upiId: string;
      payeeName: string;
      merchantCode?: string;
    };
    // Bank transfer (NEFT / RTGS / IMPS)
    bankTransfer: {
      enabled: boolean;
      accountName: string;
      accountNumber: string;
      accountType: string;
      bankName: string;
      ifscCode: string;
      branch: string;
      swiftCode?: string;
    };
    // Cheque / Demand Draft
    cheque: {
      enabled: boolean;
      payableTo: string;
      mailingAddress: string;
    };
    // Online Gateway (Razorpay/Cashfree hosted payment link)
    onlineGateway: {
      enabled: boolean;
      paymentUrl: string | null;
      monthlyGivingEnabled: boolean;
    };
  };
  donation: {
    currencySymbol: string;
    currencyCode: string;
    presetAmounts: number[];
    defaultAmount: number;
    minimumAmount: number;
    maximumAmount: number;
    receiptGuidance: string;
  };
  focusAreas: FocusArea[];
  impactTiers: ImpactItem[];
  donorBenefits: {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
  }[];
  commitments: {
    title: string;
    desc: string;
    icon: string;
  }[];
}

export const siteConfig: SiteConfig = {
  meta: {
    name: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
    legalName: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
    tagline: "Preserving Sacred Heritage · Serving Dharma · Empowering Seva",
    devanagariName: "कुशभवनपुर सनातन धर्म एवं धरोहर न्यास",
    devanagariTagline: "धर्मो रक्षति रक्षितः · धरोहर संरक्षण · निःस्वार्थ सेवा",
    shloka: {
      sanskrit: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥",
      transliteration: "Sarve bhavantu sukhinaḥ, sarve santu nirāmayāḥ | Sarve bhadrāṇi paśyantu, mā kaścid-duḥkha-bhāg-bhavet ||",
      meaning: "May all beings everywhere be happy and free from illness. May all see what is auspicious and no one suffer.",
      source: "Brihadaranyaka Upanishad"
    },
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://kushbhawanpur-foundation.org",
    city: "Kushbhawanpur (Sultanpur)",
    state: "Uttar Pradesh",
    country: "India",
  },

  verification: {
    // Flags are set to false until real certificates are produced by the foundation
    has80GApproval: false,
    has12AApproval: false,
    hasRegistrationNumber: false,
    hasCsrApproval: false,
    registrationNumber: "TODO_REGISTRATION_NUMBER",
    taxExemption80GNumber: "TODO_80G_NUMBER",
    taxExemption12ANumber: "TODO_12A_NUMBER",
    csrRegistrationNumber: "TODO_CSR_NUMBER",
    darpanId: "TODO_DARPAN_ID",
    notes: "Official verification in progress. All contributions go directly toward non-profit dharmic and cultural preservation projects.",
  },

  contact: {
    phone: null, // Set to real foundation telephone once verified
    email: "contact@kushbhawanpur-foundation.org",
    donationEmail: "donations@kushbhawanpur-foundation.org",
    whatsappNumber: null, // "+919876543210" once verified
    registeredAddress: {
      line1: "Kushbhawanpur Heritage Precinct",
      line2: "Civil Lines",
      city: "Kushbhawanpur (Sultanpur)",
      state: "Uttar Pradesh",
      pincode: "228001",
      country: "India",
    },
    mapEmbedUrl: null, // Optional lazy iframe facade when Google Maps link is provided
    socials: {
      // Unconfigured handles remain omitted
    },
  },

  banking: {
    upi: {
      enabled: true,
      upiId: "kushbhawanpur@upi", // Foundation UPI handle placeholder
      payeeName: "Kushbhawanpur Sanatan Dharma Foundation",
    },
    bankTransfer: {
      enabled: true,
      accountName: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
      accountNumber: "TODO_ACCOUNT_NUMBER",
      accountType: "Current Account",
      bankName: "State Bank of India",
      ifscCode: "TODO_IFSC_CODE",
      branch: "Main Branch, Kushbhawanpur",
    },
    cheque: {
      enabled: true,
      payableTo: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
      mailingAddress: "Kushbhawanpur Heritage Precinct, Civil Lines, Sultanpur, Uttar Pradesh - 228001",
    },
    onlineGateway: {
      enabled: false, // Set to true when Razorpay/Cashfree donation URL is provided
      paymentUrl: null,
      monthlyGivingEnabled: false,
    },
  },

  donation: {
    currencySymbol: "₹",
    currencyCode: "INR",
    presetAmounts: [501, 1100, 2100, 5100, 11000],
    defaultAmount: 2100,
    minimumAmount: 101,
    maximumAmount: 1000000,
    receiptGuidance: "After completing your donation via UPI or Bank Transfer, please send an email or WhatsApp with your Name, PAN, Amount, and Transaction UTR. An official acknowledgement receipt will be issued promptly.",
  },

  focusAreas: [
    {
      id: "temple-preservation",
      title: "Temple & Heritage Preservation",
      hindiTitle: "पुरातन मंदिर संरक्षण",
      shortDesc: "Restoring and conserving ancient stone shrines, historic mandapas, and sacred architectural landmarks of Kushbhawanpur.",
      fullDesc: "Our temple conservation mission works with traditional sthapatis and modern conservationists to preserve centuries-old stone carvings, remediate structural decay, and maintain sacred sanctity for future generations.",
      image: "/images/work-temple.webp",
      badge: "Architecture & Sanctity",
      suggestedAmount: 2100,
    },
    {
      id: "scripture-education",
      title: "Dharmic Education & Scriptures",
      hindiTitle: "वैदिक शिक्षा एवं ग्रंथ स्वाध्याय",
      shortDesc: "Supporting traditional gurukuls, Sanskrit scholars, and youth study circles in Vedic philosophy and cultural heritage.",
      fullDesc: "We provide educational stipends, study materials, and Sanskrit grantha preservation grants so the timeless wisdom of the Upanishads, Gita, and Itihasas continues to enlighten generations.",
      image: "/images/work-scriptures.webp",
      badge: "Knowledge & Wisdom",
      suggestedAmount: 1100,
    },
    {
      id: "gau-seva",
      title: "Gau Seva & Animal Care",
      hindiTitle: "गौ सेवा एवं संवर्धन",
      shortDesc: "Shelter, nutrition, veterinary care, and loving protection for indigenous desi cows and calves in clean rural sanctuaries.",
      fullDesc: "Providing clean drinking water, organic green fodder, medical support, and dignified life-long care for non-lactating and elderly cows in accordance with sacred Sanatan ideals.",
      image: "/images/work-gau-seva.webp",
      badge: "Compassion & Seva",
      suggestedAmount: 501,
    },
    {
      id: "community-seva",
      title: "Community Seva & Annadanam",
      hindiTitle: "अन्नदान एवं सामुदायिक सेवा",
      shortDesc: "Wholesome sacred meal distribution during major dharmic festivals, pilgrim gatherings, and in underserved rural hamlets.",
      fullDesc: "Practicing the sacred principle of Annadanam param danam — sharing pure satvik meals with pilgrims, sadhus, and families during auspicious celebrations.",
      image: "/images/work-community.webp",
      badge: "Pure Nourishment",
      suggestedAmount: 5100,
    },
    {
      id: "sacred-groves",
      title: "Sacred Groves & Banyan Ecology",
      hindiTitle: "पवित्र उपवन एवं पर्यावरण संरक्षण",
      shortDesc: "Planting and protecting sacred banyan, peepal, and neem groves around pilgrimage routes and village water bodies.",
      fullDesc: "Revitalising the ancient Indian tradition of tapovana and sacred groves (devaranyas) that purify the atmosphere, sustain local biodiversity, and nurture spiritual peace.",
      image: "/images/work-environment.webp",
      badge: "Ecological Dharma",
      suggestedAmount: 1100,
    },
    {
      id: "heritage-archives",
      title: "Manuscript & Heritage Archives",
      hindiTitle: "प्राचीन पाण्डुलिपि एवं शोध अभिलेख",
      shortDesc: "High-resolution digital archiving and physical conservation of rare manuscripts, historical inscriptions, and oral lore.",
      fullDesc: "Documenting local epigraphy, copper plates, and palm leaf manuscripts before they succumb to climate wear, ensuring open scholarly access.",
      image: "/images/work-archives.webp",
      badge: "Preservation",
      suggestedAmount: 5100,
    },
  ],

  impactTiers: [
    {
      amount: 501,
      label: "Seva Sankalpa",
      outcome: "Fodder & Care for Desi Cows",
      description: "Supports a week of fresh organic fodder, clean water, and salt lick mineral care for cows in our rural sanctuary.",
      iconName: "HeartHandshake",
    },
    {
      amount: 1100,
      label: "Vidya Sahayata",
      outcome: "Scripture Books for Gurukul Students",
      description: "Sponsors study texts, writing material, and traditional recitation manuals for young students of Sanskrit and Vedic literature.",
      iconName: "BookOpen",
    },
    {
      amount: 2100,
      label: "Dharohar Raksha",
      outcome: "Stone Conservation & Heritage Care",
      description: "Contributes toward protective lime-mortar stabilization and gentle biological cleaning of an ancient stone temple frieze.",
      iconName: "Landmark",
    },
    {
      amount: 5100,
      label: "Annadanam Seva",
      outcome: "Wholesome Satvik Meals for Pilgrims",
      description: "Provides full satvik prasad meals for approximately 100 pilgrims and sadhus during sacred parv days and regional yatras.",
      iconName: "Utensils",
    },
    {
      amount: 11000,
      label: "Teertha Samrakshan",
      outcome: "Sacred Grove Nurturing & Archival",
      description: "Funds the planting, soil conditioning, and fence protection of 10 sacred native trees (Banyan, Peepal, Bilva) and digital manuscript archiving.",
      iconName: "Trees",
    },
  ],

  donorBenefits: [
    {
      id: "official-receipt",
      title: "Digital Receipt of Gratitude",
      description: "Official acknowledgement receipt sent via email with transaction reference and thank-you letter.",
      enabled: true,
    },
    {
      id: "tax-exemption",
      title: "80G Tax Exemption Certificate",
      description: "Section 80G tax deduction certificate for Indian tax residents (rendered once official certificate is active).",
      enabled: false, // Hidden until 80G flag is true
    },
    {
      id: "progress-reports",
      title: "Quarterly Seva Updates",
      description: "Photographic updates and field reports detailing temple restoration progress, goshala wellbeing, and community initiatives.",
      enabled: true,
    },
    {
      id: "sankalpa-prasad",
      title: "Dharmic Sankalpa & Blessing",
      description: "Your family's name included in auspicious sankalpa prayers conducted during temple restoration ceremonies.",
      enabled: true,
    },
  ],

  commitments: [
    {
      title: "Official Channels Only",
      desc: "All contributions go strictly into the foundation's registered bank account and official UPI.",
      icon: "ShieldCheck",
    },
    {
      title: "100% Non-Profit Seva",
      desc: "Every rupee is dedicated entirely toward heritage conservation, dharmic learning, and compassionate community seva.",
      icon: "Sparkles",
    },
    {
      title: "Donor Privacy Honoured",
      desc: "We never sell, rent, or share donor contact details with third-party solicitors or commercial agencies.",
      icon: "Lock",
    },
    {
      title: "Transparent Reporting",
      desc: "Regular photographic and financial summaries shared with patrons and community well-wishers.",
      icon: "FileCheck",
    },
  ],
};
