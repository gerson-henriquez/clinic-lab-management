/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // DiagnosticLab Brand Colors (From Logo)
        brand: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',  // Light green from logo
          600: '#00C853',  // Primary vibrant green (MAIN BRAND)
          700: '#00843D',  // Dark green from logo
          800: '#00662B',
          900: '#004D21',
        },
        // Primary actions - Keep brand green
        primary: {
          DEFAULT: '#00C853',
          dark: '#00843D',
          light: '#4CAF50',
        },
        // Secondary actions - Complementary Teal/Cyan
        secondary: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',  // Teal light
          600: '#0891B2',  // Teal primary (SECONDARY BRAND)
          700: '#0E7490',  // Teal dark
          800: '#155E75',
          900: '#164E63',
        },
        // Accent colors
        accent: {
          indigo: '#6366F1',
          purple: '#8B5CF6',
          sky: '#0EA5E9',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        // Clinical/Professional colors
        clinical: {
          gray: '#2C3E50',
          'light-bg': '#F5F9F7',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00C853 0%, #0891B2 100%)',
        'gradient-brand-dark': 'linear-gradient(135deg, #00843D 0%, #0E7490 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-15px) translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
