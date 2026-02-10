/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Surgical Color Palette ──────────────────────────────────
      colors: {
        // Surface system (neumorphic base)
        surface: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',   // Light mode base
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',   // Dark mode base
          950: '#020617',
        },
        // Primary accent – biotech emerald
        emerald: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',   // Primary accent
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Secondary accent – precision cyan
        cyan: {
          50:  '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',   // Secondary accent
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        // Alert system
        alert: {
          success: '#10B981',
          warning: '#F59E0B',
          danger:  '#EF4444',
          info:    '#3B82F6',
        },
        // Keep brand colors for logo compatibility
        brand: {
          50:  '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#00C853',
          700: '#00843D',
          800: '#1B5E20',
          900: '#0D3B12',
        },
      },

      // ── Neumorphic Box Shadows ──────────────────────────────────
      boxShadow: {
        // Light mode neumorphism
        'neu-flat':    '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.8)',
        'neu-pressed': 'inset 4px 4px 8px rgba(163,177,198,0.6), inset -4px -4px 8px rgba(255,255,255,0.8)',
        'neu-sm':      '3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.7)',
        'neu-convex':  '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.3)',
        // Dark mode neumorphism
        'neu-dark-flat':    '6px 6px 12px rgba(0,0,0,0.5), -6px -6px 12px rgba(45,55,72,0.3)',
        'neu-dark-pressed': 'inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(45,55,72,0.3)',
        'neu-dark-sm':      '3px 3px 6px rgba(0,0,0,0.4), -3px -3px 6px rgba(45,55,72,0.25)',
        'neu-dark-convex':  '6px 6px 12px rgba(0,0,0,0.5), -6px -6px 12px rgba(45,55,72,0.3), inset 1px 1px 2px rgba(255,255,255,0.05)',
        // Glow effects
        'glow-emerald': '0 0 15px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.15)',
        'glow-cyan':    '0 0 15px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.15)',
        'glow-amber':   '0 0 15px rgba(245,158,11,0.4), 0 0 40px rgba(245,158,11,0.15)',
        'glow-rose':    '0 0 15px rgba(244,63,94,0.4), 0 0 40px rgba(244,63,94,0.15)',
        'glow-blue':    '0 0 15px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.15)',
        // Glass shadow
        'glass':        '0 8px 32px rgba(0,0,0,0.08)',
        'glass-lg':     '0 16px 48px rgba(0,0,0,0.12)',
      },

      // ── Background Images ──────────────────────────────────────
      backgroundImage: {
        'gradient-surgical': 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
        'gradient-console':  'linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%)',
        'gradient-console-dark': 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        'mesh-pattern': 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)',
      },
      backgroundSize: {
        'mesh': '24px 24px',
      },

      // ── Border Radius ──────────────────────────────────────────
      borderRadius: {
        'neu': '16px',
        'neu-lg': '24px',
        'neu-xl': '32px',
      },

      // ── Animations ─────────────────────────────────────────────
      animation: {
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'fade-in':     'fade-in 0.5s ease-out',
        'slide-up':    'slide-up 0.5s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'scan-line':   'scan-line 3s linear infinite',
        'breathe':     'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%':      { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right': {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%':      { transform: 'scale(1.05)', opacity: '1' },
        },
      },

      // ── Backdrop Blur ──────────────────────────────────────────
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
      },

      // ── Fonts ──────────────────────────────────────────────────
      fontFamily: {
        'mono-display': ['"JetBrains Mono"', '"SF Mono"', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
