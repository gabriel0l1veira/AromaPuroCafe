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
      cafe: {
        claro: "#f8f4ef",      // fundo
        medio: "#d5bfa3",      // texto e bordas
        escuro: "#2b1b0e",     // títulos
        destaque: "#a6744b",   // botões
        hover: "#8a5930",      // hover
        suave: "#f2ebe3",      // seções suaves
       },
     },
    },
  },
  plugins: [],
};
