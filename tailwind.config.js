/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm neutral stone palette
        sand: {
          50: '#faf8f5',
          100: '#f4f1ec',
          200: '#e8e2d8',
          300: '#d6cdbf',
          400: '#b8ad9c',
          500: '#9a8d7a',
          600: '#7a6e5d',
          700: '#5c5244',
          800: '#3d362c',
          900: '#211d18',
        },
        clay: {
          50: '#f7f1ee',
          100: '#ecded7',
          200: '#d9bcae',
          300: '#c2987f',
          400: '#a87454',
          500: '#8c5a3e',
          600: '#704630',
          700: '#563626',
          800: '#3c271c',
          900: '#241710',
        },
        sage: {
          50: '#f3f5f1',
          100: '#e4eae0',
          200: '#c9d4c2',
          300: '#a3b69a',
          400: '#7d9471',
          500: '#5f7655',
          600: '#4a5d43',
          700: '#3a4a35',
          800: '#2a3527',
          900: '#1a2018',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(33, 29, 24, 0.08), 0 8px 24px -8px rgba(33, 29, 24, 0.10)',
        lift: '0 4px 16px -4px rgba(33, 29, 24, 0.12), 0 16px 48px -12px rgba(33, 29, 24, 0.14)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.4s ease-out both',
        'shimmer': 'shimmer 1.6s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
