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
      screens: {
        // 기본 width 기반 스크린이 있다면 그대로 두고...
        "h730": { raw: "(max-height: 730px)" }, // 커스텀 미디어 쿼리
        "h700": { raw: "(max-height: 700px)" }, // 커스텀 미디어 쿼리
        "h670": { raw: "(max-height: 670px)" }, // 커스텀 미디어 쿼리
        "h650": { raw: "(max-height: 650px)" }, // 커스텀 미디어 쿼리
        "h620": { raw: "(max-height: 620px)" }, // 커스텀 미디어 쿼리
        "h600": { raw: "(max-height: 600px)" }, // 커스텀 미디어 쿼리
        "h550": { raw: "(max-height: 550px)" }, // 커스텀 미디어 쿼리
      },
      colors: {
        // Neutral colors
        white: "#FFFFFF",
        bggray: "#F3F5F8",
        whitegray: "#FCFCFC",
        lightgray: "#D1D6DB",
        gray: "#8B95A1",
        darkgray: "#4E5968",
        black: "#191F28",
        strokeblack: "rgba(25, 31, 40, 0.08)",
        brightblack: "#0E0E0E",

        // Rainbow colors
        red: "#F04452",
        bgred: "#FCE1E3",
        blue: "#3182F6",
        bgblue: "#DEEBFE",
        yellow: "#FCE34C",
        bgyellow: "#FFF3DE",

        background: "#FFFFFF",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
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
