/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Archivo"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          cyan: '#00e5ff',
          gold: '#f59e0b',
          pink: '#f43f5e',
          argentina: '#75aadb',
          barca: '#a50044',
          miami: '#f7b5cd',
        },
        dark: {
          bg: '#090a0f',
          surface: '#11131a',
          card: '#161923',
          border: '#232736',
          hover: '#1d2230',
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
