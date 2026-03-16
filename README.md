# TypeMatch — Font Pair Generator

A modern web app for discovering beautiful Google Font combinations. Built with **Next.js 14 App Router**, **React**, and **Tailwind CSS**.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Generate Pair** | Randomly pick from 500+ curated font combinations |
| **Live Preview** | Heading + body text update instantly with new fonts |
| **Lock Fonts** | Lock heading or body font to explore the other axis |
| **Copy CSS** | One-click copy of `@import` URL + `font-family` rules |
| **Dark Mode** | Light/dark toggle, persisted to `localStorage` |
| **Responsive** | Fully mobile-friendly layout |
| **Dynamic Loading** | Fonts injected from Google Fonts on demand |

---

## 🗂 Project Structure

```
typematch/
├── app/
│   ├── layout.tsx          # Root layout, metadata, dark mode flash fix
│   ├── page.tsx            # Main page — state management hub
│   └── globals.css         # Tailwind base + custom animations
├── components/
│   ├── FontPreview.tsx     # Typography preview + font info + lock buttons
│   ├── GenerateButton.tsx  # Primary CTA with shuffle animation
│   └── DarkModeToggle.tsx  # Sun/moon toggle button
├── data/
│   └── fontPairs.ts        # 500 curated Google Font pairs + helper
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Local Development

### 1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel (Recommended)

Vercel is the official hosting platform for Next.js — deployment is zero-config.

### Option A: Deploy via Vercel CLI

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Inside the project directory:
vercel

# Follow the prompts:
#   - Link to your Vercel account
#   - Accept the auto-detected Next.js framework settings
#   - Done! You'll get a live URL instantly.
```

### Option B: Deploy via GitHub (One-click)

1. Push this project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/typematch.git
   git push -u origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Click **Import Git Repository** and select your repo
4. Leave all settings as default (Next.js is auto-detected)
5. Click **Deploy**

Your app will be live in ~60 seconds at a `.vercel.app` URL.

### Option C: Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy the .next/ folder via Netlify CLI
npm install -g netlify-cli
netlify deploy --dir=.next --prod
```

> **Note:** For Netlify, install `@netlify/plugin-nextjs` for full App Router support.

---

## 🧠 Key Implementation Notes

### Font Loading
Google Fonts are loaded **on demand** by injecting `<link>` tags into `document.head` when a font is first used. This avoids loading all 500 fonts upfront.

```typescript
// components/FontPreview.tsx
function loadGoogleFont(font: string) {
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}
```

### Lock Logic
```
headingLocked=true  → only body changes
bodyLocked=true     → only heading changes
both locked         → nothing changes (user sees a hint)
both unlocked       → full random pair selected
```

### Dark Mode
- Tailwind `darkMode: "class"` strategy
- `dark` class toggled on `<html>` element
- Preference saved to `localStorage`
- Inline script in `<head>` prevents flash on page reload

---

## 🎨 Customizing

To add more font pairs, edit `data/fontPairs.ts`:

```typescript
export const fontPairs: FontPair[] = [
  // Add your pair here:
  { heading: "Your Heading Font", body: "Your Body Font", category: "custom" },
  // ...
];
```

Any valid Google Fonts name will work — the app loads them dynamically.

---

## 📄 License

MIT — free to use, modify, and distribute.
