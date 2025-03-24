/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        google_font: ['"Gowun Dodum"', "cursive"], //"Gowun Dodum"는 구글 폰트에서 받아온 이름.
      },
    },
  },
  plugins: [],
};
