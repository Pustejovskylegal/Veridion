import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070A",
          900: "#0A0D12",
          850: "#0E1218",
          800: "#12161D",
          700: "#1A1F28",
          600: "#252B36",
          500: "#3A4150",
        },
        navy: {
          950: "#060A14",
          900: "#0A1224",
          800: "#0F1A30",
          700: "#172648",
        },
        silver: {
          50: "#F5F7FA",
          100: "#E6EAF1",
          200: "#C9D0DC",
          300: "#9AA3B4",
          400: "#6C7587",
          500: "#4A5160",
        },
        accent: {
          400: "#8CB4FF",
          500: "#5E8BFF",
          600: "#3E6BE0",
          700: "#2A4CB8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter2: "-0.03em",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(94,139,255,0.18), transparent 60%)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 3s linear infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "scan-line": "scanLine 6s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
