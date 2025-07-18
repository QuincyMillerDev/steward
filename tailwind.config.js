/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'elderly': '1.5rem', // 24px for elderly users
        'elderly-lg': '2rem', // 32px
      },
      spacing: {
        'elderly': '3rem', // 48px touch targets
      },
      colors: {
        'elderly-primary': '#2563eb',
        'elderly-bg': 'rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}