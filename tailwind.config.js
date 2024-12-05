/////////////////////////////// cubething.dev /////////////////////////////////

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/client/**/*.ts"],
  theme: {
    extend: {},
    container: {
      center: true,
    },
    fontFamily: {
      display: ["Chillax"],
      body: ["Synonym"],
      sans: ["Synonym"],
      serif: ["Libertinus"],
      mono: ["Fira Code Nerd Font", "Fira Code"],
    },
  },
  darkMode: "selector",
  plugins: [],
};
