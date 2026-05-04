/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1a472a',
        primaryLight: '#2d6a4f',
        accent: '#95d5b2',
        cream: '#faf8f5',
      },
    },
  },
  plugins: [],
};
