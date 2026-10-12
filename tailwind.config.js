/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sonora: {
          lime: {
            DEFAULT: '#D4FF00',
            hover: '#E2FF33',
            muted: '#B0D800',
            dim: 'rgba(212, 255, 0, 0.12)',
            glow: 'rgba(212, 255, 0, 0.25)',
          },
          dark: {
            base: '#0B0D11',
            sidebar: '#0E1117',
            card: '#151922',
            cardHover: '#1B212D',
            border: '#232A38',
            player: '#0A0C10',
            elevated: '#1E2533',
          },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'equalizer': 'equalize 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        equalize: {
          '0%': { height: '3px' },
          '100%': { height: '18px' },
        },
      },
    },
  },
  plugins: [],
}
