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
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-12px)",
          },
        },

        "blob-move": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -40px) scale(1.05)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.97)",
          },
        },

        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        blob: "blob-move 12s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  
  plugins: [],
};