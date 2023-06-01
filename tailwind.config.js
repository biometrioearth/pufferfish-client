/** @type {import('tailwindcss').Config} */

// tailwind.config.js
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          darker: "#0A330E",
          DEFAULT: "#164A1A",
          lighter: "#227028",
        },
        "light-green": {
          darker: "#B7F97E",
          DEFAULT: "#D2FFAB",
          lighter: "#EAFFD8",
        },
        black: "#1D1D1B",
        mud: "#96967D",
        "mid-grey": "#F2EEE3",
        "dark-blue": "#034752",
        "light-blue": "#2D8FE8",
        rose: "#FCBBFF",
      },
      fontSize: {
        "h1-desktop": "96px",
        "h1-mobile": "48px",
        "h2-desktop": "56px",
        "h2-mobile": "42px",
        "h3-desktop": "42px",
        "h3-mobile": "32px",
        "h4-desktop": "32px",
        "h4-mobile": "24px",
        "h5-desktop": "18px",
        "h5-mobile": "17px",
        "highlight-paragraph-desktop": "18px",
        "highlight-paragraph-mobile": "17px",
        "body-text-desktop": "16px",
        "body-text-mobile": "16px",
        "highlight-in-text-desktop": "16px",
        "highlight-in-text-mobile": "16px",
        "links-in-text-desktop": "16px",
        "links-in-text-mobile": "16px",
        "button-in-text-desktop": "16px",
        "button-in-text-mobile": "16px",
        "tertiary-button-text-desktop": "20px",
        "tertiary-button-text-mobile": "18px",
        "image-caption-desktop": "15px",
        "image-caption-mobile": "15px",
        "quote-desktop": "42px",
        "quote-mobile": "36px",
      },
      fontFamily: {
        "cormorant-garamond": ["Cormorant Garamond Medium", "serif"],
        "made-thommy": ["MADE THOMMY medium", "sans-serif"],
      },
    },
  },
  variants: {},
  plugins: [],
};
