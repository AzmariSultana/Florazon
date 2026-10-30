/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Same tokens as the storefront so both apps share one design language
      colors: {
        brand: { DEFAULT: '#C586A5', soft: '#ffebf5' },
        canvas: '#f6f2ed',
        cream: '#fbf9f6',
        ink: '#2b2b2b',
        line: '#e7e0d8',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43, 43, 43, 0.04), 0 8px 24px -12px rgba(43, 43, 43, 0.12)',
        lift: '0 2px 4px rgba(43, 43, 43, 0.04), 0 16px 32px -16px rgba(43, 43, 43, 0.22)',
      },
    },
  },
  plugins: [],
}
