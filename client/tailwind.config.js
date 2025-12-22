/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#7c3aed",
        "primary-dark": "#6a0dad",
        "secondary": "#bca7e8",
        "shadow-plum": "#4b0082",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "input-border": "#e0cfff",
        "input-bg": "#f3e8ff",
      },
      fontFamily: {
        "display": ["Inter"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
      backgroundImage: {
          "gradient-purple": "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}