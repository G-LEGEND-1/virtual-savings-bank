/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bank-blue': {
          50: '#f0f5ff',
          100: '#e6f0ff',
          200: '#c3d9ff',
          300: '#91b3ff',
          400: '#5885ff',
          500: '#2d5cc2',
          600: '#1a3a8f',
          700: '#0f2a6b',
          800: '#091e47',
          900: '#051329',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
