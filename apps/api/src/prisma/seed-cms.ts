import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏛️ Starting CMS & Dynamic Content Seeding...');

  // 1. SiteSettings Singleton
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteNameEn: 'Kushbhawanpur Sanatan Dharma & Heritage Foundation',
      siteNameHi: 'कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन',
      taglineEn: 'Preserving Sacred Heritage · Serving Dharma · Empowering Seva',
      taglineHi: 'धर्मो रक्षति रक्षितः · धरोहर संरक्षण · निःस्वार्थ सेवा',
      logoHeaderUrl: 'https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/brand/logo-original.png',
      logoFooterUrl: 'https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/brand/logo-original.png',
      logoLightUrl: 'https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/brand/logo-original.png',
      faviconUrl: '/favicon.ico',
      ogImageUrl: '/brand/og-image.jpg',
      email: 'contact@kushbhawanpur.org',
      donationEmail: 'donations@kushbhawanpur.org',
      phone: '+91 94150 00000',
      whatsappNumber: '+91 94150 00000',
      mapEmbedUrl: '',
      addressJson: {
        line1: 'Kushbhawanpur (Sultanpur)',
        city: 'Sultanpur',
        state: 'Uttar Pradesh',
        pincode: '228001',
        country: 'India',
      },
      socialLinks: {
        twitter: 'https://twitter.com/kushbhawanpur',
        facebook: 'https://facebook.com/kushbhawanpur',
        instagram: 'https://instagram.com/kushbhawanpur',
        youtube: 'https://youtube.com/@kushbhawanpur',
      },
      defaultSeo: {
        titleTemplate: '%s | Kushbhawanpur Sanatan Dharma & Heritage Foundation',
        description:
          'Dedicated to ancient temple revival, Vedic studies, cow protection, and heritage documentation in historic Kushbhawanpur (Sultanpur, UP).',
        keywords: [
          'Kushbhawanpur',
          'Sultanpur',
          'Sanatan Dharma',
          'Temple Restoration',
          'Gaushala',
          'Gurukula',
          'Heritage',
          'Donation 80G',
        ],
      },
      announcementEnabled: false,
      footerTextEn:
        'Kushbhawanpur Sanatan Dharma & Heritage Foundation is registered under Indian Trust laws. Dedicated to selflessly safeguarding our sacred civilisational roots.',
      footerTextHi:
        'कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन भारतीय न्यास अधिनियम के अंतर्गत पंजीकृत संस्था है। सनातन संस्कृति और धरोहर की रक्षा हेतु समर्पित।',
      copyrightLineEn: '© 2026 Kushbhawanpur Sanatan Dharma & Heritage Foundation. All rights reserved.',
      copyrightLineHi: '© २०२६ कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन। सर्वाधिकार सुरक्षित।',
      liveStatsEnabled: false,
      statsHistoricalDonorsOffset: 0,
      statsHistoricalAmountOffsetPaise: BigInt(0),
    },
  });
  console.log('✅ SiteSettings ensured:', siteSettings.id);

  // 2. Navigation Items
  const navItems = [
    { labelEn: 'About', labelHi: 'परिचय', target: '#about', sortOrder: 1, isVisible: true, isCta: false },
    { labelEn: 'Our Story', labelHi: 'हमारी कथा', target: '#story', sortOrder: 2, isVisible: true, isCta: false },
    { labelEn: 'Seva Areas', labelHi: 'सेवा क्षेत्र', target: '#work', sortOrder: 3, isVisible: true, isCta: false },
    { labelEn: 'Videos', labelHi: 'वीडियो', target: '#videos', sortOrder: 4, isVisible: true, isCta: false },
    { labelEn: 'Impact', labelHi: 'प्रभाव', target: '#impact', sortOrder: 5, isVisible: true, isCta: false },
    { labelEn: 'Gallery', labelHi: 'गैलरी', target: '#gallery', sortOrder: 6, isVisible: true, isCta: false },
    { labelEn: 'FAQ', labelHi: 'प्रश्नोत्तरी', target: '#faq', sortOrder: 7, isVisible: true, isCta: false },
    { labelEn: 'Contact', labelHi: 'संपर्क', target: '#contact', sortOrder: 8, isVisible: true, isCta: false },
    { labelEn: 'Contribute', labelHi: 'दान करें', target: '#donate', sortOrder: 9, isVisible: true, isCta: true },
  ];

  for (const item of navItems) {
    const existing = await prisma.navItem.findFirst({ where: { target: item.target } });
    if (!existing) {
      await prisma.navItem.create({ data: item });
    }
  }
  console.log('✅ Navigation items ensured.');

  // 3. PageSections (Draft and Published Content for all 16 public sections)
  const sections = [
    {
      key: 'hero',
      sortOrder: 1,
      variant: 'default',
      content: {
        badgeEn: 'Sacred Heritage · Eternal Dharma',
        badgeHi: 'पवित्र धरोहर · सनातन धर्म',
        titleEn: 'Awakening the Sacred Spirit of Kushbhawanpur',
        titleHi: 'कुशभवनपुर की पावन चेतना और धरोहर का पुनर्जागरण',
        subtitleEn:
          'Dedicated to the restoration of ancient temples, cow welfare, Sanskrit education, and the preservation of sacred Sanatan traditions.',
        subtitleHi:
          'प्राचीन मंदिरों के जीर्णोद्धार, गोसेवा, वैदिक शिक्षा और सनातन संस्कृति के संवर्धन को समर्पित एक निष्काम संकल्प।',
        ctaLabelEn: 'Offer Your Seva',
        ctaLabelHi: 'सेवा में योगदान दें',
        ctaTarget: '#donate',
        cta2LabelEn: 'Explore Our Journey',
        cta2LabelHi: 'हमारी यात्रा देखें',
        cta2Target: '#story',
        bgImageUrl: '/images/hero-bg.webp',
      },
    },
    {
      key: 'trust',
      sortOrder: 2,
      variant: 'default',
      content: {
        eyebrowEn: 'Trust & Transparency',
        eyebrowHi: 'विश्वास एवं पारदर्शिता',
      },
    },
    {
      key: 'about',
      sortOrder: 3,
      variant: 'default',
      content: {
        eyebrowEn: 'Origin & Philosophy',
        eyebrowHi: 'मूल एवं दर्शन',
        titleEn: 'Guardians of an Unbroken Civilisational Heritage',
        titleHi: 'सनातन संस्कृति एवं अखंड धरोहर के संरक्षक',
        introEn:
          'Kushbhawanpur, named after Bhagwan Shri Ram\'s son Kusha, has resonated with mantras, sacrificial fires, and timeless bhakti for millennia. The Foundation was formed to protect this sacred landscape from the ravages of time.',
        introHi:
          'भगवान श्री राम के पुत्र कुश द्वारा स्थापित पावन कुशभवनपुर युगों से तप, त्याग और भक्ति की साधना स्थली रहा है। इस दिव्य धरा की सांस्कृतिक व आध्यात्मिक धरोहर को सहेजने हेतु हमारा यह प्रयास है।',
      },
    },
    {
      key: 'team',
      sortOrder: 4,
      variant: 'default',
      content: {
        eyebrowEn: 'Trustees & Sevadars',
        eyebrowHi: 'संस्थापक एवं न्यासी मंडल',
        titleEn: 'Leadership Dedicated to Nishkama Seva',
        titleHi: 'निःस्वार्थ सेवा को समर्पित नेतृत्व',
      },
    },
    {
      key: 'certifications',
      sortOrder: 5,
      variant: 'default',
      content: {
        eyebrowEn: 'Legal & Transparent',
        eyebrowHi: 'वैधानिक मान्यताएं',
        titleEn: 'Official Registrations & Approvals',
        titleHi: 'अधिकृत पंजीकरण एवं शासकीय प्रमाण पत्र',
      },
    },
    {
      key: 'story',
      sortOrder: 6,
      variant: 'default',
      content: {
        eyebrowEn: 'हमारी कथा · Our Story',
        eyebrowHi: 'हमारी कथा',
        titleEn: 'Five Symbols, One Sankalpa',
        titleHi: 'पाँच प्रतीक, एक अखंड संकल्प',
        introEn:
          'Every part of our emblem is a promise. Walk through the five symbols that shape what we protect, why we serve, and where we come from.',
        introHi:
          'हमारे प्रतीक चिन्ह का प्रत्येक अंग एक पावन प्रतिज्ञा है। जानिए उन पाँच प्रतीकों को जो हमारी प्रेरणा और सेवा संकल्प का आधार हैं।',
      },
    },
    {
      key: 'work',
      sortOrder: 7,
      variant: 'default',
      content: {
        eyebrowEn: 'Six Sacred Spheres',
        eyebrowHi: 'छह प्रमुख सेवा क्षेत्र',
        titleEn: 'Areas of Dedicated Seva',
        titleHi: 'धरोहर संरक्षण एवं लोक कल्याण के आयाम',
      },
    },
    {
      key: 'videos',
      sortOrder: 8,
      variant: 'default',
      content: {
        eyebrowEn: 'Living Chronicles',
        eyebrowHi: 'वीडियो दर्शन',
        titleEn: 'Glimpses of Heritage & Ground Action',
        titleHi: 'धरोहर एवं सेवा कार्यों की जीवंत झलकियां',
      },
    },
    {
      key: 'donate',
      sortOrder: 9,
      variant: 'default',
      content: {
        eyebrowEn: 'Pavitra Daan',
        eyebrowHi: 'पवित्र दान',
        titleEn: 'Offer Your Seva to Sacred Kushbhawanpur',
        titleHi: 'कुशभवनपुर की पावन सेवा में अपना योगदान दें',
        subtitleEn:
          'Direct bank transfer and UPI. 100% of your contribution reaches verified ground projects.',
        subtitleHi: 'सीधे बैंक एवं यूपीआई द्वारा दान। आपका शत-प्रतिशत योगदान सेवा कार्यों में प्रयुक्त होता है।',
      },
    },
    {
      key: 'impact',
      sortOrder: 10,
      variant: 'default',
      content: {
        eyebrowEn: 'Direct Significance',
        eyebrowHi: 'प्रत्यक्ष प्रभाव',
        titleEn: 'How Your Contribution Manifests',
        titleHi: 'आपकी सेवा का वास्तविक स्वरूप',
      },
    },
    {
      key: 'receive',
      sortOrder: 11,
      variant: 'default',
      content: {
        eyebrowEn: 'Dharmic Accountability',
        eyebrowHi: 'दान का सम्मान',
        titleEn: 'What Donors Receive',
        titleHi: 'दाताओं हेतु सुविधाएं एवं सम्मान',
      },
    },
    {
      key: 'gallery',
      sortOrder: 12,
      variant: 'default',
      content: {
        eyebrowEn: 'Moments of Heritage',
        eyebrowHi: 'धरोहर दर्शन',
        titleEn: 'Captured Moments of Reverence',
        titleHi: 'सेवा एवं भक्ति के पावन क्षण',
      },
    },
    {
      key: 'involve',
      sortOrder: 13,
      variant: 'default',
      content: {
        eyebrowEn: 'Join the Movement',
        eyebrowHi: 'सहभागिता',
        titleEn: 'Ways to Stand with Our Sacred Heritage',
        titleHi: 'सनातन संस्कृति से जुड़ने के मार्ग',
      },
    },
    {
      key: 'pledge',
      sortOrder: 14,
      variant: 'default',
      content: {
        eyebrowEn: 'Ancient Wisdom',
        eyebrowHi: 'वैदिक सूक्ति',
        titleEn: 'The Eternal Vedic Prayer',
        titleHi: 'वैदिक मंगल प्रार्थना',
      },
    },
    {
      key: 'faq',
      sortOrder: 15,
      variant: 'default',
      content: {
        eyebrowEn: 'Clarity & Process',
        eyebrowHi: 'जिज्ञासा समाधान',
        titleEn: 'Frequently Asked Questions',
        titleHi: 'अक्सर पूछे जाने वाले प्रश्न',
      },
    },
    {
      key: 'contact',
      sortOrder: 16,
      variant: 'default',
      content: {
        eyebrowEn: 'Get in Touch',
        eyebrowHi: 'संपर्क करें',
        titleEn: 'Visit Our Office or Send a Message',
        titleHi: 'कार्यालय आगमन अथवा संदेश प्रेषण',
      },
    },
  ];

  for (const sec of sections) {
    await prisma.pageSection.upsert({
      where: { key: sec.key },
      update: {},
      create: {
        key: sec.key,
        enabled: true,
        sortOrder: sec.sortOrder,
        variant: sec.variant,
        draftContent: sec.content,
        publishedContent: sec.content,
        publishedAt: new Date(),
        updatedBy: 'system-seed',
      },
    });

    // Also snapshot an initial version
    await prisma.pageSectionVersion.create({
      data: {
        sectionKey: sec.key,
        content: sec.content,
        publishedBy: 'system-seed',
      },
    });
  }
  console.log('✅ PageSections and initial versions ensured.');

  // 4. Hero Slides
  const existingHero = await prisma.heroSlide.findFirst();
  if (!existingHero) {
    await prisma.heroSlide.create({
      data: {
        badgeEn: 'Sacred Heritage · Eternal Dharma',
        badgeHi: 'पवित्र धरोहर · सनातन धर्म',
        titleEn: 'Awakening the Sacred Spirit of Kushbhawanpur',
        titleHi: 'कुशभवनपुर की पावन चेतना और धरोहर का पुनर्जागरण',
        subtitleEn:
          'Dedicated to the restoration of ancient temples, cow welfare, Sanskrit education, and the preservation of sacred Sanatan traditions.',
        subtitleHi:
          'प्राचीन मंदिरों के जीर्णोद्धार, गोसेवा, वैदिक शिक्षा और सनातन संस्कृति के संवर्धन को समर्पित एक निष्काम संकल्प।',
        ctaLabelEn: 'Offer Your Seva',
        ctaLabelHi: 'सेवा में योगदान दें',
        ctaTarget: '#donate',
        cta2LabelEn: 'Explore Our Journey',
        cta2LabelHi: 'हमारी यात्रा देखें',
        cta2Target: '#story',
        bgImageUrl: '/images/hero-bg.webp',
        sortOrder: 0,
        active: true,
      },
    });
  }

  // 5. Trust Items
  const trustItems = [
    { titleEn: '100% Direct Seva', titleHi: '१००% प्रत्यक्ष सेवा', subtitleEn: 'Every rupee goes to the cause', subtitleHi: 'हर रुपया सीधे सेवा कार्य में', iconName: 'ShieldCheck', sortOrder: 1 },
    { titleEn: 'Instant Receipt', titleHi: 'त्वरित रसीद', subtitleEn: 'Official digital receipt with QR', subtitleHi: 'सत्यापित रसीद व विवरण', iconName: 'FileCheck', sortOrder: 2 },
    { titleEn: 'Verified Bank & UPI', titleHi: 'सत्यापित खाता व यूपीआई', subtitleEn: 'Official Foundation Accounts', subtitleHi: 'अधिकृत संस्थागत खाते', iconName: 'Building2', sortOrder: 3 },
    { titleEn: 'Transparent Impact', titleHi: 'पारदर्शी रिपोर्टिंग', subtitleEn: 'Regular photographic field updates', subtitleHi: 'नियमित कार्य प्रगति विवरण', iconName: 'Eye', sortOrder: 4 },
  ];
  for (const item of trustItems) {
    const existing = await prisma.trustItem.findFirst({ where: { titleEn: item.titleEn } });
    if (!existing) {
      await prisma.trustItem.create({ data: item });
    }
  }

  // 6. Value Pillars
  const valuePillars = [
    { titleEn: 'Dharma Raksha', titleHi: 'धर्म रक्षा', descEn: 'Guarding our sacred shrines, rituals, and philosophical wisdom for generations to come.', descHi: 'तीर्थों, संस्कारों और सनातन संस्कृति के संरक्षण हेतु अनवरत प्रयास।', iconName: 'Flame', sortOrder: 1 },
    { titleEn: 'Nishkama Seva', titleHi: 'निःस्वार्थ सेवा', descEn: 'Selfless service to society, pilgrims, animals, and the needy with purity of intention.', descHi: 'प्राणी मात्र की निःस्वार्थ सेवा और समाज के वंचित वर्गों का सहयोग।', iconName: 'HeartHandshake', sortOrder: 2 },
    { titleEn: 'Parampara & Vidya', titleHi: 'परंपरा एवं विद्या', descEn: 'Revitalising Vedic learning, Sanskrit recitation, and historical consciousness.', descHi: 'वैदिक शिक्षा, संस्कृत अध्ययन और ऐतिहासिक गौरव की पुनः प्रतिष्ठा।', iconName: 'BookOpen', sortOrder: 3 },
  ];
  for (const pillar of valuePillars) {
    const existing = await prisma.valuePillar.findFirst({ where: { titleEn: pillar.titleEn } });
    if (!existing) {
      await prisma.valuePillar.create({ data: pillar });
    }
  }

  // 7. Focus Areas
  const focusAreas = [
    {
      slug: 'temple-preservation',
      badgeEn: 'Shrine Revival',
      badgeHi: 'मंदिर जीर्णोद्धार',
      titleEn: 'Ancient Temple Restoration',
      titleHi: 'प्राचीन मंदिर संरक्षण एवं जीर्णोद्धार',
      shortDescEn: 'Architectural conservation and regular pujas in neglected local shrines across the sacred Kushbhawanpur kshetra.',
      shortDescHi: 'कुशभवनपुर क्षेत्र के उपेक्षित व ऐतिहासिक मंदिरों का स्थापत्य संरक्षण एवं नित्य पूजा की व्यवस्था।',
      fullDescEn: 'Many ancient shrines of historical reverence require delicate stone conservation, structural reinforcement, and daily devotional continuity.',
      imageUrl: '/images/focus/temple.webp',
      suggestedAmount: 2100,
      linkedSevaId: 'temple-preservation',
      sortOrder: 1,
    },
    {
      slug: 'vedic-education',
      badgeEn: 'Vedic Heritage',
      badgeHi: 'वेद विद्या',
      titleEn: 'Gurukula & Sanskrit Studies',
      titleHi: 'गुरुकुल एवं संस्कृत विद्या संवर्धन',
      shortDescEn: 'Supporting traditional Vedic students with residential facilities, texts, and authentic teacher stipends.',
      shortDescHi: 'गुरुकुल के विद्यार्थियों हेतु आवास, ग्रंथ, अन्नक्षेत्र एवं आचार्यों को सम्मानजनक सहयोग।',
      fullDescEn: 'Preserving the oral transmission of Vedic mantras and classical Sanskrit literature through direct scholarships and sustenance for residential Gurukulas.',
      imageUrl: '/images/focus/vedic.webp',
      suggestedAmount: 1100,
      linkedSevaId: 'vedic-education',
      sortOrder: 2,
    },
    {
      slug: 'gaushala-seva',
      badgeEn: 'Jiva Daya',
      badgeHi: 'जीव दया',
      titleEn: 'Desi Gaushala & Cow Welfare',
      titleHi: 'देशी गोवंश संरक्षण एवं संवर्धन',
      shortDescEn: 'Providing green fodder, medical shelter, and lifelong dignified care for indigenous Desi cows and abandoned cattle.',
      shortDescHi: 'देशी गोवंश के लिए पौष्टिक आहार, औषधीय उपचार और सुरक्षित आश्रय की समुचित व्यवस्था।',
      fullDescEn: 'Our gaushala provides nutritious fodder, round-the-clock veterinary attention, and respectful shelter for abandoned and aged cows.',
      imageUrl: '/images/focus/cow.webp',
      suggestedAmount: 501,
      linkedSevaId: 'gaushala-seva',
      sortOrder: 3,
    },
    {
      slug: 'sacred-environment',
      badgeEn: 'Prakriti Seva',
      badgeHi: 'प्रकृति सेवा',
      titleEn: 'Sacred Groves & River Ghats',
      titleHi: 'पवित्र उपवन एवं सरयू-गोमती तट संरक्षण',
      shortDescEn: 'Planting native sacred trees (Peepal, Banyan, Bel) and maintaining clean, respectful river ghat environments.',
      shortDescHi: 'पंचवटी, बेल व पीपल वृक्षारोपण तथा तीर्थ घाटों की स्वच्छता व सौंदर्यीकरण।',
      fullDescEn: 'Restoring the sacred ecological harmony of riverbanks and temple parikrama corridors through native indigenous flora.',
      imageUrl: '/images/focus/environment.webp',
      suggestedAmount: 1100,
      linkedSevaId: 'sacred-environment',
      sortOrder: 4,
    },
    {
      slug: 'pilgrim-annakshetra',
      badgeEn: 'Anna Daan',
      badgeHi: 'अन्न दान',
      titleEn: 'Pilgrim & Sadhu Annakshetra',
      titleHi: 'साधु-संत एवं तीर्थयात्री अन्नक्षेत्र',
      shortDescEn: 'Serving fresh, wholesome, sanctified meals (Prasadam) to visiting devotees, ascetics, and underprivileged pilgrims.',
      shortDescHi: 'तीर्थक्षेत्र में पधारने वाले साधुओं, संतों एवं जरूरतमंद श्रद्धालुओं हेतु शुद्ध सात्त्विक महाप्रसाद।',
      fullDescEn: 'Daily and festival-time distribution of hygienic, nutritious prasadam prepared with devotion in clean community kitchens.',
      imageUrl: '/images/focus/annakshetra.webp',
      suggestedAmount: 5100,
      linkedSevaId: 'pilgrim-annakshetra',
      sortOrder: 5,
    },
    {
      slug: 'heritage-documentation',
      badgeEn: 'Itihasa',
      badgeHi: 'इतिहास',
      titleEn: 'Heritage Archives & Publications',
      titleHi: 'ऐतिहासिक अभिलेख एवं धरोहर शोध',
      shortDescEn: 'Documenting local oral histories, inscriptions, and sacred geography of historical Kushbhawanpur.',
      shortDescHi: 'कुशभवनपुर के प्राचीन इतिहास, शिलालेखों और स्थानीय परंपराओं का प्रामाणिक दस्तावेजीकरण।',
      fullDescEn: 'Scholarly research, archiving of rare manuscripts, and public monographs celebrating the unbroken legacy of our cultural capital.',
      imageUrl: '/images/focus/heritage.webp',
      suggestedAmount: 2100,
      linkedSevaId: 'heritage-documentation',
      sortOrder: 6,
    },
  ];

  for (const fa of focusAreas) {
    await prisma.focusArea.upsert({
      where: { slug: fa.slug },
      update: {},
      create: fa,
    });
  }

  // 8. Story Chapters with Hotspots
  const storyChapters = [
    {
      chapterNumber: 1,
      titleEn: 'Om — The Primordial Sound',
      titleHi: 'ॐ — सृष्टि का आदिनाद',
      subtitleEn: 'Where every prayer begins.',
      subtitleHi: 'जहाँ से प्रत्येक प्रार्थना का आरंभ होता है।',
      textEn:
        'Before a temple is raised or a word is written, there is sound. In Sanatan tradition that sound is Om, also called Pranava — the syllable said to hold all of existence. Its three sounds, A, U and M, represent the waking, dreaming and deep-sleep states, and the silence that follows as the transcendent fourth state.',
      quoteEn: 'ओमित्येतदक्षरमिदं सर्वम् — Māṇḍūkya Upaniṣad, 1',
      hotspotX: 50.0,
      hotspotY: 34.0,
      hotspotRadius: 12.0,
      chips: ['Pranava', 'A · U · M', 'Mandukya Upanishad'],
      imageUrl: '/images/story/om-chapter.webp',
      sevaLink: '#donate',
      sortOrder: 1,
    },
    {
      chapterNumber: 2,
      titleEn: 'The Temple Shikhara — Axis of the Sacred',
      titleHi: 'शिखर — दिव्यता का आरोहण',
      subtitleEn: 'Stone crowned in devotion.',
      subtitleHi: 'भक्ति और स्थापत्य का संगम।',
      textEn:
        'The temple shikhara rises as Mount Meru in miniature, an axis between earth and the heavens. It guides the wandering eye upward, from worldly noise to celestial serenity.',
      quoteEn: 'प्रासादो मेरुवत् ख्यातः — Vāstu Shāstra',
      hotspotX: 50.0,
      hotspotY: 52.0,
      hotspotRadius: 14.0,
      chips: ['Architecture', 'Sacred Spire', 'Temple Bells'],
      imageUrl: '/images/story/shikhara-chapter.webp',
      sevaLink: '#donate',
      sortOrder: 2,
    },
    {
      chapterNumber: 3,
      titleEn: 'The Sacred Lotus — Unblemished Purity',
      titleHi: 'कमल — अनासक्त शुचिता',
      subtitleEn: 'Rooted in earth, blossoming towards the sun.',
      subtitleHi: 'जल में रहकर भी जल से निर्लिप्त।',
      textEn:
        'The lotus grows through muddy depths yet its petals never carry a drop of dirt. It is the eternal Sanatan emblem of detached action and spiritual purity.',
      quoteEn: 'पद्मपत्रमिवाम्भसा — Bhagavad Gītā 5.10',
      hotspotX: 50.0,
      hotspotY: 70.0,
      hotspotRadius: 12.0,
      chips: ['Selfless Service', 'Purity', 'Nishkama Karma'],
      imageUrl: '/images/story/lotus-chapter.webp',
      sevaLink: '#contact',
      sortOrder: 3,
    },
    {
      chapterNumber: 4,
      titleEn: 'Sacred Waters — The Flow of Life',
      titleHi: 'तीर्थ — जीवनदायिनी धारा',
      subtitleEn: 'Nourishing souls and civilisations.',
      subtitleHi: 'पवित्र नदियों का पावन प्रवाह।',
      textEn:
        'Rivers are not mere waterways in Bharat; they are mothers and living tirthas. Kushbhawanpur\'s soil has been purified by sacred currents since time immemorial.',
      hotspotX: 50.0,
      hotspotY: 84.0,
      hotspotRadius: 12.0,
      chips: ['River Ghats', 'Clean Pilgrimage', 'Aarti Tradition'],
      imageUrl: '/images/story/river-chapter.webp',
      sevaLink: '#donate',
      sortOrder: 4,
    },
    {
      chapterNumber: 5,
      titleEn: 'The Unbroken Sankalpa — Our Sacred Oath',
      titleHi: 'संकल्प — एक अटूट प्रतिज्ञा',
      subtitleEn: 'Five symbols united in one living mission.',
      subtitleHi: 'धरोहर और सेवा का अमर संकल्प।',
      textEn:
        'When sound, sacred space, pure intention, and cleansing water unite, they forge an unbreakable resolve — our Sankalpa.',
      hotspotX: 50.0,
      hotspotY: 50.0,
      hotspotRadius: 30.0,
      chips: ['Living Heritage', 'Unity', 'Eternal Dharma'],
      imageUrl: '/images/story/sankalpa-chapter.webp',
      sevaLink: '#donate',
      sortOrder: 5,
    },
  ];

  for (const ch of storyChapters) {
    const existing = await prisma.storyChapter.findFirst({ where: { chapterNumber: ch.chapterNumber } });
    if (!existing) {
      await prisma.storyChapter.create({ data: ch });
    }
  }

  // 9. Impact Items
  const impactItems = [
    { amount: 501, labelEn: 'Prasadam & Gau Grass', labelHi: 'गो ग्रास एवं प्रसाद', outcomeEn: 'Nutritious green fodder for cows for one day.', outcomeHi: 'एक दिन के लिए देशी गोवंश को हरा चारा।', iconName: 'Heart', sortOrder: 1 },
    { amount: 1100, labelEn: 'Gurukula Sustenance', labelHi: 'विद्यार्थी सहयोग', outcomeEn: 'Vedic learning texts & essentials for a student.', outcomeHi: 'वेदपाठी विद्यार्थी हेतु ग्रंथ एवं शिक्षण सामग्री।', iconName: 'BookOpen', sortOrder: 2 },
    { amount: 2100, labelEn: 'Temple Maintenance', labelHi: 'मंदिर नित्य सेवा', outcomeEn: 'Daily puja supplies & lamp oil for 15 days.', outcomeHi: '१५ दिनों की नित्य आरती, दीप तेल एवं पूजन सामग्री।', iconName: 'Flame', sortOrder: 3 },
    { amount: 5100, labelEn: 'Stone Restoration', labelHi: 'शिला संरक्षण', outcomeEn: 'Restores weathered stone plinths & carved pillars.', outcomeHi: 'प्राचीन स्तंभों व देवालय चबूतरों का पुनरुद्धार।', iconName: 'Shield', sortOrder: 4 },
    { amount: 11000, labelEn: 'Annakshetra Patron', labelHi: 'अन्नक्षेत्र सेवा', outcomeEn: 'Sponsors complete meals for 200+ pilgrims on festivals.', outcomeHi: 'पर्वों पर २००+ श्रद्धालुओं हेतु सम्पूर्ण महाप्रसाद सेवा।', iconName: 'Utensils', sortOrder: 5 },
  ];
  for (const item of impactItems) {
    const existing = await prisma.impactItem.findFirst({ where: { amount: item.amount } });
    if (!existing) {
      await prisma.impactItem.create({ data: item });
    }
  }

  // 10. Donor Benefits
  const donorBenefits = [
    { titleEn: 'Official 80G Tax Exemption', titleHi: '८०जी आयकर छूट', descEn: 'Eligible donations receive instant 80G tax benefits under Indian IT Act regulations.', descHi: 'भारतीय आयकर अधिनियम के अंतर्गत कर छूट का लाभ प्राप्त करें।', iconName: 'Receipt', sortOrder: 1 },
    { titleEn: 'Instant Verified Digital Receipt', titleHi: 'त्वरित डिजिटल रसीद', descEn: 'Download a signed PDF receipt with tamper-proof verification QR code immediately.', descHi: 'क्यूआर कोड से युक्त आधिकारिक डिजिटल रसीद तुरंत डाउनलोड करें।', iconName: 'FileCheck', sortOrder: 2 },
    { titleEn: 'Sankalpa in Daily Pujas', titleHi: 'नित्य पूजा में नाम संकल्प', descEn: 'Your family\'s name and gotra are offered in daily prayers at preserved shrines.', descHi: 'संरक्षित देवालयों में आपके नाम व गोत्र से नित्य मंगल संकल्प।', iconName: 'Sparkles', sortOrder: 3 },
    { titleEn: 'Quarterly Transparent Reports', titleHi: 'त्रैमासिक कार्य प्रगति रिपोर्ट', descEn: 'Receive detailed photographic and financial updates showing where every rupee went.', descHi: 'कार्य की वास्तविक प्रगति और व्यय का पारदर्शी सचित्र विवरण।', iconName: 'BarChart3', sortOrder: 4 },
  ];
  for (const ben of donorBenefits) {
    const existing = await prisma.donorBenefit.findFirst({ where: { titleEn: ben.titleEn } });
    if (!existing) {
      await prisma.donorBenefit.create({ data: ben });
    }
  }

  // 11. Gallery Items
  const galleryItems = [
    { imageUrl: '/images/gallery/temple-morning.webp', captionEn: 'Morning Aarti at restored historic shrine', captionHi: 'प्रातःकालीन आरती का दिव्य दृश्य', category: 'Temples', sortOrder: 1 },
    { imageUrl: '/images/gallery/gau-seva.webp', captionEn: 'Desi cows feeding at the heritage gaushala', captionHi: 'गोशाला में देशी गोवंश की सेवा', category: 'Gaushala', sortOrder: 2 },
    { imageUrl: '/images/gallery/vedic-students.webp', captionEn: 'Vedic students reciting sacred Suktas', captionHi: 'वेदपाठी बटुकों द्वारा सस्वर वेदमंत्र पाठ', category: 'Gurukula', sortOrder: 3 },
    { imageUrl: '/images/gallery/ghat-evening.webp', captionEn: 'Evening lamp offering at the sacred river ghat', captionHi: 'संध्या काल में पवित्र तट पर दीपदान', category: 'Ghats', sortOrder: 4 },
    { imageUrl: '/images/gallery/stone-work.webp', captionEn: 'Heritage stone carver restoring intricate motifs', captionHi: 'प्राचीन नक्काशी का संरक्षण करते शिल्पी', category: 'Restoration', sortOrder: 5 },
    { imageUrl: '/images/gallery/annakshetra-serve.webp', captionEn: 'Pilgrims receiving sanctified Prasadam', captionHi: 'श्रद्धालुओं को महाप्रसाद वितरण', category: 'Annakshetra', sortOrder: 6 },
  ];
  for (const gal of galleryItems) {
    const existing = await prisma.galleryItem.findFirst({ where: { imageUrl: gal.imageUrl } });
    if (!existing) {
      await prisma.galleryItem.create({ data: gal });
    }
  }

  // 12. Involve Cards
  const involveCards = [
    {
      titleEn: 'Volunteer On Ground',
      titleHi: 'क्षेत्रीय स्वयंसेवक बनें',
      descEn: 'Join weekend restoration drives, ghat cleanliness walks, and festival prasadam distribution teams.',
      descHi: 'मंदिर सफाई, तीर्थ घाट स्वच्छता और उत्सवों में सेवा कार्य हेतु हमसे जुड़ें।',
      actionLabelEn: 'Register as Volunteer',
      actionLabelHi: 'स्वयंसेवक पंजीकरण',
      actionTarget: '#contact',
      iconName: 'Users',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      titleEn: 'Spread Sacred Heritage',
      titleHi: 'धरोहर का प्रसार करें',
      descEn: 'Share our documentary videos, historical monographs, and seva initiatives with your community.',
      descHi: 'हमारी ऐतिहासिक शोध सामग्री और वीडियो को अपने परिजनों व मित्रों के साथ साझा करें।',
      actionLabelEn: 'Watch Videos',
      actionLabelHi: 'वीडियो देखें',
      actionTarget: '#videos',
      iconName: 'Share2',
      sortOrder: 2,
    },
    {
      titleEn: 'CSR & Institutional Giving',
      titleHi: 'सीएसआर एवं संस्थागत सहयोग',
      descEn: 'Partner with us for corporate social responsibility initiatives in heritage conservation and rural gaushalas.',
      descHi: 'कॉर्पोरेट संस्थाएं धरोहर संरक्षण और गोसंरक्षण परियोजनाओं में सहभागिता करें।',
      actionLabelEn: 'Contact CSR Desk',
      actionLabelHi: 'सीएसआर संपर्क',
      actionTarget: '#contact',
      iconName: 'Building',
      sortOrder: 3,
    },
  ];
  for (const inv of involveCards) {
    const existing = await prisma.involveCard.findFirst({ where: { titleEn: inv.titleEn } });
    if (!existing) {
      await prisma.involveCard.create({ data: inv });
    }
  }

  // 13. FAQs
  const faqs = [
    {
      category: 'Donations & Tax',
      questionEn: 'How are my donations utilised by the foundation?',
      questionHi: 'मेरे द्वारा दिए गए दान का उपयोग कैसे किया जाता है?',
      answerEn: 'Every rupee donated is allocated directly to the designated cause (Temple Restoration, Gau Seva, Vedic Gurukula, or Annakshetra). We maintain strict zero-wastage financial accountability with regular photographic progress reports and transparent audits.',
      answerHi: 'आपके द्वारा दी गई प्रत्येक राशि सीधे उसी सेवा कार्य में लगाई जाती है जिसे आपने चुना है। हम नियमित सचित्र रिपोर्ट और पारदर्शी लेखा-जोखा उपलब्ध कराते हैं।',
      sortOrder: 1,
    },
    {
      category: 'Receipts',
      questionEn: 'When and how do I receive my donation receipt?',
      questionHi: 'दान रसीद मुझे कब और कैसे प्राप्त होगी?',
      answerEn: 'Upon completing your donation via UPI or Bank Transfer, you receive a verification tracking code. Once the transaction UTR is verified by our accounts team, you can instantly download your signed PDF receipt with a QR verification seal from our website.',
      answerHi: 'दान पूर्ण करने के उपरांत आपको एक ट्रैकिंग कोड प्राप्त होता है। बैंक यूटीआर सत्यापन के पश्चात आप सीधे वेबसाइट से डिजिटल हस्ताक्षर युक्त पीडीएफ रसीद डाउनलोड कर सकते हैं।',
      sortOrder: 2,
    },
    {
      category: 'Donations & Tax',
      questionEn: 'Can I donate via Direct Bank Transfer (NEFT/RTGS)?',
      questionHi: 'क्या मैं सीधे बैंक ट्रांसफर (NEFT/RTGS) से दान कर सकता हूँ?',
      answerEn: 'Yes. Our official Foundation bank account details (Account Name, Account Number, IFSC code, and Branch) are listed in the donation portal. Simply make the transfer and enter your UTR number to claim your receipt.',
      answerHi: 'हाँ। संस्था के अधिकृत बैंक खाते का विवरण दान अनुभाग में उपलब्ध है। ट्रांसफर के बाद यूटीआर दर्ज कर अपनी रसीद प्राप्त करें।',
      sortOrder: 3,
    },
    {
      category: 'Visiting & Volunteering',
      questionEn: 'Can I visit the restoration sites or gaushala in person?',
      questionHi: 'क्या मैं स्वयं आकर जीर्णोद्धार स्थलों अथवा गोशाला का दर्शन कर सकता हूँ?',
      answerEn: 'You are always welcome! Please reach out to us through our contact form or phone number prior to your visit so our team can warmly receive you and guide you through the historic sites.',
      answerHi: 'आपका सदैव स्वागत है! कृपया अपनी यात्रा से पूर्व संपर्क सूत्र पर सूचना दें ताकि हमारी टीम आपका मार्गदर्शन कर सके।',
      sortOrder: 4,
    },
  ];
  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({ where: { questionEn: faq.questionEn } });
    if (!existing) {
      await prisma.faqItem.create({ data: faq });
    }
  }

  // 14. Pledge Content
  await prisma.pledgeContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      shlokaSanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
      transliteration: 'Sarve bhavantu sukhinaḥ, sarve santu nirāmayāḥ | Sarve bhadrāṇi paśyantu, mā kaścid-duḥkha-bhāg-bhavet ||',
      meaningEn: 'May all beings everywhere be happy and free from illness. May all see what is auspicious and no one suffer.',
      meaningHi: 'सब सुखी हों, सब रोगमुक्त रहें, सब मंगलमय घटनाओं के साक्षी बनें और किसी को भी दुःख का भागी न बनना पड़े।',
      textEn: 'We invite every devotee of Sanatan Dharma to stand with us as guardians of this eternal land.',
      textHi: 'आइए, हम सब मिलकर अपनी ऐतिहासिक व आध्यात्मिक जड़ों को सुदृढ़ बनाएं।',
      source: 'Brihadaranyaka Upanishad',
    },
  });

  // 15. Policy Pages
  const policies = [
    {
      slug: 'privacy-policy',
      titleEn: 'Privacy Policy',
      titleHi: 'गोपनीयता नीति',
      contentEn:
        'Kushbhawanpur Sanatan Dharma & Heritage Foundation respects your privacy. We collect minimal personal details (Name, Contact, PAN for 80G tax receipts) solely to comply with statutory Indian tax reporting and provide donation confirmation receipts. Your data is never sold, leased, or disclosed to third parties.',
      contentHi:
        'कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन आपकी गोपनीयता का सम्मान करता है। हम दान रसीद एवं आयकर नियमों के अनुपालन हेतु आवश्यक न्यूनतम विवरण ही एकत्र करते हैं। आपकी जानकारी कभी किसी तीसरे पक्ष को नहीं दी जाती।',
    },
    {
      slug: 'terms-and-conditions',
      titleEn: 'Terms & Conditions',
      titleHi: 'नियम एवं शर्तें',
      contentEn:
        'All donations made to the Kushbhawanpur Sanatan Dharma & Heritage Foundation are voluntary and dedicated to charitable and heritage restoration purposes. Please ensure accurate donor details are entered for proper tax certificate issuance.',
      contentHi:
        'संस्था को दिया गया समस्त दान स्वेच्छा से धर्मार्थ व धरोहर संरक्षण कार्यों हेतु प्रयुक्त होता है। रसीद हेतु कृपया सही विवरण दर्ज करें।',
    },
    {
      slug: 'refund-cancellation-policy',
      titleEn: 'Refund & Cancellation Policy',
      titleHi: 'धनवापसी नीति',
      contentEn:
        'As donations are immediately assigned to ongoing field projects (cow fodder, temple restoration, prasadam distribution), contributions are normally non-refundable. In cases of erroneous duplicate bank debits, please contact accounts@kushbhawanpur.org within 3 days with transaction UTR proof for reconciliation.',
      contentHi:
        'चूंकि दान की राशि सीधे सेवा कार्यों में लगाई जाती है, सामान्यतः धनवापसी संभव नहीं होती। किसी तकनीकी त्रुटि अथवा दोहरे डेबिट की स्थिति में ३ दिनों के भीतर संपर्क करें।',
    },
  ];

  for (const pol of policies) {
    await prisma.policyPage.upsert({
      where: { slug: pol.slug },
      update: {},
      create: pol,
    });
  }

  // 16. Ensure registered media assets in MediaAsset table
  const defaultAssets = [
    {
      originalName: 'logo-original.png',
      mime: 'image/png',
      sizeBytes: 154200,
      url: 'https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/brand/logo-original.png',
      storageKey: 'brand/logo-original.png',
      alt: 'Official Foundation Logo',
      caption: 'Kushbhawanpur Sanatan Dharma & Heritage Foundation Emblem',
      status: 'ATTACHED',
    },
    {
      originalName: 'sanjay-singh.jpg',
      mime: 'image/jpeg',
      sizeBytes: 182400,
      url: 'https://racqnmwrulqqvqjcsxfn.supabase.co/storage/v1/object/public/kushbhawanpur-media/team/sanjay-singh.jpg',
      storageKey: 'team/sanjay-singh.jpg',
      alt: 'Mr. Sanjay Singh - Founder & Trustee',
      caption: 'Mr. Sanjay Singh, Educationist & Trustee',
      status: 'ATTACHED',
    },
  ];

  for (const asset of defaultAssets) {
    const existing = await prisma.mediaAsset.findFirst({ where: { storageKey: asset.storageKey } });
    if (!existing) {
      await prisma.mediaAsset.create({ data: asset });
    }
  }

  console.log('🎉 CMS & Dynamic Content Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
