/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Muted rose taken from the logo blossoms; used for accents, selection and the active state
        brand: {
          DEFAULT: '#b5527b',
          dark: '#93405f',
          soft: '#f7e8ee',
        },
        // Soft floral tints used for gradients and tinted surfaces
        blush: '#f4e4e6',
        sage: {
          DEFAULT: '#7d8c6e',
          soft: '#e6ebdf',
        },
        // Page background: a warm ivory with a hint of petal pink
        canvas: '#f8f4f0',
        // Lighter warm fill for small surfaces (icon circles, image placeholders, hovers)
        cream: '#fcfaf7',
        ink: '#2b2b2b',
        line: '#ebe3dc',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Prata', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(60, 40, 45, 0.04), 0 10px 30px -14px rgba(60, 40, 45, 0.14)',
        lift: '0 2px 6px rgba(60, 40, 45, 0.05), 0 22px 40px -18px rgba(60, 40, 45, 0.28)',
        glass: 'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 12px 32px -16px rgba(60, 40, 45, 0.22)',
      },
      transitionTimingFunction: {
        petal: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'page-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        // Opacity only, so sticky and fixed elements inside the page keep working
        'page-in': 'page-in 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
