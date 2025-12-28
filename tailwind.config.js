/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#30e8ab",
        accent: {
          blue: "#3b82f6",
          orange: "#f97316",
        },
        background: {
          light: "#f6f8f7",
          dark: "#0a0a0a",
        },
        surface: {
          light: "#ffffff",
          dark: "#1c1c1e",
          "dark-alt": "#2c2c2e",
        }
      },
    },
  },
  plugins: [],
}
