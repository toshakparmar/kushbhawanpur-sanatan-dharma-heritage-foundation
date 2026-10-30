import React from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LightboxGallery, type GalleryItem } from "@/components/shared/LightboxGallery";

export function Gallery() {
  const galleryItems: GalleryItem[] = [
    {
      id: "sacred-ghat-dawn",
      title: "Morning Radiance Along Ancient Holy Ghats",
      hindiTitle: "प्रातःकालीन पावन घाट",
      category: "Sacred Landscape",
      image: "/images/gallery-ghat.webp",
      aspect: "landscape",
      caption: "Serene sunrise mist illuminating ancient riverside temple shikharas, reflection of timeless spiritual discipline.",
    },
    {
      id: "aarti-deep-daan",
      title: "Deep Daan & Evening Sandhya Aarti",
      hindiTitle: "संध्या आरती एवं दीपदान",
      category: "Devotion",
      image: "/images/gallery-aarti.webp",
      aspect: "landscape",
      caption: "Traditional brass lamps and floating earthen diyas lighting the sacred waters during twilight prayer.",
    },
    {
      id: "marigold-mandala",
      title: "Auspicious Floral Rangoli & Brass Urlis",
      hindiTitle: "पुष्प रंगोली एवं मंगलोत्सव",
      category: "Dharmic Parv",
      image: "/images/gallery-rangoli.webp",
      aspect: "square",
      caption: "Intricate sacred geometric mandala woven with fresh marigold blossoms and rose petals for festival celebrations.",
    },
    {
      id: "stone-temple-pillars",
      title: "Architectural Colonnades of Kushbhawanpur",
      hindiTitle: "पुरातन प्रस्तर मंडप",
      category: "Heritage",
      image: "/images/about-arches.webp",
      aspect: "square",
      caption: "Hand-carved sandstone pillars standing as enduring testaments to the sacred stonemasonry traditions of northern India.",
    },
    {
      id: "sacred-banyan-shelter",
      title: "Ancient Vatavriksha Sacred Grove",
      hindiTitle: "वटवृक्ष एवं तपोवन",
      category: "Ecology",
      image: "/images/work-environment.webp",
      aspect: "portrait",
      caption: "Centuries-old sacred banyan tree with natural arching roots creating a peaceful sanctuary for meditation and biodiversity.",
    },
    {
      id: "scholarly-manuscript",
      title: "Vedic Grantha Study & Documentation",
      hindiTitle: "स्वाध्याय एवं ज्ञान परम्परा",
      category: "Scriptures",
      image: "/images/work-scriptures.webp",
      aspect: "landscape",
      caption: "Scholarly exploration and preservation of traditional handwritten Sanskrit texts at the foundation study centre.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-sand/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          hindiBadge="धरोहर एवं सेवा झलकियाँ"
          badge="Moments of Heritage"
          title="Living Expressions of Sacred Heritage"
          description="Visual moments from our ongoing temple restorations, morning sandhya aartis, sacred banyan sanctuaries, and community gatherings."
        />

        <LightboxGallery items={galleryItems} />

      </div>
    </section>
  );
}
