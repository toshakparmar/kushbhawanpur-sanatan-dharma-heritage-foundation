"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Users, HeartHandshake, ShieldCheck, ExternalLink } from "lucide-react";

interface TeamMember {
  id: string;
  type: "FOUNDER" | "CO_FOUNDER" | "TRUSTEE" | "VOLUNTEER";
  nameEn: string;
  nameHi?: string;
  designation: string;
  photoUrl?: string;
  bio?: string;
  socials?: any;
}

interface TeamProps {
  team: TeamMember[];
}

function LeaderCard({ member }: { member: TeamMember }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // 3D tilt springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const roleLabel =
    member.type === "FOUNDER"
      ? "Founder & Chief Trustee"
      : member.type === "CO_FOUNDER"
      ? "Co-Founder & Trustee"
      : member.type === "TRUSTEE"
      ? "Board Trustee"
      : member.designation;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative rounded-3xl bg-paper/95 p-6 sm:p-8 border border-gold/40 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group"
    >
      {/* Decorative Gold Corner Flairs */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-gold/60 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-gold/60 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-gold/60 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-gold/60 pointer-events-none" />

      {/* Arched Portrait Mask */}
      <div className="relative w-44 h-56 sm:w-52 sm:h-64 rounded-t-[90px] rounded-b-2xl overflow-hidden border-2 border-gold/60 shadow-inner bg-sand/30 mb-6 flex items-center justify-center">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.nameEn}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 176px, 208px"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-maroon/70 mb-2">
              {member.nameEn.split(" ").map((n) => n[0]).join("")}
            </span>
            <ShieldCheck className="w-6 h-6 text-gold/70" />
          </div>
        )}
      </div>

      {/* Leader Name & Designation */}
      <span className="inline-block px-3 py-1 rounded-full bg-saffron/10 text-saffron-deep font-sans text-xs font-semibold uppercase tracking-wider mb-2">
        {roleLabel}
      </span>

      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon leading-tight mb-1">
        {member.nameEn}
      </h3>
      {member.nameHi && (
        <p className="font-hindi text-base sm:text-lg text-ink-muted mb-2 font-medium">
          {member.nameHi}
        </p>
      )}

      <p className="text-xs sm:text-sm font-sans text-saffron-dark font-medium mb-4">
        {member.designation}
      </p>

      {/* Bio message */}
      {member.bio && (
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans max-w-md line-clamp-4">
          &ldquo;{member.bio}&rdquo;
        </p>
      )}
    </motion.div>
  );
}

function VolunteerCard({ member }: { member: TeamMember }) {
  const initials = member.nameEn
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="rounded-2xl bg-paper/80 p-4 border border-gold/30 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 group hover:border-gold/60">
      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/50 bg-sand/40 shrink-0 flex items-center justify-center">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.nameEn}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="48px"
          />
        ) : (
          <span className="font-serif font-bold text-sm text-maroon">
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-serif text-base font-bold text-maroon truncate leading-snug">
          {member.nameEn}
        </h4>
        <p className="text-xs text-saffron-deep font-medium truncate">
          {member.designation}
        </p>
        {member.bio && (
          <p className="text-[11px] text-ink-muted truncate mt-0.5">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );
}

export function Team({ team }: TeamProps) {
  // CRITICAL RULE: Automatically hide if team is empty!
  if (!team || team.length === 0) {
    return null;
  }

  const leaders = team.filter(
    (m) =>
      m.type === "FOUNDER" || m.type === "CO_FOUNDER" || m.type === "TRUSTEE"
  );
  const volunteers = team.filter((m) => m.type === "VOLUNTEER");

  return (
    <section id="team" className="py-20 sm:py-24 bg-cream/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Our Leadership & Sevadars"
          title="Guided by Devotion, Driven by Seva"
          subtitle="Meet the devoted custodians, trustees, and selfless volunteers dedicating their lives to Kushbhawanpur's sacred revival."
        />

        {/* Leaders (Founder, Co-Founder, Trustees) */}
        {leaders.length > 0 && (
          <div
            className={`mt-12 sm:mt-16 grid gap-8 sm:gap-10 ${
              leaders.length === 1
                ? "max-w-md mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto"
            }`}
          >
            {leaders.map((leader) => (
              <LeaderCard key={leader.id} member={leader} />
            ))}
          </div>
        )}

        {/* Dedicated Volunteers Sub-block */}
        {volunteers.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 text-maroon font-serif text-sm font-semibold border border-gold/30">
                <HeartHandshake className="w-4 h-4 text-saffron" />
                Dedicated Sevadars & Volunteers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
              {volunteers.map((vol) => (
                <VolunteerCard key={vol.id} member={vol} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
