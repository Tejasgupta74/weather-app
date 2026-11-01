/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: '#0B0F17',
          light: '#F1F5F9',
        },
        glass: {
          dark: 'rgba(15, 23, 42, 0.72)',
          elevatedDark: 'rgba(30, 41, 59, 0.85)',
          light: 'rgba(255, 255, 255, 0.78)',
          elevatedLight: 'rgba(248, 250, 252, 0.94)',
        },
        borderGlass: {
          dark: 'rgba(255, 255, 255, 0.12)',
          activeDark: 'rgba(255, 255, 255, 0.28)',
          light: 'rgba(15, 23, 42, 0.12)',
          activeLight: 'rgba(15, 23, 42, 0.28)',
        },
        accent: {
          sun: '#EAB308',
          rain: '#38BDF8',
          snow: '#E2E8F0',
          wind: '#34D399',
          storm: '#F59E0B',
          error: '#EF4444',
          focus: '#38BDF8',
        },
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
