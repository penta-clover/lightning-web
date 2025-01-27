import type { Config } from "tailwindcss";
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral colors
        white: "#FFFFFF",
        bggray: "#F3F5F8",
        lightgray: "#D1D6DB",
        gray: "#8B95A1",
        darkgray: "#4E5968",
        black: "#191F28",
        strokeblack: "rgba(25, 31, 40, 0.08)",

        // Rainbow colors
        red: "#F04452",
        bgred: "#FCE1E3",
        blue: "#3182F6",
        bgblue: "#DEEBFE",
        yellow: "#FCE34C",
        bgyellow: "#FFF3DE",
      },
      fontSize: {
        heading24: ["24px", { lineHeight: "28px", letterSpacing: "-0.6px" }],
        heading20: ["20px", { lineHeight: "24px", letterSpacing: "-0.6px" }],
        body16: ["16px", { lineHeight: "24px", letterSpacing: "-0.6px" }],
        body14: ["14px", { lineHeight: "18px", letterSpacing: "-0.6px" }],
        caption12: ["12px", { lineHeight: "16px", letterSpacing: "-0.6px" }],
      },
    },
  },
  plugins: [scrollbarHide],
} satisfies Config;