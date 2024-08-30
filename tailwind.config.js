/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    colors: {
      white: "#FFFFFF",
      atmosphere: "#00ADEA",
      almostwhite: "#F2F5F8",
      pimp: "#7239ea",
      pavement: "#b4bacc",
      grass: "#5cc858",
      autumn: "#fa8724",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        gray: {
          50: "#CECCCC",
          100: "#ADAAAA",
          200: "#6B6766",
          300: "#292722",
          400: "#080700",
          500: "#080700",
          600: "#070700",
        },
        atmosphere: {
          50: "#88FDC1",
          100: "#66F9CC",
          200: "#44F5E1",
          300: "#00ADEA",
          400: "#006CD0",
          500: "#0035B6",
          600: "#00099A",
        },
        almostwhite: {
          50: "#F7FBFB",
          100: "#F4F7F9",
          200: "#F2F5F8",
          300: "#D4D5D9",
          400: "#B5B6BA",
          500: "#98979B",
          600: "#7A797C",
        },
        pimp: {
          50: "#9DC5FB",
          100: "#839FF8",
          200: "#6651EF",
          300: "#7239EA",
          400: "#852FD0",
          500: "#9026B4",
          600: "#931E98",
        },
        pavement: {
          50: "#DBE8E8",
          100: "#D1DEE1",
          200: "#b4bacc",
          300: "#9D9EB3",
          400: "#8A869A",
          500: "#767080",
          600: "#615967",
        },
        grass: {
          50: "#DCE9AE",
          100: "#A6D982",
          200: "#5CC858",
          300: "#4BB15D",
          400: "#3F9962",
          500: "#338162",
          600: "#28685C",
        },
        autumn: {
          50: "#FF92B2",
          100: "#FF7583",
          200: "#FE733E",
          300: "#FA8724",
          400: "#DE9F1C",
          500: "#BFAE15",
          600: "#959F10",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
