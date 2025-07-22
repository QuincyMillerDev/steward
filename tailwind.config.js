/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        text: 'var(--color-text)',
        'text-primary': 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        red: 'var(--color-red)',
        'red-hover': 'var(--color-red-hover)',
      },
      fontSize: {
        // Elderly-friendly larger text sizes
        'xs': ['14px', '20px'],
        'sm': ['16px', '24px'],
        'base': ['18px', '28px'],
        'lg': ['20px', '32px'],
        'xl': ['24px', '36px'],
        '2xl': ['30px', '40px'],
        '3xl': ['36px', '44px'],
      },
    },
  },
  plugins: [],
}