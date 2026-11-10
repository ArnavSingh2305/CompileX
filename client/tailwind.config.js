import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const c = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        serif: ["Georgia", "Iowan Old Style", "Palatino Linotype", "ui-serif", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
      },
      colors: {
        bg: c("--c-bg"),
        side: c("--c-side"),
        fg: c("--c-fg"),
        code: c("--c-code"),
        link: c("--c-link"),
        accent: {
          DEFAULT: c("--c-accent"),
          hover: c("--c-accent-hover"),
          fg: c("--c-accent-fg"),
        },
      },
      boxShadow: {
        pop: "var(--shadow-pop)",
        card: "var(--shadow-card)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [typography],
};
