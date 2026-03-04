/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {primary: "rgba(var(--primary-rgb), <alpha-value>)",},
    },
  },
  plugins: [],
};
