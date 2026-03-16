"use client";

// ============================================================
// GenerateButton.tsx
// The primary CTA button that triggers a new font pair
// generation. Shows a subtle shuffle animation when clicked.
// ============================================================

import { useState } from "react";

interface Props {
  onClick: () => void;
  isDark: boolean;
}

export default function GenerateButton({ onClick, isDark }: Props) {
  const [spinning, setSpinning] = useState(false);

  function handleClick() {
    setSpinning(true);
    onClick();
    // Reset animation after a short delay
    setTimeout(() => setSpinning(false), 600);
  }

  return (
    <button
      onClick={handleClick}
      className={`
        group relative inline-flex items-center gap-3
        px-8 py-4 rounded-2xl
        font-semibold text-base tracking-wide
        transition-all duration-300 ease-out
        active:scale-95 cursor-pointer
        ${
          isDark
            ? `bg-amber-400 text-slate-900 hover:bg-amber-300
               shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40`
            : `bg-stone-900 text-white hover:bg-stone-700
               shadow-lg shadow-stone-900/15 hover:shadow-stone-900/30`
        }
      `}
    >
      {/* Shuffle / dice icon */}
      <svg
        className={`w-5 h-5 transition-transform duration-500
          ${spinning ? "rotate-180" : "group-hover:rotate-12"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
      </svg>
      Generate Pair
    </button>
  );
}
