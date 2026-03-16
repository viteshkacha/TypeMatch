"use client";

// ============================================================
// page.tsx — TypeMatch: Font Pair Generator
// Main page component. Manages:
//   • Current font pair state
//   • Lock state for heading / body fonts
//   • Dark mode (persisted to localStorage)
//   • Copy CSS to clipboard
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { fontPairs, getRandomPair, type FontPair } from "../data/fontPairs";
import FontPreview from "../components/FontPreview";
import GenerateButton from "../components/GenerateButton";
import DarkModeToggle from "../components/DarkModeToggle";

// ── Initial pair (deterministic for SSR, randomized after mount) ──
const INITIAL_PAIR: FontPair = { heading: "Playfair Display", body: "Source Sans Pro" };

export default function Home() {
  // ── State ────────────────────────────────────────────────
  const [currentPair, setCurrentPair] = useState<FontPair>(INITIAL_PAIR);
  const [headingLocked, setHeadingLocked] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pairsGenerated, setPairsGenerated] = useState(0);

  // ── On mount: load dark mode preference, pick a random pair ─
  useEffect(() => {
    // Restore dark mode from localStorage
    const saved = localStorage.getItem("typematch-dark");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved !== null ? saved === "true" : prefersDark;
    setIsDark(dark);

    // Kick off with a random pair immediately
    setCurrentPair(getRandomPair());
  }, []);

  // ── Sync dark mode class on <html> ───────────────────────
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("typematch-dark", String(isDark));
  }, [isDark]);

  // ── Generate a new font pair respecting lock state ────────
  // Lock logic:
  //   headingLocked=true → keep heading, get new body only
  //   bodyLocked=true → keep body, get new heading only
  //   both locked → nothing changes
  //   both unlocked → pick a completely new pair
  const handleGenerate = useCallback(() => {
    if (headingLocked && bodyLocked) return; // both locked, do nothing

    if (headingLocked) {
      // Only change the body font; keep current heading
      const candidates = fontPairs.filter(
        (p) => p.heading === currentPair.heading && p.body !== currentPair.body
      );
      const fallback = fontPairs.filter((p) => p.body !== currentPair.body);
      const pool = candidates.length > 0 ? candidates : fallback;
      const next = pool[Math.floor(Math.random() * pool.length)];
      setCurrentPair({ heading: currentPair.heading, body: next.body });
    } else if (bodyLocked) {
      // Only change the heading font; keep current body
      const candidates = fontPairs.filter(
        (p) => p.body === currentPair.body && p.heading !== currentPair.heading
      );
      const fallback = fontPairs.filter((p) => p.heading !== currentPair.heading);
      const pool = candidates.length > 0 ? candidates : fallback;
      const next = pool[Math.floor(Math.random() * pool.length)];
      setCurrentPair({ heading: next.heading, body: currentPair.body });
    } else {
      // Both unlocked — pick a full new pair different from current
      let next = getRandomPair();
      // Avoid repeating the same exact pair
      let tries = 0;
      while (
        next.heading === currentPair.heading &&
        next.body === currentPair.body &&
        tries < 10
      ) {
        next = getRandomPair();
        tries++;
      }
      setCurrentPair(next);
    }

    setPairsGenerated((n) => n + 1);
  }, [currentPair, headingLocked, bodyLocked]);

  // ── Copy CSS to clipboard ────────────────────────────────
  async function handleCopyCss() {
    const headingEncoded = encodeURIComponent(currentPair.heading);
    const bodyEncoded = encodeURIComponent(currentPair.body);

    const css = `/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=${headingEncoded}:wght@400;600;700&family=${bodyEncoded}:wght@400;500;600&display=swap');

/* Font families */
.heading {
  font-family: '${currentPair.heading}', serif;
}

.body {
  font-family: '${currentPair.body}', sans-serif;
}`;

    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = css;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  // ── Toggle dark mode ─────────────────────────────────────
  function handleDarkToggle() {
    setIsDark((prev) => !prev);
  }

  // ── Derived: are both locked? ────────────────────────────
  const bothLocked = headingLocked && bodyLocked;

  // ── Theme classes ────────────────────────────────────────
  const bg = isDark ? "bg-slate-900" : "bg-stone-50";
  const text = isDark ? "text-slate-100" : "text-stone-900";
  const subtitleColor = isDark ? "text-slate-400" : "text-stone-500";
  const dividerColor = isDark ? "border-slate-800" : "border-stone-200";

  return (
    <main className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>

      {/* ── Subtle background grain texture ─────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "120px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <header className="flex items-start justify-between mb-12 sm:mb-16">
          <div>
            {/* Logo / wordmark */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center
                  text-sm font-bold
                  ${isDark ? "bg-amber-400 text-slate-900" : "bg-stone-900 text-white"}
                `}
              >
                Tm
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                TypeMatch
              </h1>
            </div>
            <p className={`text-sm sm:text-base ${subtitleColor} pl-12`}>
              Generate beautiful font combinations instantly.
            </p>
          </div>

          {/* Dark mode toggle */}
          <div className="flex-shrink-0 mt-1">
            <DarkModeToggle isDark={isDark} onToggle={handleDarkToggle} />
          </div>
        </header>

        {/* ── DIVIDER ────────────────────────────────────────── */}
        <div className={`border-t ${dividerColor} mb-10`} />

        {/* ── GENERATE CONTROLS ──────────────────────────────── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <GenerateButton onClick={handleGenerate} isDark={isDark} />

          {/* Copy CSS button */}
          <button
            onClick={handleCopyCss}
            className={`
              inline-flex items-center gap-2 px-6 py-4 rounded-2xl
              text-sm font-medium tracking-wide border
              transition-all duration-200 cursor-pointer active:scale-95
              ${
                isDark
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
                  : "border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300 hover:shadow-sm"
              }
              ${copied ? (isDark ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-emerald-600 border-emerald-200 bg-emerald-50") : ""}
            `}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy CSS
              </>
            )}
          </button>

          {/* Lock hint */}
          {bothLocked && (
            <span className={`text-xs ${isDark ? "text-amber-400" : "text-amber-600"} flex items-center gap-1`}>
              <span>🔒</span> Both fonts locked — unlock one to generate
            </span>
          )}
        </section>

        {/* ── FONT PREVIEW + INFO ─────────────────────────────── */}
        <FontPreview
          headingFont={currentPair.heading}
          bodyFont={currentPair.body}
          headingLocked={headingLocked}
          bodyLocked={bodyLocked}
          onToggleHeadingLock={() => setHeadingLocked((l) => !l)}
          onToggleBodyLock={() => setBodyLocked((l) => !l)}
          isDark={isDark}
        />

        {/* ── FOOTER STATS ────────────────────────────────────── */}
        <footer className={`mt-16 pt-8 border-t ${dividerColor} flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <p className={`text-xs ${subtitleColor}`}>
            {fontPairs.length} curated font pairs — generated {pairsGenerated} combo{pairsGenerated !== 1 ? "s" : ""} so far
          </p>
          <p className={`text-xs ${subtitleColor}`}>
            Fonts served by{" "}
            <a
              href="https://fonts.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 ${isDark ? "hover:text-slate-200" : "hover:text-stone-800"}`}
            >
              Google Fonts
            </a>
          </p>
        </footer>

      </div>
    </main>
  );
}
