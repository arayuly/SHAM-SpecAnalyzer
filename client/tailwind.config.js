/** @type {import('tailwindcss').Config} */
export default {
  // ЭТА СТРОКА ВКЛЮЧАЕТ ТЕМНУЮ ТЕМУ
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Здесь можно добавить фирменные цвета твоего бро
        darkBg: '#0B0F19',
      },
    },
  },
  plugins: [],
}