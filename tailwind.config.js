/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009cde',
        secondary: '#c4d600',
        accent: '#a50050',
        darkblue: '#003b64',
        black: '#000000',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
};
