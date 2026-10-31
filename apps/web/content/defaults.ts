/**
 * Kushbhawanpur Sanatan Dharma & Heritage Foundation
 * Static Content Defaults & Safety Fallback
 * 
 * Used whenever the CMS API is unreachable, or during initial SSR / cold starts.
 * Guarantees zero downtime and zero visual regression.
 */

export interface NavItemDef {
  id: string;
  labelEn: string;
  labelHi: string;
  target: string;
  sortOrder: number;
  isVisible: boolean;
  isCta?: boolean;
}

export interface HeroSlideDef {
  id: string;
  badgeEn: string;
  badgeHi: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  ctaLabelEn: string;
  ctaLabelHi: string;
  ctaTarget: string;
  cta2LabelEn: string;
  cta2LabelHi: string;
  cta2Target: string;
  bgImageUrl: string;
}

export interface TrustItemDef {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  iconName: string;
}

export interface ValuePillarDef {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  iconName: string;
}

export interface FocusAreaDef {
  id: string;
  slug: string;
  badgeEn: string;
  badgeHi: string;
  titleEn: string;
  titleHi: string;
  shortDescEn: string;
  shortDescHi: string;
  fullDescEn: string;
  fullDescHi: string;
  imageUrl: string;
  suggestedAmount: number;
  linkedSevaId: string;
}

export interface StoryChapterDef {
  id: string;
  chapterNumber: number;
  numberDevanagari: string;
  numberLatin: string;
  symbolName: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  paragraphsEn: string[];
  verse?: { text: string; source: string };
  chips: string[];
  imageUrl: string;
  mobileDetailCrop: string;
  hotspot: { x: number; y: number; radius: number };
  sevaLink?: { label: string; href: string };
}

export interface ImpactItemDef {
  id: string;
  amount: number;
  labelEn: string;
  labelHi: string;
  outcomeEn: string;
  outcomeHi: string;
  descEn: string;
  descHi: string;
  iconName: string;
  linkedSevaId?: string;
}

export interface DonorBenefitDef {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  iconName: string;
}

export interface GalleryItemDef {
  id: string;
  imageUrl: string;
  captionEn: string;
  captionHi: string;
  category: string;
}

export interface InvolveCardDef {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  actionLabelEn: string;
  actionLabelHi: string;
  actionTarget: string;
  iconName: string;
  isFeatured?: boolean;
}

export interface FaqItemDef {
  id: string;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  category: string;
}

export interface SiteSettingsDef {
  siteNameEn: string;
  siteNameHi: string;
  taglineEn: string;
  taglineHi: string;
  logoHeaderUrl: string;
  logoFooterUrl: string;
  logoLightUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  email: string;
  donationEmail: string;
  phone: string;
  whatsappNumber: string;
  mapEmbedUrl: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  socials: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  copyrightLineEn: string;
  copyrightLineHi: string;
}

export const defaultSiteSettings: SiteSettingsDef = {
  siteNameEn: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
  siteNameHi: "कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन",
  taglineEn: "Preserving Sacred Heritage · Serving Dharma · Empowering Seva",
  taglineHi: "धर्मो रक्षति रक्षितः · धरोहर संरक्षण · निःस्वार्थ सेवा",
  logoHeaderUrl: "https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/brand/logo-original.png",
  logoFooterUrl: "https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/brand/logo-original.png",
  logoLightUrl: "https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/brand/logo-original.png",
  faviconUrl: "/favicon.ico",
  ogImageUrl: "/brand/og-image.jpg",
  email: "contact@kushbhawanpur.org",
  donationEmail: "donations@kushbhawanpur.org",
  phone: "+91 94150 00000",
  whatsappNumber: "+91 94150 00000",
  mapEmbedUrl: "",
  address: {
    line1: "Kushbhawanpur (Sultanpur)",
    city: "Sultanpur",
    state: "Uttar Pradesh",
    pincode: "228001",
    country: "India",
  },
  socials: {
    twitter: "https://twitter.com/kushbhawanpur",
    facebook: "https://facebook.com/kushbhawanpur",
    instagram: "https://instagram.com/kushbhawanpur",
    youtube: "https://youtube.com/@kushbhawanpur",
  },
  copyrightLineEn: "© 2026 Kushbhawanpur Sanatan Dharma & Heritage Foundation. All rights reserved.",
  copyrightLineHi: "© २०२६ कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन। सर्वाधिकार सुरक्षित।",
};

export const defaultNavItems: NavItemDef[] = [
  { id: "nav-about", labelEn: "About", labelHi: "परिचय", target: "#about", sortOrder: 1, isVisible: true },
  { id: "nav-story", labelEn: "Our Story", labelHi: "हमारी कथा", target: "#story", sortOrder: 2, isVisible: true },
  { id: "nav-work", labelEn: "Seva Areas", labelHi: "सेवा क्षेत्र", target: "#work", sortOrder: 3, isVisible: true },
  { id: "nav-videos", labelEn: "Videos", labelHi: "वीडियो", target: "#videos", sortOrder: 4, isVisible: true },
  { id: "nav-impact", labelEn: "Impact", labelHi: "प्रभाव", target: "#impact", sortOrder: 5, isVisible: true },
  { id: "nav-gallery", labelEn: "Gallery", labelHi: "गैलरी", target: "#gallery", sortOrder: 6, isVisible: true },
  { id: "nav-faq", labelEn: "FAQ", labelHi: "प्रश्नोत्तरी", target: "#faq", sortOrder: 7, isVisible: true },
  { id: "nav-contact", labelEn: "Contact", labelHi: "संपर्क", target: "#contact", sortOrder: 8, isVisible: true },
  { id: "nav-donate", labelEn: "Contribute", labelHi: "दान करें", target: "#donate", sortOrder: 9, isVisible: true, isCta: true },
];

export const defaultHeroSlides: HeroSlideDef[] = [
  {
    id: "hero-1",
    badgeEn: "Sacred Heritage · Eternal Dharma",
    badgeHi: "पवित्र धरोहर · सनातन धर्म",
    titleEn: "Awakening the Sacred Spirit of Kushbhawanpur",
    titleHi: "कुशभवनपुर की पावन चेतना और धरोहर का पुनर्जागरण",
    subtitleEn: "Dedicated to the restoration of ancient temples, cow welfare, Sanskrit education, and the preservation of sacred Sanatan traditions.",
    subtitleHi: "प्राचीन मंदिरों के जीर्णोद्धार, गोसेवा, वैदिक शिक्षा और सनातन संस्कृति के संवर्धन को समर्पित एक निष्काम संकल्प।",
    ctaLabelEn: "Offer Your Seva",
    ctaLabelHi: "सेवा में योगदान दें",
    ctaTarget: "#donate",
    cta2LabelEn: "Explore Our Journey",
    cta2LabelHi: "हमारी यात्रा देखें",
    cta2Target: "#story",
    bgImageUrl: "/images/hero-bg.webp",
  },
];

export const defaultTrustItems: TrustItemDef[] = [
  { id: "trust-1", titleEn: "100% Direct Seva", titleHi: "१००% प्रत्यक्ष सेवा", subtitleEn: "Every rupee goes to the cause", subtitleHi: "हर रुपया सीधे सेवा कार्य में", iconName: "ShieldCheck" },
  { id: "trust-2", titleEn: "Instant Receipt", titleHi: "त्वरित रसीद", subtitleEn: "Official digital receipt with QR", subtitleHi: "सत्यापित रसीद व विवरण", iconName: "FileCheck" },
  { id: "trust-3", titleEn: "Verified Bank & UPI", titleHi: "सत्यापित खाता व यूपीआई", subtitleEn: "Official Foundation Accounts", subtitleHi: "अधिकृत संस्थागत खाते", iconName: "Building2" },
  { id: "trust-4", titleEn: "Transparent Impact", titleHi: "पारदर्शी रिपोर्टिंग", subtitleEn: "Regular photographic field updates", subtitleHi: "नियमित कार्य प्रगति विवरण", iconName: "Eye" },
];

export const defaultValuePillars: ValuePillarDef[] = [
  { id: "pillar-1", titleEn: "Dharma Raksha", titleHi: "धर्म रक्षा", descEn: "Guarding our sacred shrines, rituals, and philosophical wisdom for generations to come.", descHi: "तीर्थों, संस्कारों और सनातन संस्कृति के संरक्षण हेतु अनवरत प्रयास।", iconName: "Flame" },
  { id: "pillar-2", titleEn: "Nishkama Seva", titleHi: "निःस्वार्थ सेवा", descEn: "Selfless service to society, pilgrims, animals, and the needy with purity of intention.", descHi: "प्राणी मात्र की निःस्वार्थ सेवा और समाज के वंचित वर्गों का सहयोग।", iconName: "HeartHandshake" },
  { id: "pillar-3", titleEn: "Parampara & Vidya", titleHi: "परंपरा एवं विद्या", descEn: "Revitalising Vedic learning, Sanskrit recitation, and historical consciousness.", descHi: "वैदिक शिक्षा, संस्कृत अध्ययन और ऐतिहासिक गौरव की पुनः प्रतिष्ठा।", iconName: "BookOpen" },
];

export const defaultFocusAreas: FocusAreaDef[] = [
  {
    id: "focus-1",
    slug: "temple-preservation",
    badgeEn: "Shrine Revival",
    badgeHi: "मंदिर जीर्णोद्धार",
    titleEn: "Ancient Temple Restoration",
    titleHi: "प्राचीन मंदिर संरक्षण एवं जीर्णोद्धार",
    shortDescEn: "Architectural conservation and regular pujas in neglected local shrines across the sacred Kushbhawanpur kshetra.",
    shortDescHi: "कुशभवनपुर क्षेत्र के उपेक्षित व ऐतिहासिक मंदिरों का स्थापत्य संरक्षण एवं नित्य पूजा की व्यवस्था।",
    fullDescEn: "Many ancient shrines of historical reverence require delicate stone conservation, structural reinforcement, and daily devotional continuity. We work alongside local artisans and communities to revive their sanctity.",
    fullDescHi: "कुशभवनपुर की पावन भूमि पर स्थित अनेक प्राचीन देवालयों को संरक्षण की आवश्यकता है। हम स्थानीय शिल्पियों व संतों के मार्गदर्शन में इनका जीर्णोद्धार करते हैं।",
    imageUrl: "/images/focus/temple.webp",
    suggestedAmount: 2100,
    linkedSevaId: "temple-preservation",
  },
  {
    id: "focus-2",
    slug: "vedic-education",
    badgeEn: "Vedic Heritage",
    badgeHi: "वेद विद्या",
    titleEn: "Gurukula & Sanskrit Studies",
    titleHi: "गुरुकुल एवं संस्कृत विद्या संवर्धन",
    shortDescEn: "Supporting traditional Vedic students with residential facilities, texts, and authentic teacher stipends.",
    shortDescHi: "गुरुकुल के विद्यार्थियों हेतु आवास, ग्रंथ, अन्नक्षेत्र एवं आचार्यों को सम्मानजनक सहयोग।",
    fullDescEn: "Preserving the oral transmission of Vedic mantras and classical Sanskrit literature through direct scholarships and sustenance for residential Gurukulas.",
    fullDescHi: "वैदिक मंत्रोच्चार और संस्कृत व्याकरण की प्राचीन परंपरा को जीवंत रखने हेतु विद्यार्थियों को छात्रवृत्ति एवं सहयोग।",
    imageUrl: "/images/focus/vedic.webp",
    suggestedAmount: 1100,
    linkedSevaId: "vedic-education",
  },
  {
    id: "focus-3",
    slug: "gaushala-seva",
    badgeEn: "Jiva Daya",
    badgeHi: "जीव दया",
    titleEn: "Desi Gaushala & Cow Welfare",
    titleHi: "देशी गोवंश संरक्षण एवं संवर्धन",
    shortDescEn: "Providing green fodder, medical shelter, and lifelong dignified care for indigenous Desi cows and abandoned cattle.",
    shortDescHi: "देशी गोवंश के लिए पौष्टिक आहार, औषधीय उपचार और सुरक्षित आश्रय की समुचित व्यवस्था।",
    fullDescEn: "Our gaushala provides nutritious fodder, round-the-clock veterinary attention, and respectful shelter for abandoned, aged, and indigenous cows.",
    fullDescHi: "उपेक्षित एवं वृद्ध गोवंश के लिए समर्पित सेवा, पौष्टिक चारा और चिकित्सा सहायता।",
    imageUrl: "/images/focus/cow.webp",
    suggestedAmount: 501,
    linkedSevaId: "gaushala-seva",
  },
  {
    id: "focus-4",
    slug: "sacred-environment",
    badgeEn: "Prakriti Seva",
    badgeHi: "प्रकृति सेवा",
    titleEn: "Sacred Groves & River Ghats",
    titleHi: "पवित्र उपवन एवं सरयू-गोमती तट संरक्षण",
    shortDescEn: "Planting native sacred trees (Peepal, Banyan, Bel) and maintaining clean, respectful river ghat environments.",
    shortDescHi: "पंचवटी, बेल व पीपल वृक्षारोपण तथा तीर्थ घाटों की स्वच्छता व सौंदर्यीकरण।",
    fullDescEn: "Restoring the sacred ecological harmony of riverbanks and temple parikrama corridors through native indigenous flora.",
    fullDescHi: "नदी तटों और तीर्थ क्षेत्रों में पारंपरिक वृक्षारोपण एवं तीर्थयात्रियों हेतु स्वच्छ पर्यावरण।",
    imageUrl: "/images/focus/environment.webp",
    suggestedAmount: 1100,
    linkedSevaId: "sacred-environment",
  },
  {
    id: "focus-5",
    slug: "pilgrim-annakshetra",
    badgeEn: "Anna Daan",
    badgeHi: "अन्न दान",
    titleEn: "Pilgrim & Sadhu Annakshetra",
    titleHi: "साधु-संत एवं तीर्थयात्री अन्नक्षेत्र",
    shortDescEn: "Serving fresh, wholesome, sanctified meals (Prasadam) to visiting devotees, ascetics, and underprivileged pilgrims.",
    shortDescHi: "तीर्थक्षेत्र में पधारने वाले साधुओं, संतों एवं जरूरतमंद श्रद्धालुओं हेतु शुद्ध सात्त्विक महाप्रसाद।",
    fullDescEn: "Daily and festival-time distribution of hygienic, nutritious prasadam prepared with devotion in clean community kitchens.",
    fullDescHi: "पवित्र पर्वों एवं प्रतिदिन आने वाले भक्तों के लिए निरंतर महाप्रसाद वितरण सेवा।",
    imageUrl: "/images/focus/annakshetra.webp",
    suggestedAmount: 5100,
    linkedSevaId: "pilgrim-annakshetra",
  },
  {
    id: "focus-6",
    slug: "heritage-documentation",
    badgeEn: "Itihasa",
    badgeHi: "इतिहास",
    titleEn: "Heritage Archives & Publications",
    titleHi: "ऐतिहासिक अभिलेख एवं धरोहर शोध",
    shortDescEn: "Documenting local oral histories, inscriptions, and sacred geography of historical Kushbhawanpur.",
    shortDescHi: "कुशभवनपुर के प्राचीन इतिहास, शिलालेखों और स्थानीय परंपराओं का प्रामाणिक दस्तावेजीकरण।",
    fullDescEn: "Scholarly research, archiving of rare manuscripts, and public monographs celebrating the unbroken legacy of our cultural capital.",
    fullDescHi: "दुर्लभ पांडुलिपियों का संरक्षण, शोध ग्रंथों का प्रकाशन और युवा पीढ़ी को धरोहर से जोड़ना।",
    imageUrl: "/images/focus/heritage.webp",
    suggestedAmount: 2100,
    linkedSevaId: "heritage-documentation",
  },
];

export const defaultStoryChapters: StoryChapterDef[] = [
  {
    id: "om",
    chapterNumber: 1,
    numberDevanagari: "१",
    numberLatin: "1",
    symbolName: "Om",
    titleEn: "Om — The Primordial Sound",
    titleHi: "ॐ — सृष्टि का आदिनाद",
    subtitleEn: "Where every sacred prayer begins.",
    subtitleHi: "जहाँ से प्रत्येक प्रार्थना का आरंभ होता है।",
    paragraphsEn: [
      "Before a temple is raised or a word is written, there is sound. In Sanatan tradition that sound is Om, also called Pranava — the syllable said to hold all of existence. Its three sounds, A, U and M, represent the waking, dreaming and deep-sleep states, and the silence that follows as the transcendent fourth state.",
      "Our emblem places Om at the crown, with rays of light streaming from it. It is why we serve: so that this divine light stays alive in the temples, homes and hearts of our community."
    ],
    verse: {
      text: "ओमित्येतदक्षरमिदं सर्वम्",
      source: "Māṇḍūkya Upaniṣad, 1"
    },
    chips: ["Pranava", "A · U · M", "Eternal Vibration"],
    imageUrl: "/images/story/om-chapter.webp",
    mobileDetailCrop: "/images/story/story-om.webp",
    hotspot: { x: 50, y: 34, radius: 12 },
    sevaLink: { label: "Support Vedic Chanting", href: "#donate" },
  },
  {
    id: "temple",
    chapterNumber: 2,
    numberDevanagari: "२",
    numberLatin: "2",
    symbolName: "Shikhara",
    titleEn: "The Temple Shikhara — Axis of the Sacred",
    titleHi: "शिखर — दिव्यता का आरोहण",
    subtitleEn: "Stone crowned in devotion.",
    subtitleHi: "भक्ति और स्थापत्य का संगम।",
    paragraphsEn: [
      "The temple shikhara rises as Mount Meru in miniature, an axis between earth and the heavens. It guides the wandering eye upward, from worldly noise to celestial serenity.",
      "In Kushbhawanpur, centuries of devotion stand etched in quiet stones. Our commitment is to ensure these sacred spires remain upright, protected, and resounding with the daily sound of temple bells."
    ],
    verse: {
      text: "प्रासादो मेरुवत् ख्यातः",
      source: "Vāstu Shāstra"
    },
    chips: ["Architecture", "Sacred Spire", "Temple Bells"],
    imageUrl: "/images/story/shikhara-chapter.webp",
    mobileDetailCrop: "/images/story/story-shikhara.webp",
    hotspot: { x: 50, y: 52, radius: 14 },
    sevaLink: { label: "Support Temple Conservation", href: "#donate" },
  },
  {
    id: "lotus",
    chapterNumber: 3,
    numberDevanagari: "३",
    numberLatin: "3",
    symbolName: "Kamala",
    titleEn: "The Sacred Lotus — Unblemished Purity",
    titleHi: "कमल — अनासक्त शुचिता",
    subtitleEn: "Rooted in earth, blossoming towards the sun.",
    subtitleHi: "जल में रहकर भी जल से निर्लिप्त।",
    paragraphsEn: [
      "The lotus grows through muddy depths yet its petals never carry a drop of dirt. It is the eternal Sanatan emblem of detached action and spiritual purity.",
      "At the foundation, every seva is offered with this lotus-like spirit: transparent, selfless, and dedicated wholly to the Divine."
    ],
    verse: {
      text: "पद्मपत्रमिवाम्भसा",
      source: "Bhagavad Gītā 5.10"
    },
    chips: ["Selfless Service", "Purity", "Nishkama Karma"],
    imageUrl: "/images/story/lotus-chapter.webp",
    mobileDetailCrop: "/images/story/story-lotus.webp",
    hotspot: { x: 50, y: 70, radius: 12 },
    sevaLink: { label: "Join as a Volunteer", href: "#contact" },
  },
  {
    id: "water",
    chapterNumber: 4,
    numberDevanagari: "४",
    numberLatin: "4",
    symbolName: "Tirtha",
    titleEn: "Sacred Waters — The Flow of Life",
    titleHi: "तीर्थ — जीवनदायिनी धारा",
    subtitleEn: "Nourishing souls and civilisations.",
    subtitleHi: "पवित्र नदियों का पावन प्रवाह।",
    paragraphsEn: [
      "Rivers are not mere waterways in Bharat; they are mothers and living tirthas. Kushbhawanpur's soil has been purified by sacred currents since time immemorial.",
      "We strive to clean and beautify our river ghats, preserving them as sanctuaries for meditation, evening aartis, and mindful pilgrimage."
    ],
    chips: ["River Ghats", "Clean Pilgrimage", "Aarti Tradition"],
    imageUrl: "/images/story/river-chapter.webp",
    mobileDetailCrop: "/images/story/story-river.webp",
    hotspot: { x: 50, y: 84, radius: 12 },
    sevaLink: { label: "Support Ghat Cleanliness", href: "#donate" },
  },
  {
    id: "sankalpa",
    chapterNumber: 5,
    numberDevanagari: "५",
    numberLatin: "5",
    symbolName: "Sankalpa",
    titleEn: "The Unbroken Sankalpa — Our Sacred Oath",
    titleHi: "संकल्प — एक अटूट प्रतिज्ञा",
    subtitleEn: "Five symbols united in one living mission.",
    subtitleHi: "धरोहर और सेवा का अमर संकल्प।",
    paragraphsEn: [
      "When sound, sacred space, pure intention, and cleansing water unite, they forge an unbreakable resolve — our Sankalpa.",
      "This foundation is not just an organisation; it is a collective prayer of thousands of dharmic souls determined to preserve their ancestral roots."
    ],
    chips: ["Living Heritage", "Unity", "Eternal Dharma"],
    imageUrl: "/images/story/sankalpa-chapter.webp",
    mobileDetailCrop: "/images/story/story-sankalpa.webp",
    hotspot: { x: 50, y: 50, radius: 30 },
    sevaLink: { label: "Contribute to Foundation", href: "#donate" },
  },
];

export const defaultImpactItems: ImpactItemDef[] = [
  { id: "impact-501", amount: 501, labelEn: "Prasadam & Gau Grass", labelHi: "गो ग्रास एवं प्रसाद", outcomeEn: "Nutritious green fodder for cows for one day.", outcomeHi: "एक दिन के लिए देशी गोवंश को हरा चारा।", descEn: "Provides fresh, clean green fodder and jaggery to indigenous cows in the gaushala.", descHi: "गोशाला में देशी गायों को पौष्टिक चारा और गुड़ की व्यवस्था।", iconName: "Heart" },
  { id: "impact-1100", amount: 1100, labelEn: "Gurukula Sustenance", labelHi: "विद्यार्थी सहयोग", outcomeEn: "Vedic learning texts & essentials for a student.", outcomeHi: "वेदपाठी विद्यार्थी हेतु ग्रंथ एवं शिक्षण सामग्री।", descEn: "Provides study materials and daily food essentials for young residential Gurukula batuks.", descHi: "गुरुकुल के बटुकों के लिए शिक्षण सामग्री व आहार प्रबंध।", iconName: "BookOpen" },
  { id: "impact-2100", amount: 2100, labelEn: "Temple Maintenance", labelHi: "मंदिर नित्य सेवा", outcomeEn: "Daily puja supplies & lamp oil for 15 days.", outcomeHi: "१५ दिनों की नित्य आरती, दीप तेल एवं पूजन सामग्री।", descEn: "Ensures the uninterrupted lighting of the akhand diya and daily flower offerings at a heritage shrine.", descHi: "देवालय में अखंड दीप और नित्य सेवा की निरंतरता।", iconName: "Flame" },
  { id: "impact-5100", amount: 5100, labelEn: "Stone Restoration", labelHi: "शिला संरक्षण", outcomeEn: "Restores weathered stone plinths & carved pillars.", outcomeHi: "प्राचीन स्तंभों व देवालय चबूतरों का पुनरुद्धार।", descEn: "Supports traditional stone masons performing careful lime-mortar stabilization on ancient shrines.", descHi: "पारंपरिक शिल्पकारों द्वारा मंदिरों के पत्थरों का वैज्ञानिक संरक्षण।", iconName: "Shield" },
  { id: "impact-11000", amount: 11000, labelEn: "Annakshetra Patron", labelHi: "अन्नक्षेत्र सेवा", outcomeEn: "Sponsors complete meals for 200+ pilgrims on festivals.", outcomeHi: "पर्वों पर २००+ श्रद्धालुओं हेतु सम्पूर्ण महाप्रसाद सेवा।", descEn: "Covers wholesome grains, pure ghee, and vegetables for community feast during auspicious tithis.", descHi: "शुभ तिथियों पर विशाल भंडारे और साधु-भोजन का आयोजन।", iconName: "Utensils" },
];

export const defaultDonorBenefits: DonorBenefitDef[] = [
  { id: "benefit-1", titleEn: "Official 80G Tax Exemption", titleHi: "८०जी आयकर छूट", descEn: "Eligible donations receive instant 80G tax benefits under Indian IT Act regulations.", descHi: "भारतीय आयकर अधिनियम के अंतर्गत कर छूट का लाभ प्राप्त करें।", iconName: "Receipt" },
  { id: "benefit-2", titleEn: "Instant Verified Digital Receipt", titleHi: "त्वरित डिजिटल रसीद", descEn: "Download a signed PDF receipt with tamper-proof verification QR code immediately.", descHi: "क्यूआर कोड से युक्त आधिकारिक डिजिटल रसीद तुरंत डाउनलोड करें।", iconName: "FileCheck" },
  { id: "benefit-3", titleEn: "Sankalpa in Daily Pujas", titleHi: "नित्य पूजा में नाम संकल्प", descEn: "Your family's name and gotra are offered in daily prayers at preserved shrines.", descHi: "संरक्षित देवालयों में आपके नाम व गोत्र से नित्य मंगल संकल्प।", iconName: "Sparkles" },
  { id: "benefit-4", titleEn: "Quarterly Transparent Reports", titleHi: "त्रैमासिक कार्य प्रगति रिपोर्ट", descEn: "Receive detailed photographic and financial updates showing where every rupee went.", descHi: "कार्य की वास्तविक प्रगति और व्यय का पारदर्शी सचित्र विवरण।", iconName: "BarChart3" },
];

export const defaultGalleryItems: GalleryItemDef[] = [
  { id: "gal-1", imageUrl: "/images/gallery/temple-morning.webp", captionEn: "Morning Aarti at restored historic shrine", captionHi: "प्रातःकालीन आरती का दिव्य दृश्य", category: "Temples" },
  { id: "gal-2", imageUrl: "/images/gallery/gau-seva.webp", captionEn: "Desi cows feeding at the heritage gaushala", captionHi: "गोशाला में देशी गोवंश की सेवा", category: "Gaushala" },
  { id: "gal-3", imageUrl: "/images/gallery/vedic-students.webp", captionEn: "Vedic students reciting sacred Suktas", captionHi: "वेदपाठी बटुकों द्वारा सस्वर वेदमंत्र पाठ", category: "Gurukula" },
  { id: "gal-4", imageUrl: "/images/gallery/ghat-evening.webp", captionEn: "Evening lamp offering at the sacred river ghat", captionHi: "संध्या काल में पवित्र तट पर दीपदान", category: "Ghats" },
  { id: "gal-5", imageUrl: "/images/gallery/stone-work.webp", captionEn: "Heritage stone carver restoring intricate motifs", captionHi: "प्राचीन नक्काशी का संरक्षण करते शिल्पी", category: "Restoration" },
  { id: "gal-6", imageUrl: "/images/gallery/annakshetra-serve.webp", captionEn: "Pilgrims receiving sanctified Prasadam", captionHi: "श्रद्धालुओं को महाप्रसाद वितरण", category: "Annakshetra" },
];

export const defaultInvolveCards: InvolveCardDef[] = [
  {
    id: "inv-1",
    titleEn: "Volunteer On Ground",
    titleHi: "क्षेत्रीय स्वयंसेवक बनें",
    descEn: "Join weekend restoration drives, ghat cleanliness walks, and festival prasadam distribution teams.",
    descHi: "मंदिर सफाई, तीर्थ घाट स्वच्छता और उत्सवों में सेवा कार्य हेतु हमसे जुड़ें।",
    actionLabelEn: "Register as Volunteer",
    actionLabelHi: "स्वयंसेवक पंजीकरण",
    actionTarget: "#contact",
    iconName: "Users",
    isFeatured: true,
  },
  {
    id: "inv-2",
    titleEn: "Spread Sacred Heritage",
    titleHi: "धरोहर का प्रसार करें",
    descEn: "Share our documentary videos, historical monographs, and seva initiatives with your community.",
    descHi: "हमारी ऐतिहासिक शोध सामग्री और वीडियो को अपने परिजनों व मित्रों के साथ साझा करें।",
    actionLabelEn: "Watch Videos",
    actionLabelHi: "वीडियो देखें",
    actionTarget: "#videos",
    iconName: "Share2",
  },
  {
    id: "inv-3",
    titleEn: "CSR & Institutional Giving",
    titleHi: "सीएसआर एवं संस्थागत सहयोग",
    descEn: "Partner with us for corporate social responsibility initiatives in heritage conservation and rural gaushalas.",
    descHi: "कॉर्पोरेट संस्थाएं धरोहर संरक्षण और गोसंरक्षण परियोजनाओं में सहभागिता करें।",
    actionLabelEn: "Contact CSR Desk",
    actionLabelHi: "सीएसआर संपर्क",
    actionTarget: "#contact",
    iconName: "Building",
  },
];

export const defaultFaqs: FaqItemDef[] = [
  {
    id: "faq-1",
    category: "Donations & Tax",
    questionEn: "How are my donations utilised by the foundation?",
    questionHi: "मेरे द्वारा दिए गए दान का उपयोग कैसे किया जाता है?",
    answerEn: "Every rupee donated is allocated directly to the designated cause (Temple Restoration, Gau Seva, Vedic Gurukula, or Annakshetra). We maintain strict zero-wastage financial accountability with regular photographic progress reports and transparent audits.",
    answerHi: "आपके द्वारा दी गई प्रत्येक राशि सीधे उसी सेवा कार्य में लगाई जाती है जिसे आपने चुना है। हम नियमित सचित्र रिपोर्ट और पारदर्शी लेखा-जोखा उपलब्ध कराते हैं।",
  },
  {
    id: "faq-2",
    category: "Receipts",
    questionEn: "When and how do I receive my donation receipt?",
    questionHi: "दान रसीद मुझे कब और कैसे प्राप्त होगी?",
    answerEn: "Upon completing your donation via UPI or Bank Transfer, you receive a verification tracking code. Once the transaction UTR is verified by our accounts team, you can instantly download your signed PDF receipt with a QR verification seal from our website.",
    answerHi: "दान पूर्ण करने के उपरांत आपको एक ट्रैकिंग कोड प्राप्त होता है। बैंक यूटीआर सत्यापन के पश्चात आप सीधे वेबसाइट से डिजिटल हस्ताक्षर युक्त पीडीएफ रसीद डाउनलोड कर सकते हैं।",
  },
  {
    id: "faq-3",
    category: "Donations & Tax",
    questionEn: "Can I donate via Direct Bank Transfer (NEFT/RTGS)?",
    questionHi: "क्या मैं सीधे बैंक ट्रांसफर (NEFT/RTGS) से दान कर सकता हूँ?",
    answerEn: "Yes. Our official Foundation bank account details (Account Name, Account Number, IFSC code, and Branch) are listed in the donation portal. Simply make the transfer and enter your UTR number to claim your receipt.",
    answerHi: "हाँ। संस्था के अधिकृत बैंक खाते का विवरण दान अनुभाग में उपलब्ध है। ट्रांसफर के बाद यूटीआर दर्ज कर अपनी रसीद प्राप्त करें।",
  },
  {
    id: "faq-4",
    category: "Visiting & Volunteering",
    questionEn: "Can I visit the restoration sites or gaushala in person?",
    questionHi: "क्या मैं स्वयं आकर जीर्णोद्धार स्थलों अथवा गोशाला का दर्शन कर सकता हूँ?",
    answerEn: "You are always welcome! Please reach out to us through our contact form or phone number prior to your visit so our team can warmly receive you and guide you through the historic sites.",
    answerHi: "आपका सदैव स्वागत है! कृपया अपनी यात्रा से पूर्व संपर्क सूत्र पर सूचना दें ताकि हमारी टीम आपका मार्गदर्शन कर सके।",
  },
];

export const defaultPledge = {
  shlokaSanskrit: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥",
  transliteration: "Sarve bhavantu sukhinaḥ, sarve santu nirāmayāḥ | Sarve bhadrāṇi paśyantu, mā kaścid-duḥkha-bhāg-bhavet ||",
  meaningEn: "May all beings everywhere be happy and free from illness. May all see what is auspicious and no one suffer.",
  meaningHi: "सब सुखी हों, सब रोगमुक्त रहें, सब मंगलमय घटनाओं के साक्षी बनें और किसी को भी दुःख का भागी न बनना पड़े।",
  textEn: "We invite every devotee of Sanatan Dharma to stand with us as guardians of this eternal land.",
  textHi: "आइए, हम सब मिलकर अपनी ऐतिहासिक व आध्यात्मिक जड़ों को सुदृढ़ बनाएं।",
  source: "Brihadaranyaka Upanishad",
};
