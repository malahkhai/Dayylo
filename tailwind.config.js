/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#30e8ab",
        background: {
          light: "#f6f8f7",
          dark: "#0a0a0a",
        },
        surface: {
          dark: "#1c1c1e",
          "dark-alt": "#2c2c2e",
        }
      },
    },
  },
  plugins: [],
}
