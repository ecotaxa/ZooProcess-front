/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // or 'media' if you prefer system settings
  theme: {
    extend: {
      // You can extend the default Tailwind theme here
      colors: {
        // Example custom colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // Add more custom fonts if needed
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins you might need
  ],
  // This ensures compatibility with the HeroUI components
  corePlugins: {
    preflight: true,
  },
}
