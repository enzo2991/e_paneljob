/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        '320': '80rem',
      },
      height: {
        '160': '45rem',
      },
      maxHeight: {
        '104': '26rem',
        '134': '33.5rem',
      }
    },
  },
  plugins: [],
}

