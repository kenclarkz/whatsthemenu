"use client";

import { useState } from "react";

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #ffb347, #ff5a3c)",
  "linear-gradient(135deg, #ff5a3c, #e63975)",
  "linear-gradient(135deg, #ffa62b, #e63975)",
  "linear-gradient(135deg, #3f9142, #0ea5b5)",
  "linear-gradient(135deg, #7c5cff, #e63975)",
];

export const FOOD_EMOJI: Record<string, string> = {
  Breakfast: "🥞",
  Pasta: "🍝",
  Pizza: "🍕",
  Mexican: "🌮",
  Asian: "🍜",
  Indian: "🍛",
  "Comfort Food": "🍲",
  Healthy: "🥗",
  Seafood: "🍤",
  Soup: "🥣",
  Salad: "🥙",
  Dessert: "🍰",
};

export default function FoodImage({
  src,
  alt,
  category,
  className = "",
  sizes,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    const gradient =
      FALLBACK_GRADIENTS[
        Math.abs(hash(alt)) % FALLBACK_GRADIENTS.length
      ];
    return (
      <div
        aria-label={alt}
        role="img"
        className={`${className} flex items-center justify-center`}
        style={{ background: gradient }}
      >
        <span className="text-[clamp(2rem,8vw,4.5rem)] drop-shadow-lg">
          {FOOD_EMOJI[category ?? ""] ?? "🍽️"}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
