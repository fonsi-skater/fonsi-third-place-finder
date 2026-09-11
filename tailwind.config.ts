import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#1B3A2F",
        sand: "#F0E6D2",
        ember: "#E8562F",
        ink: "#16241D",
        muted: "#5C6B62",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
