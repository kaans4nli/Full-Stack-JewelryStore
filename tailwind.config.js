/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Tailwind v4'te theme artık CSS'te tanımlanıyor (@theme bloku)
  // Bu config dosyası artık minimal kalabilir
}