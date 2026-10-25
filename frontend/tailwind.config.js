/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#111111',
          hover: '#2A2A2A',
          muted: '#1A1A1A',
          surface: '#1A1A1A',
        },
        offwhite: {
          DEFAULT: '#FAFAF7',
          light: '#FAFAFA',
        },
        softgreen: {
          DEFAULT: '#3FA66B',
          bg: '#EAF7EE',
          dark: '#277A4D',
          darkMode: '#16291F',
        },
        softpink: {
          DEFAULT: '#E8798F',
          bg: '#FFF0F3',
          dark: '#C95F75',
          darkMode: '#301F24',
        },
        borderLight: '#E5E7EB',
        muted: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
        },
      },
      borderRadius: {
        'card': '16px',
        'btn': '10px',
        'input': '10px',
        'badge': '6px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'green': '0 2px 8px rgba(63, 166, 107, 0.15)',
      }
    },
  },
  plugins: [],
}
