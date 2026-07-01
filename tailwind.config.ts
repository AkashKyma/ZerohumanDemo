import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        sand: "#f8f5f0",
        brand: {
          DEFAULT: "#1d4ed8",
          dark: "#1e3a8a",
          light: "#dbeafe"
        },
        accent: "#ea580c"
      },
      boxShadow: {
        soft: "0 18px 40px -20px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
