/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        matrix: '#00ff41',
        obsidian: '#0a0a0f',
        surface: '#111118',
        'surface-2': '#1a1a24',
        'surface-3': '#22222f',
        royal: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
        },
        blush: '#fce7f3',
        cream: '#fdf6f0',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 5px #f59e0b44, 0 0 10px #f59e0b22' },
          '100%': { boxShadow: '0 0 20px #f59e0b88, 0 0 40px #f59e0b44' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-gold':  '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-blue':  '0 0 20px rgba(59, 130, 246, 0.3)',
        'premium':    '0 4px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)',
        'card':       '0 2px 16px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
