import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Page background — soft purple wash
        bg: "#F5EEFF",
        // Cards, panels
        surface: "#FFFFFF",
        // Hairlines, dividers
        border: { DEFAULT: "#E8E8F0" },
        // Sidebar, header, hero background / Footer top border
        panel: { DEFAULT: "#460073", alt: "#1E1E2E" },
        // Text
        text: {
          primary: "#0F0F1A",
          secondary: "#4A4A5A",
          inverse: "#FFFFFF",
          onDarkMuted: "#E5CCFF",
        },
        // Brand accent — primary actions, links, active states
        accent: {
          DEFAULT: "#A100FF",
          hover: "#7500C0",
          deep: "#460073",
          tint: "#F5EEFF",
          tint2: "#E5CCFF",
        },
        // Semantic states
        success: { DEFAULT: "#00875F", bg: "#E6F9F4" },
        warning: { DEFAULT: "#C94F10", bg: "#FFF2EC", accent: "#FF6B35" },
        danger: { DEFAULT: "#B5001F", bg: "#FFEDF0" },
        info: { DEFAULT: "#2A5CC7", bg: "#EEF4FF" },
        neutralBadge: { DEFAULT: "#4A4A5A", bg: "#F0F0F6" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        // Subtle card elevation — matches dashboard card treatment in design files
        card: "0 1px 4px 0 rgba(0,0,0,0.08), 0 0 1px 0 rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
