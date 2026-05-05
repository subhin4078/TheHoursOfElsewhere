/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        accent: "#d4aa70",
      },
      boxShadow: {
        card: "0 20px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        float: "0 8px 32px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
