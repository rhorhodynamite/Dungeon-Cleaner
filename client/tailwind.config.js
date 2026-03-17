/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        snes: {
          bg:       '#0d0d1a',
          window:   '#1a1040',
          border:   '#6b5ca5',
          purple:   '#2d1b69',
          gold:     '#ffd700',
          cream:    '#e8d5a3',
          green:    '#00cc44',
          blue:     '#4488ff',
          red:      '#ff3333',
          orange:   '#ff8c00',
          pink:     '#ff66cc',
          cyan:     '#00ffff',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.5)' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
        levelUp: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        xpFill: {
          '0%': { width: '0%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        sparkle: 'sparkle 1s ease-in-out infinite',
        floatUp: 'floatUp 1.5s ease-out forwards',
        levelUp: 'levelUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        shimmer: 'shimmer 2s linear infinite',
        blink: 'blink 1s step-end infinite',
        xpFill: 'xpFill 0.8s ease-out',
        shake: 'shake 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
