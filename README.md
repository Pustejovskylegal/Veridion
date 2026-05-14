# Veridion — Landing page

Premium dark-mode landing page pro Veridion: AI workspace pro veřejné zakázky.

## Spuštění

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Stack

- Next.js 14 (App Router)
- React 18
- TailwindCSS 3
- Framer Motion 11
- Lucide React (ikony)
- TypeScript

## Architektura

```
app/
  layout.tsx        # Root layout, Inter font, dark mode
  page.tsx          # Sekce poskládané za sebou
  globals.css       # Tailwind, utility třídy (glass, hairline, gradients)

components/
  Nav.tsx           # Sticky glass navigace
  Hero.tsx          # Hero + dashboard + floating cards
  DashboardMock.tsx # Realistický enterprise dashboard
  FloatingCards.tsx # AI notifikační karty
  Trust.tsx         # Stats + logo marquee
  Features.tsx      # 5 feature bloků s mockupy
  Platform.tsx      # Ekosystém modulů s animovaným grafem
  Security.tsx      # Enterprise security pilíře + DPA tabulka
  FinalCTA.tsx      # Cinematic závěrečný CTA
  Footer.tsx        # Footer s odkazy

lib/utils.ts        # cn() helper
```
