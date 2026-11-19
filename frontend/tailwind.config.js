/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'vg-black': '#080808',
        'vg-dark': '#111111',
        'vg-card': '#181818',
        'vg-border': '#292929',
        'vg-white': '#FFFFFF',
        'vg-gray': '#A0A0A0',
        'vg-accent': '#E5E5E5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
