/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          800: '#14213D',
          700: '#1E293B',
          600: '#334155'
        },
        teal: {
          500: '#16A6A1',
          600: '#128783',
          400: '#34D399',
          50: '#F0FDFA'
        },
        coral: {
          500: '#FF8066',
          600: '#E86347',
          50: '#FFF5F2'
        },
        surface: {
          bg: '#F7F9FC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 33, 61, 0.06), 0 2px 6px -1px rgba(20, 33, 61, 0.04)',
        'premium': '0 20px 25px -5px rgba(20, 33, 61, 0.08), 0 10px 10px -5px rgba(20, 33, 61, 0.03)'
      }
    },
  },
  plugins: [],
}
