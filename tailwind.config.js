/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        custom: ['PlayChickens', 'sans-serif'],
        super: ['SuperFeel', 'sans-serif'],
        sla: ['Slaberlin', 'sans-serif'],
        slabold: ['SlaberlinBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
