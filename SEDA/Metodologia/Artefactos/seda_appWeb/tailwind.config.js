/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          light: '#F8EFEA',
          DEFAULT: '#EED6C4',
          dark: '#E2C4B1',
          accent: '#9A6B4C', // Terracota brown from login buttons
        },
        seda: {
          dark: '#262626',
          charcoal: '#374151',
          accent: '#7C3AED',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
