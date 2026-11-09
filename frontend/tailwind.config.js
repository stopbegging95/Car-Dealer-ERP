/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        dark: "#0F172A",
        light: "#F8FAFC",
        blue: {
          DEFAULT: "#2563EB",
          deep: "#1D4ED8",
          light: "#EFF6FF",
        },
      },
    },
  },
  plugins: [],
};

