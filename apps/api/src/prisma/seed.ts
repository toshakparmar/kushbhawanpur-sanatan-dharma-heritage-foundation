import { PrismaClient, Role, QrMode } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Organization Singleton
  const org = await prisma.organization.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      nameEn: 'Kushbhawanpur Sanatan Dharma & Heritage Foundation',
      nameHi: 'कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन',
      logoUrl: '/brand/logo-original.png',
      taglineEn: 'Preserving Sacred Heritage, Inspiring Dharmic Living',
      taglineHi: 'पुरातन सनातन धरोहर का संरक्षण, वैदिक संस्कृति का संवर्धन',
      aboutEn:
        'Kushbhawanpur Sanatan Dharma & Heritage Foundation is a dedicated charitable trust committed to protecting and reviving ancient temples, conserving rare sacred manuscripts, promoting Vedic education, and nurturing indigenous cattle across the historic land of Kushbhawanpur (Sultanpur, Uttar Pradesh).',
      visionEn:
        'To establish Kushbhawanpur as a beacon of Sanatan cultural preservation, scholarship, and compassionate seva where timeless heritage enriches modern life.',
      missionEn:
        'Conserving heritage temples, supporting traditional gurukuls, caring for indigenous cows, and fostering community solidarity through transparent, authentic seva.',
      email: 'seva@kushbhawanpur.org',
      phone: '+91 94150 00000',
      address: 'Kushbhawanpur (Sultanpur), Uttar Pradesh - 228001, India',
      receiptPrefix: 'KSDHF',
      receiptFooterNote:
        'This is a digitally generated donation receipt. For any questions, please contact seva@kushbhawanpur.org',
      fyStartMonth: 4,
    },
  });
  console.log('✅ Organization singleton ensured:', org.nameEn);

  // 2. Payment Settings Singleton
  const paymentSettings = await prisma.paymentSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      qrMode: QrMode.DYNAMIC,
      minAmountRupees: 100,
      maxAmountRupees: 1000000,
      presetAmounts: [501, 1100, 2100, 5100, 11000, 21000],
      allowUpi: true,
      allowBank: true,
      allowCheque: true,
      allowCsr: true,
      chequePayeeName: 'Kushbhawanpur Sanatan Dharma & Heritage Foundation',
      chequeAddress: 'Kushbhawanpur (Sultanpur), Uttar Pradesh - 228001, India',
      csrContact: 'csr@kushbhawanpur.org',
      verificationSlaText:
        'Our accounts volunteers verify transactions against bank records within 1–2 working days and email an official donation receipt.',
    },
  });
  console.log('✅ Payment settings singleton ensured:', paymentSettings.id);

  // 3. Super Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kushbhawanpur.org';
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe@2026!';
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(initialPassword, salt);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.SUPER_ADMIN,
      mustChangePassword: true,
      active: true,
    },
  });
  console.log('✅ Super Admin user ensured:', admin.email);

  // 4. Seva Focus Areas
  const sevas = [
    {
      id: 'temple-preservation',
      slug: 'temple-preservation',
      titleEn: 'Temple & Heritage Preservation',
      titleHi: 'पुरातन मंदिर संरक्षण',
      description:
        'Restoring and conserving ancient stone shrines, historic mandapas, and sacred architectural landmarks of Kushbhawanpur.',
      suggestedAmounts: [1100, 2100, 5100, 11000],
      imageUrl: '/images/work-temple.webp',
      active: true,
      sortOrder: 1,
    },
    {
      id: 'scripture-education',
      slug: 'scripture-education',
      titleEn: 'Dharmic Education & Scriptures',
      titleHi: 'वैदिक शिक्षा एवं ग्रंथ स्वाध्याय',
      description:
        'Supporting traditional gurukuls, Sanskrit scholars, and youth study circles in Vedic philosophy and cultural heritage.',
      suggestedAmounts: [501, 1100, 2100, 5100],
      imageUrl: '/images/work-scriptures.webp',
      active: true,
      sortOrder: 2,
    },
    {
      id: 'gau-seva',
      slug: 'gau-seva',
      titleEn: 'Gau Seva & Animal Care',
      titleHi: 'गौ सेवा एवं संवर्धन',
      description:
        'Shelter, nutrition, veterinary care, and loving protection for indigenous desi cows and calves in clean rural sanctuaries.',
      suggestedAmounts: [501, 1100, 2500, 5000],
      imageUrl: '/images/work-gau-seva.webp',
      active: true,
      sortOrder: 3,
    },
    {
      id: 'community-seva',
      slug: 'community-seva',
      titleEn: 'Community Seva & Annadanam',
      titleHi: 'अन्नदान एवं सामुदायिक सेवा',
      description:
        'Wholesome sacred meal distribution during major dharmic festivals, pilgrim gatherings, and in underserved rural hamlets.',
      suggestedAmounts: [1100, 2100, 5100, 11000],
      imageUrl: '/images/work-community.webp',
      active: true,
      sortOrder: 4,
    },
    {
      id: 'sacred-groves',
      slug: 'sacred-groves',
      titleEn: 'Sacred Groves & Banyan Ecology',
      titleHi: 'पवित्र उपवन एवं पर्यावरण संरक्षण',
      description:
        'Planting and protecting sacred banyan, peepal, and neem groves around pilgrimage routes and village water bodies.',
      suggestedAmounts: [501, 1100, 2100, 5100],
      imageUrl: '/images/work-environment.webp',
      active: true,
      sortOrder: 5,
    },
    {
      id: 'heritage-archives',
      slug: 'heritage-archives',
      titleEn: 'Manuscript & Heritage Archives',
      titleHi: 'प्राचीन पाण्डुलिपि एवं शोध अभिलेख',
      description:
        'High-resolution digital archiving and physical conservation of rare manuscripts, historical inscriptions, and oral lore.',
      suggestedAmounts: [1100, 2500, 5000, 15000],
      imageUrl: '/images/work-archives.webp',
      active: true,
      sortOrder: 6,
    },
  ];

  for (const seva of sevas) {
    await prisma.seva.upsert({
      where: { id: seva.id },
      update: {
        slug: seva.slug,
        titleEn: seva.titleEn,
        titleHi: seva.titleHi,
        description: seva.description,
        suggestedAmounts: seva.suggestedAmounts,
        imageUrl: seva.imageUrl,
        active: seva.active,
        sortOrder: seva.sortOrder,
      },
      create: seva,
    });
  }
  console.log(`✅ Seeded ${sevas.length} primary sevas/causes`);

  // 5. Check if SEED_DEMO is explicitly true
  if (process.env.SEED_DEMO === 'true') {
    console.log('🧪 SEED_DEMO=true detected. Seeding clearly labeled DEMO items...');
    // Demo video
    await prisma.video.upsert({
      where: { id: 'demo-video-1' },
      update: {},
      create: {
        id: 'demo-video-1',
        title: '[DEMO] Kushbhawanpur Sacred Heritage & Dhopap Dham Glimpse',
        sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        provider: 'YOUTUBE',
        videoId: 'dQw4w9WgXcQ',
        embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        thumbUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        category: 'Heritage',
        featured: true,
        sortOrder: 1,
        published: true,
      },
    });
    console.log('✅ Demo video seeded.');
  } else {
    console.log('🔒 SEED_DEMO is false/unset. Leaving Team, Certifications, Videos & Donations clean/empty as required.');
  }

  console.log('✨ Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
