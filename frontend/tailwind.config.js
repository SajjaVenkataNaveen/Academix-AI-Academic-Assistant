/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        brand: { 50: '#eef5ff', 100: '#d9e9ff', 500: '#2864dc', 600: '#1f52bc', 700: '#1d4495', 900: '#172d5f' },
        teal: { 50: '#edfcf8', 500: '#0d9488', 600: '#0f766e' },
      },
      boxShadow: { soft: '0 12px 40px rgba(23, 32, 51, 0.08)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
