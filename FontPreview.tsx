"use client";

// ============================================================
// FontPreview.tsx
// Renders the live typography preview using the selected
// heading/body fonts. Also displays the Font Info section and
// the per-font lock toggles.
//
// Lock logic:
//   - locked heading → only body changes on Generate
//   - locked body → only heading changes on Generate
//   - both locked → nothing changes
//   - both unlocked → both change
// ============================================================

import { useEffect } from "react";

interface Props {
  headingFont: string;
  bodyFont: string;
  headingLocked: boolean;
  bodyLocked: boolean;
  onToggleHeadingLock: () => void;
  onToggleBodyLock: () => void;
  isDark: boolean;
}

// ── Dynamically inject a <link> tag to load a Google Font ──
function loadGoogleFont(font: string) {
  if (typeof window === "undefined") return;
  const id = `gfont-${font.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return; // already loaded

  const encoded = encodeURIComponent(font);
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

// ── LockButton sub-component ─────────────────────────────────
function LockButton({
  locked,
  onToggle,
  isDark,
}: {
  locked: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={locked ? "Unlock font" : "Lock font"}
      title={locked ? "Unlock this font" : "Lock this font"}
      className={`
        p-2 rounded-lg transition-all duration-200 cursor-pointer
        ${
          locked
            ? isDark
              ? "bg-amber-400/20 text-amber-300 hover:bg-amber-400/30"
              : "bg-amber-100 text-amber-600 hover:bg-amber-200"
            : isDark
            ? "text-slate-500 hover:text-slate-300 hover:bg-slate-700"
            : "text-stone-300 hover:text-stone-500 hover:bg-stone-100"
        }
      `}
    >
      {locked ? (
        // Locked icon
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1C9.243 1 7 3.243 7 6v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v2H9V6c0-1.654 1.346-3 3-3zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      ) : (
        // Unlocked icon
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1C9.243 1 7 3.243 7 6v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H9V6c0-1.654 1.346-3 3-3 1.394 0 2.545.952 2.88 2.241l1.94-.486A5.003 5.003 0 0 0 12 1zm0 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      )}
    </button>
  );
}

export default function FontPreview({
  headingFont,
  bodyFont,
  headingLocked,
  bodyLocked,
  onToggleHeadingLock,
  onToggleBodyLock,
  isDark,
}: Props) {
  // Load fonts from Google Fonts whenever they change
  useEffect(() => {
    loadGoogleFont(headingFont);
  }, [headingFont]);

  useEffect(() => {
    loadGoogleFont(bodyFont);
  }, [bodyFont]);

  const cardBase = isDark
    ? "bg-slate-800/60 border-slate-700/60"
    : "bg-white border-stone-100";

  const mutedText = isDark ? "text-slate-400" : "text-stone-400";
  const labelText = isDark ? "text-slate-300" : "text-stone-500";
  const fontNameText = isDark ? "text-slate-100" : "text-stone-800";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ── Typography Preview Card ─────────────────────────── */}
      <div
        className={`
          w-full rounded-3xl border p-8 sm:p-12
          transition-all duration-500 ease-out
          ${cardBase}
        `}
      >
        {/* Heading preview */}
        <h2
          className={`
            text-4xl sm:text-5xl lg:text-6xl font-bold mb-6
            leading-tight tracking-tight
            transition-all duration-500
            ${isDark ? "text-white" : "text-stone-900"}
          `}
          style={{ fontFamily: `'${headingFont}', serif` }}
        >
          The Future of Design
        </h2>

        {/* Divider */}
        <div
          className={`
            w-16 h-px mb-6
            ${isDark ? "bg-slate-600" : "bg-stone-200"}
          `}
        />

        {/* Body preview */}
        <p
          className={`
            text-lg sm:text-xl leading-relaxed max-w-2xl
            transition-all duration-500
            ${isDark ? "text-slate-300" : "text-stone-600"}
          `}
          style={{ fontFamily: `'${bodyFont}', sans-serif` }}
        >
          Good typography improves readability and creates better user
          experiences. The right font combination can elevate a design from
          ordinary to extraordinary — it sets the tone, conveys personality,
          and guides the reader's eye with effortless clarity.
        </p>

        {/* Alphabet sample */}
        <p
          className={`mt-8 text-sm tracking-widest opacity-50 ${mutedText}`}
          style={{ fontFamily: `'${bodyFont}', sans-serif` }}
        >
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv
          Ww Xx Yy Zz
        </p>
      </div>

      {/* ── Font Info Section ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Heading font card */}
        <div
          className={`
            rounded-2xl border p-5 flex items-center justify-between
            transition-all duration-300
            ${cardBase}
            ${headingLocked
              ? isDark
                ? "ring-2 ring-amber-400/40"
                : "ring-2 ring-amber-300/60"
              : ""
            }
          `}
        >
          <div className="flex flex-col gap-1 min-w-0">
            <span className={`text-xs font-semibold uppercase tracking-widest ${labelText}`}>
              Heading Font
            </span>
            <span
              className={`text-lg font-semibold truncate ${fontNameText}`}
              style={{ fontFamily: `'${headingFont}', serif` }}
            >
              {headingFont}
            </span>
            {headingLocked && (
              <span className={`text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                🔒 Locked
              </span>
            )}
          </div>
          <LockButton
            locked={headingLocked}
            onToggle={onToggleHeadingLock}
            isDark={isDark}
          />
        </div>

        {/* Body font card */}
        <div
          className={`
            rounded-2xl border p-5 flex items-center justify-between
            transition-all duration-300
            ${cardBase}
            ${bodyLocked
              ? isDark
                ? "ring-2 ring-amber-400/40"
                : "ring-2 ring-amber-300/60"
              : ""
            }
          `}
        >
          <div className="flex flex-col gap-1 min-w-0">
            <span className={`text-xs font-semibold uppercase tracking-widest ${labelText}`}>
              Body Font
            </span>
            <span
              className={`text-lg font-semibold truncate ${fontNameText}`}
              style={{ fontFamily: `'${bodyFont}', sans-serif` }}
            >
              {bodyFont}
            </span>
            {bodyLocked && (
              <span className={`text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                🔒 Locked
              </span>
            )}
          </div>
          <LockButton
            locked={bodyLocked}
            onToggle={onToggleBodyLock}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}
