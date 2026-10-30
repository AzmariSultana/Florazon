/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Muted rose taken from the logo blossoms; used sparingly for focus, selection and accents
        brand: {
          DEFAULT: '#b5527b',
          soft: '#f7e8ee',
        },
        // Page background: a very light warm beige used across the whole app
        canvas: '#f6f2ed',
        // Lighter warm fill for small surfaces (icon circles, image placeholders, hovers)
        cream: '#fbf9f6',
        ink: '#2b2b2b',
        line: '#e7e0d8',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Prata', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43, 43, 43, 0.04), 0 8px 24px -12px rgba(43, 43, 43, 0.12)',
        lift: '0 2px 4px rgba(43, 43, 43, 0.04), 0 16px 32px -16px rgba(43, 43, 43, 0.22)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
