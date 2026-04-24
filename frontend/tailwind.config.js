/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "SF Pro Text", "ui-sans-serif", "system-ui"],
        display: [
          "Geist",
          "Inter",
          "SF Pro Display",
          "ui-sans-serif",
          "system-ui",
        ],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#dbe5ff",
          500: "#4f7cff",
          600: "#3c63eb",
          700: "#324fc6",
        },
        cyanx: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      boxShadow: {
        glow: "0 20px 40px rgba(79, 124, 255, 0.28)",
        glass: "0 10px 30px rgba(15, 23, 42, 0.12)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
