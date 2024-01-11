/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  mode: "jit",
  content: [
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "9/16": "9 / 16",
      },
      screens: {
        // sm: "740px",
        mob: "1024px",
        "mob-max": { max: "1024px" },
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
      colors: {
        secondary: "#E7EAEF",
        tc: {
          primary: "#000000",
          "primary-alt": "#1C86EC",
          "primary-alt-dark": "#0060BB",
          secondary: "#99A1A8",
          ternary: "#D7DCE2",
          icon: "#717D8A",
          input: "#F6F8FA",
          user: "#C1CCD5",
          gray: "#F5F7F7",
          "radio-ring": "#D7DCE2",
          "btn-hover": "#0c0d0d",
          dashboard: "#E7EAEF",
          border: "#F0F2F4",
          "border-dark": "#C4D1D6",
          "card-border": "#DEE3E9",
          "pallet-focused": "#D7DCE2",
        },
      },
      fontSize: {
        "tc-xs": ["10px", "11px"],
        "tc-sm": ["12px", "15px"],
        "tc-base": ["16px", "19px"],
        "tc-base-24": ["16px", "24px"],
        "tc-xl": ["20px", "24px"],
        "tc-2xl": ["24px", "29px"],
        "tc-3xl": ["32px", "39px"],
        "tc-landing-h1": ["60px", "70px"],
        "tc-landing-h1-mob": ["48px", "58px"],
        "tc-16": ["16px", "22px"],
        "tc-18": ["18px", "20px"],
        "tc-18-26": ["18px", "26px"],
        "tc-20": ["20px", "24px"],
        "tc-24": ["24px", "28px"],
        "tc-32-38": ["32px", "38px"],
        "tc-32-48": ["32px", "48px"],
        "tc-48": ["48px", "58px"],
      },
      borderRadius: {
        phone: "60px",
        "phone-sm": "40px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    require("flowbite/plugin"),
  ],
};
