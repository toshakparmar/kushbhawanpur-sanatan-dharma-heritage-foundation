export interface Hotspot {
  x: number; // percentage from top-left (0-100)
  y: number; // percentage from top-left (0-100)
  radius: number; // percentage of emblem size
}

export interface Verse {
  text: string;
  source: string;
}

export interface SevaLink {
  label: string;
  href: string;
}

export interface StoryChapterData {
  id: string;
  index: number;
  numberDevanagari: string;
  numberLatin: string;
  symbolName: string;
  titleDevanagari: string;
  titleEnglish: string;
  tagline: string;
  paragraphs: string[];
  verse?: Verse;
  note?: string;
  chips: string[];
  sevaLink?: SevaLink;
  image: string;
  imageAlt: string;
  mobileDetailCrop: string;
  hotspot: Hotspot;
  tint: string;
}

export interface ClosingSymbol {
  id: string;
  symbol: string;
  standsFor: string;
  focusArea: string;
  iconName: "om" | "book" | "cow" | "tree" | "temple";
}

export interface StoryContent {
  eyebrow: string;
  title: string;
  intro: string;
  chapters: StoryChapterData[];
  closing: {
    titleDevanagari: string;
    titleEnglish: string;
    description: string;
    symbols: ClosingSymbol[];
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
}

export const STORY_CONTENT: StoryContent = {
  eyebrow: "हमारी कथा · Our Story",
  title: "Five Symbols, One Sankalpa",
  intro:
    "Every part of our emblem is a promise. Walk through the five symbols that shape what we protect, why we serve, and where we come from.",
  chapters: [
    {
      id: "om",
      index: 0,
      numberDevanagari: "१",
      numberLatin: "1",
      symbolName: "Om",
      titleDevanagari: "ॐ — सृष्टि का आदिनाद",
      titleEnglish: "Om — The First Sound",
      tagline: "Where every prayer begins.",
      paragraphs: [
        "Before a temple is raised or a word is written, there is sound. In Sanatan tradition that sound is Om, also called Pranava — the syllable said to hold all of existence. Its three sounds, A, U and M, are traditionally read as the waking, dreaming and deep-sleep states, and the silence that follows as the fourth state beyond them, as the Mandukya Upanishad describes.",
        "Our emblem places Om at the crown, with rays of light streaming from it. It is why we serve: so that this light stays alive in the temples, homes and hearts of our community."
      ],
      verse: {
        text: "ओमित्येतदक्षरमिदं सर्वम्",
        source: "Māṇḍūkya Upaniṣad, 1"
      },
      chips: ["Pranava", "A · U · M and silence", "Mandukya Upanishad"],
      image: "/images/story/om-chapter.webp",
      imageAlt: "A consecrated brass diya radiating warm sacred light",
      mobileDetailCrop: "/images/story/story-om.webp",
      hotspot: {
        x: 50,
        y: 17,
        radius: 13
      },
      tint: "rgba(212, 160, 44, 0.05)"
    },
    {
      id: "book",
      index: 1,
      numberDevanagari: "२",
      numberLatin: "2",
      symbolName: "Granth",
      titleDevanagari: "ग्रंथ — ज्ञान की ज्योति",
      titleEnglish: "The Book — A Light That Is Handed Down",
      tagline: "A tradition carried in words.",
      paragraphs: [
        "Beneath the temple in our emblem lies an open book, with a single diya burning at its centre. Sanatan Dharma has travelled across millennia through the Vedas, the Upanishads, the Puranas and the great epics, the Ramayana and the Mahabharata — preserved for millennia by exact oral recitation, passed from guru to shishya long before it was written, and later copied by hand onto palm leaf, birch bark and paper.",
        "Knowledge is the foundation on which temples, festivals and a way of life stand. Our work in Vedic education and manuscript preservation exists so that this living library is read, understood and passed on — not merely admired."
      ],
      chips: [
        "Vedas · Upanishads · Puranas",
        "Ramayana · Mahabharata",
        "Guru–shishya parampara"
      ],
      sevaLink: {
        label: "Dharmic Education & Manuscript Archives",
        href: "#work"
      },
      image: "/images/story/manuscript-chapter.webp",
      imageAlt: "Carefully preserved ancient palm-leaf scriptures and manuscripts",
      mobileDetailCrop: "/images/story/story-book.webp",
      hotspot: {
        x: 50,
        y: 82,
        radius: 24
      },
      tint: "rgba(122, 31, 20, 0.05)"
    },
    {
      id: "gau",
      index: 2,
      numberDevanagari: "३",
      numberLatin: "3",
      symbolName: "Gau Mata",
      titleDevanagari: "गौ माता — सेवा की जननी",
      titleEnglish: "Gau Mata — The Mother Who Gives",
      tagline: "Compassion that nourishes.",
      paragraphs: [
        "In Hindu tradition the cow is revered as Gau Mata — a mother who nourishes without asking anything in return. Vedic hymns already call the cow aghnyā, 'not to be killed' (a term scholars still discuss ⚑), and the Mahabharata and Puranas speak of Kamadhenu, the wish-fulfilling cow said to have risen during the churning of the ocean. Lord Krishna, remembered as Gopala, the protector of cows, grew up among the cowherds of Vraj.",
        "For centuries the cow stood at the centre of village life — milk and ghee for the home, nourishment for the fields, and festivals such as Gopashtami and Govardhan Puja. In our emblem she stands calmly beside the temple: devotion and compassion belong together. Shelter, fodder and care for indigenous cows is one of our core works."
      ],
      chips: ["Kamadhenu", "Gopala · Vraj", "Gopashtami · Govardhan Puja"],
      sevaLink: {
        label: "Gau Seva & Animal Care",
        href: "#work"
      },
      image: "/images/story/gau-chapter.webp",
      imageAlt: "Calm indigenous Indian cow in open pasture during peaceful golden hour",
      mobileDetailCrop: "/images/story/story-gau.webp",
      hotspot: {
        x: 75,
        y: 66,
        radius: 12
      },
      tint: "rgba(232, 113, 10, 0.05)"
    },
    {
      id: "parijat",
      index: 3,
      numberDevanagari: "४",
      numberLatin: "4",
      symbolName: "Parijat Vriksha",
      titleDevanagari: "पारिजात — देववृक्ष",
      titleEnglish: "Parijat — The Tree from Heaven",
      tagline: "A living story, rooted in our soil.",
      paragraphs: [
        "Few trees carry as many stories as the Parijat. The Puranas describe it as one of the treasures that rose during the Samudra Manthan, the churning of the ocean, and as a Kalpavriksha — a wish-fulfilling tree of Indra's garden. In the Harivansh Purana, Krishna brings it to earth for Satyabhama. Another tradition says that Arjuna fetched it for his mother Kunti, who offered its flowers to Lord Shiva.",
        "Closer to home, the Sultanpur district administration lists a Parijaat Vriksh in Sultanpur itself, on the District Industries Centre campus off PWD Road in Civil Lines — described as a very old tree where devotees come to pray and make offerings ⚑. Farther afield, at Kintoor near Barabanki — a village traditionally named after Kunti — stands the best-documented Parijat of the region, believed to belong to the age of the Mahabharata. Botanists identify it as an African baobab (Adansonia digitata); a 2020 PLOS ONE radiocarbon study dated its oldest samples to about 790 radiocarbon years (roughly 775 calendar years), and the tree is protected by district order. Separately, the fragrant night-blooming Parijat known as Harsingar (Nyctanthes arbor-tristis) opens its white-and-orange flowers after dusk and lets them fall by dawn.",
        "Whether we read it as legend, living history or botanical wonder, the Parijat teaches one lesson: some things are meant to be protected for generations — which is why sacred trees and groves are part of our seva."
      ],
      note: "Legends and botanical findings are shown side by side; we honour both.",
      chips: [
        "Kalpavriksha",
        "Sultanpur Parijaat Vriksh",
        "Kintoor, Barabanki",
        "Harsingar (Nyctanthes arbor-tristis)"
      ],
      sevaLink: {
        label: "Sacred Groves & Ecology",
        href: "#work"
      },
      image: "/images/story/parijat-chapter.webp",
      imageAlt: "Magnificent sacred tree sanctuary and flourishing natural canopy",
      mobileDetailCrop: "/images/story/story-parijat.webp",
      hotspot: {
        x: 22,
        y: 48,
        radius: 20
      },
      tint: "rgba(62, 123, 58, 0.05)"
    },
    {
      id: "dhopap",
      index: 4,
      numberDevanagari: "५",
      numberLatin: "5",
      symbolName: "Dhopap Dham",
      titleDevanagari: "धोपाप धाम — पापमोचन तीर्थ",
      titleEnglish: "Dhopap Dham — Where the River Cleanses",
      tagline: "A pilgrimage woven into the land.",
      paragraphs: [
        "Dhopap — 'the place that washes away sin' — sits on the right bank of the Gomti, on the Sultanpur–Jaunpur road, about 32 km south-east of Sultanpur city and 85 km from Ayodhya. Tradition holds that after Lord Rama defeated Ravana, a learned Brahmin king, Maharshi Vashishtha advised him to bathe here for atonement. The district portal, citing the Vishnu Purana, says the Gomti was known in this tract as Dhutopapa, 'the sin-cleanser' ⚑. The Padma Purana (Patala Khanda) does recount Rama's remorse over Brahmahatya after Ravana's death; local accounts tie his atonement to this ghat and add that Vashishtha reminded Rama that Ravana, grandson of the sage Pulastya and a master of the Vedas, was a Brahmin, so atonement was needed; Rama bathed in the Gomti — also called Adi Ganga — on Jyeshtha Shukla Dashami, in the presence of the people of Awadh, and the place came to be known as Dhopap.",
        "A nearby belief says Rama lit a lamp here on his way back to Ayodhya, and the neighbouring area took the name Diyara from diya ⚑. In the early twentieth century Raja Rudra Pratap Singh of Diyara (1860–1914) helped restore the Ram temple at Dhopap and set up an Ayurvedic hospital for the poor, a dharamshala and Sanskrit schools ⚑ — heritage care and seva have long gone together here. Dhopap Ghat and its Ram temple draw pilgrims for a holy dip on Ganga Dussehra (Jyeshtha Dashami) and Chaitra Ram Navami, when bathing fairs gather. For Kushbhawanpur — traditionally linked with Kusha, son of Rama, and recorded in the district gazetteers as Kusapura or Kushabhavanpur — Dhopap is a reminder that this river-land is woven into the story of Rama, and that dharma means humility, atonement and renewal."
      ],
      chips: [
        "Gomti · Adi Ganga",
        "Maharshi Vashishtha",
        "Ganga Dussehra · Ram Navami",
        "Diyara"
      ],
      sevaLink: {
        label: "Temple & Heritage Preservation",
        href: "#work"
      },
      image: "/images/story/dhopap-chapter.webp",
      imageAlt: "Historical temple ghat along the holy Gomti river at sunrise",
      mobileDetailCrop: "/images/story/story-dhopap.webp",
      hotspot: {
        x: 50,
        y: 55,
        radius: 24
      },
      tint: "rgba(212, 160, 44, 0.05)"
    }
  ],
  closing: {
    titleDevanagari: "पाँच प्रतीक, एक संकल्प",
    titleEnglish: "Five Symbols, One Sankalpa",
    description:
      "Sound, knowledge, compassion, nature and sacred place — together they describe what we protect. Walk this path with us.",
    symbols: [
      {
        id: "om",
        symbol: "ॐ (Om)",
        standsFor: "Our spiritual foundation & primordial resonance",
        focusArea: "Spiritual Roots of All Seva",
        iconName: "om"
      },
      {
        id: "book",
        symbol: "ग्रंथ (Granth)",
        standsFor: "Living Vedic knowledge & manuscript preservation",
        focusArea: "Dharmic Education & Manuscript Archives",
        iconName: "book"
      },
      {
        id: "gau",
        symbol: "गौ माता (Gau Mata)",
        standsFor: "Motherly nourishment & selfless service",
        focusArea: "Gau Seva & Animal Care",
        iconName: "cow"
      },
      {
        id: "parijat",
        symbol: "पारिजात (Parijat)",
        standsFor: "Living sacred nature & timeless heritage trees",
        focusArea: "Sacred Groves & Ecology",
        iconName: "tree"
      },
      {
        id: "dhopap",
        symbol: "धोपाप (Dhopap)",
        standsFor: "Holy pilgrimage, atonement & river sanctity",
        focusArea: "Temple & Heritage Preservation",
        iconName: "temple"
      }
    ],
    primaryCta: {
      label: "Support our work",
      href: "#donate"
    },
    secondaryCta: {
      label: "Explore focus areas",
      href: "#work"
    }
  }
};
