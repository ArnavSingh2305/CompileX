/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      colors: {
        ivory: "#FDF9F6",
        blush: "#FBEFEC",

        navy: {
          50: "#F4F6FB",
          900: "#0B0E1A",
          950: "#080B16",
        },

        coral: "#FF6F61",

        accent: {
          pink: "#EC4899",
          purple: "#A855F7",
          blue: "#6366F1",
        },
      },

      backgroundImage: {
        "gradient-warm":
          "linear-gradient(135deg, #FBEFEC 0%, #F3E8FF 50%, #E0E7FF 100%)",

        "gradient-brand":
          "linear-gradient(135deg, #EC4899 0%, #A855F7 50%, #6366F1 100%)",

        "gradient-dark":
          "linear-gradient(135deg, #080B16 0%, #150F2E 50%, #0B0E1A 100%)",
      },
    },
  },

  plugins: [],
};