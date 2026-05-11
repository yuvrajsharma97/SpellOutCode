/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#141210",
          2: "#3a3632",
          3: "#6b6560",
          4: "#a09b96",
        },
        paper: {
          DEFAULT: "#f8f6f2",
          2: "#f1ede6",
          3: "#e8e2d9",
        },
        rule: "#d4cec6",
        accent: {
          DEFAULT: "#2563a8",
          dim: "#dde8f5",
        },
        success: {
          DEFAULT: "#2d6a4f",
          bg: "#dcf5e8",
        },
        danger: {
          DEFAULT: "#b91c1c",
          bg: "#fef2f2",
        },
        warn: {
          DEFAULT: "#7a5c0a",
          bg: "#f5f0dc",
        },
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      fontSize: {
        "2xs": ["10px", { letterSpacing: "0.05em" }],
        xs: ["11px", { letterSpacing: "0.03em" }],
        sm: ["13px", { lineHeight: "1.6" }],
        base: ["15px", { lineHeight: "1.7" }],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(20, 18, 16, 0.06)",
        card: "0 1px 6px rgba(20, 18, 16, 0.08)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
        200: "200ms",
      },
    },
  },
  plugins: [],
};
