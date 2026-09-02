/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        land: {
          dark: '#0f172a',
          slate: '#1e293b',
          emerald: '#059669',
          accent: '#10b981',
          light: '#f8fafc',
          border: '#334155',
          gold: '#d97706',
          danger: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
