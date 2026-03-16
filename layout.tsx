// ============================================================
// layout.tsx — Root layout
// Loads the Playfair Display font for the logo/wordmark.
// The `dark` class is toggled on <html> by client-side JS
// (via useEffect in page.tsx), which Tailwind's dark: variant picks up.
// ============================================================

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TypeMatch — Font Pair Generator",
  description:
    "Discover beautiful Google Font combinations instantly. Preview, lock, and copy CSS for perfect typography pairings.",
  keywords: ["fonts", "typography", "Google Fonts", "font pairing", "design tools"],
  openGraph: {
    title: "TypeMatch — Font Pair Generator",
    description: "Discover beautiful Google Font combinations instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Preconnect to Google Fonts for performance */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Playfair Display for the app wordmark */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
        {/* Prevent dark mode flash on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('typematch-dark');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var dark = saved !== null ? saved === 'true' : prefersDark;
                  if (dark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
