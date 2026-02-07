/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // DiagnosticLab Brand Colors
        brand: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',  // Secondary green
          600: '#00C853',  // Primary vibrant green
          700: '#00843D',  // Dark green
          800: '#00662B',
          900: '#004D21',
        },
        primary: {
          DEFAULT: '#00C853',
          dark: '#00843D',
          light: '#4CAF50',
        },
        clinical: {
          gray: '#2C3E50',
          'light-bg': '#F5F9F7',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00C853 0%, #00843D 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
