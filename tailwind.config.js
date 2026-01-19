/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF", // System Blue
        secondary: "#34C759", // System Green
        accent: {
          blue: "#007AFF",
          green: "#34C759",
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
