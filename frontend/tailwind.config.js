/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4ECDC4',
          DEFAULT: '#1CBAB3',
          dark: '#0E9994',
        },
        secondary: {
          light: '#FFD166',
          DEFAULT: '#FFC233',
          dark: '#FFB400',
        },
        accent: {
          light: '#FF6B6B',
          DEFAULT: '#FF5252',
          dark: '#FF3939',
        },
        neutral: {
          lightest: '#F8F9FA',
          light: '#E9ECEF',
          DEFAULT: '#DEE2E6',
          dark: '#CED4DA',
          darkest: '#ADB5BD',
        },
        dark: {
          light: '#495057',
          DEFAULT: '#343A40',
          dark: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}