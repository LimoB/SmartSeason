export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        /* ================= BRAND ================= */
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },

        /* ================= LIGHT MODE (CLEAN SaaS) ================= */
        light: {
          bg: "#ffffff",        // pure white (fix readability issue)
          surface: "#f8fafc",   // cards / sections
          surface2: "#f1f5f9",  // hover
          border: "#e2e8f0",    // borders
          text: "#0f172a",      // strong readable text
          muted: "#475569",     // better contrast than 64748b
        },

        /* ================= DARK MODE (MODERN BLUE THEME) ================= */
        dark: {
          bg: "#050B1E",        // deep navy base
          surface: "#0A1A3A",   // cards
          surface2: "#102A5C",  // hover / elevated
          border: "#1E335A",    // subtle border
          text: "#E6F0FF",      // main text
          muted: "#A3B4D4",     // improved readability
        },

        /* ================= ACCENTS ================= */
        accent: {
          blue: "#3B82F6",
          indigo: "#6366F1",
          sky: "#38BDF8",
        },
      },
    },
  },

  plugins: [],
};