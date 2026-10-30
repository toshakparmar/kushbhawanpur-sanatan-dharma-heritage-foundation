import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function OmIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sacred Om Glyph contours */}
      <path d="M7 11.5c-1.8 0-3.5-1.2-3.5-3.2C3.5 6.2 5.2 5 7.2 5c2.4 0 4.3 1.6 4.3 3.8 0 2.2-1.7 3.5-3.5 3.7 2.2.3 4.5 1.8 4.5 4.5 0 2.8-2.3 4.8-5.3 4.8-2.6 0-4.7-1.7-4.7-4.2" />
      <path d="M12 12.5c2.5 0 5 1.5 5.5 4.2.4 2.2-.8 4.5-2.5 5.1" />
      <path d="M17.5 4.5c1.8 1.2 3.5 1.2 4.5.3" />
      <circle cx="19.5" cy="3" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function BookIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1.5-5-1.5-5 1.5-5 1.5V6z" />
      <path d="M12 6s1.5-2 5-2 5 2 5 2v14s-1.5-1.5-5-1.5-5 1.5-5 1.5V6z" />
      {/* Diya flame in center */}
      <path d="M12 10.5c.6-.8 1-1.3 1-2 0-.8-.4-1.5-1-2.2-.6.7-1 1.4-1 2.2 0 .7.4 1.2 1 2z" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function CowIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Reverent silhouette lines of Gau Mata */}
      <path d="M4 14c0 3 2.5 5 6 5h7c2 0 3-1.5 3-3.5v-3c0-2-1.5-3.5-3.5-3.5H14l-2-3H8L6.5 9C5 9.5 4 11 4 14z" />
      <path d="M7 6c-.5-1.5-1.5-2.5-3-2.5" />
      <path d="M11 6c.5-1.5 1.5-2.5 3-2.5" />
      <path d="M7 19v3" />
      <path d="M17 17.5v4.5" />
      <circle cx="8" cy="11.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function TreeIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sacred Tree / Kalpavriksha Canopy & Roots */}
      <path d="M12 21v-7" />
      <path d="M12 14c-1.5 0-3-1-3-2.5 0-1 1-2 2-2 0-2 2-4 4-3.5 1.5.3 2.5 1.8 2.5 3.5 1.5 0 2.5 1.2 2.5 2.5 0 1.5-1.5 2-3 2" />
      <path d="M9 16c-2.5 0-4-1.5-4-3.5 0-1.8 1.5-3 3-3" />
      <path d="M9 21c1-1 2-2 3-2s2 1 3 2" />
    </svg>
  );
}

export function TempleIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sacred Shikhara & Kalash */}
      <path d="M12 2v2" />
      <path d="M11 4h2" />
      <path d="M12 4l-4 8h8l-4-8z" />
      <path d="M6 12h12v3H6v-3z" />
      <path d="M4 15h16v6H4v-6z" />
      <path d="M10 21v-3a2 2 0 0 1 4 0v3" />
    </svg>
  );
}

export function StorySymbolIcon({
  name,
  size = 24,
  className
}: {
  name: "om" | "book" | "cow" | "tree" | "temple";
  size?: number | string;
  className?: string;
}) {
  switch (name) {
    case "om":
      return <OmIcon size={size} className={className} />;
    case "book":
      return <BookIcon size={size} className={className} />;
    case "cow":
      return <CowIcon size={size} className={className} />;
    case "tree":
      return <TreeIcon size={size} className={className} />;
    case "temple":
      return <TempleIcon size={size} className={className} />;
    default:
      return null;
  }
}
