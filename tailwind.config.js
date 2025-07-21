/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Grayscale (default theme)
        primary: '#171717',
        secondary: '#262626',
        accent: '#525252',
        'text-primary': '#f5f5f5',
        'text-secondary': '#a3a3a3',
        border: '#404040',
        
        // Theme variants
        'warm-charcoal': {
          primary: '#1c1917',
          secondary: '#292524',
          accent: '#d97706',
          'text-primary': '#fafaf9',
          'text-secondary': '#a8a29e',
          border: '#44403c',
        },
        'deep-blue': {
          primary: '#0f172a',
          secondary: '#1e293b',
          accent: '#3b82f6',
          'text-primary': '#f1f5f9',
          'text-secondary': '#94a3b8',
          border: '#334155',
        },
        'forest-green': {
          primary: '#064e3b',
          secondary: '#065f46',
          accent: '#10b981',
          'text-primary': '#ecfdf5',
          'text-secondary': '#6ee7b7',
          border: '#047857',
        },
        'midnight-purple': {
          primary: '#581c87',
          secondary: '#6b21a8',
          accent: '#a855f7',
          'text-primary': '#faf5ff',
          'text-secondary': '#c4b5fd',
          border: '#7c3aed',
        },
        'coffee-brown': {
          primary: '#451a03',
          secondary: '#78350f',
          accent: '#f97316',
          'text-primary': '#fffbeb',
          'text-secondary': '#fcd34d',
          border: '#92400e',
        },
        'ocean-teal': {
          primary: '#042f2e',
          secondary: '#134e4a',
          accent: '#2dd4bf',
          'text-primary': '#f0fdfa',
          'text-secondary': '#5eead4',
          border: '#115e59',
        },
        'light-mode': {
          primary: '#ffffff',
          secondary: '#f9fafb',
          accent: '#2563eb',
          'text-primary': '#111827',
          'text-secondary': '#4b5563',
          border: '#e5e7eb',
        },
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