"use client";

// ============================================================
// DarkModeToggle.tsx
// Reads/writes the user's dark mode preference from localStorage
// and toggles the `dark` class on the <html> element (Tailwind
// dark mode strategy: "class").
// ============================================================

import { useEffect, useState } from "react";

interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative inline-flex items-center gap-2 px-3 py-2 rounded-full
        border transition-all duration-300 cursor-pointer select-none
        text-sm font-medium tracking-wide
        ${
          isDark
            ? "bg-slate-800 border-slate-600 text-amber-300 hover:bg-slate-700"
            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
        }
      `}
    >
      {/* Animated sun/moon icon */}
      <span
        className="text-base transition-transform duration-500"
        style={{ transform: isDark ? "rotate(360deg)" : "rotate(0deg)" }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
      <span className="hidden sm:inline">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
