module.exports = {
  darkMode: ["selector", '[zaui-theme="dark"]'],
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
      },
      colors: {
        primary: {
          50: 'var(--color-primary-50, #f0fdf4)',
          100: 'var(--color-primary-100, #dcfce7)',
          200: 'var(--color-primary-200, #bbf7d0)',
          300: 'var(--color-primary-300, #86efac)',
          400: 'var(--color-primary-400, #4ade80)',
          500: 'var(--color-primary-500, #22c55e)',
          600: 'var(--color-primary-600, #16a34a)',
          700: 'var(--color-primary-700, #15803d)',
          800: 'var(--color-primary-800, #166534)',
          900: 'var(--color-primary-900, #14532d)',
        },
        accent: {
          light: 'var(--color-accent-light, #f0fdf4)',
          main: 'var(--color-accent-main, #22c55e)',
          dark: 'var(--color-accent-dark, #15803d)',
          accent: 'var(--color-accent-accent, #fbbf24)',
        },
        // Legacy cosmetic colors for backward compatibility
        cosmetic: {
          light: '#f0fdf4',
          main: '#22c55e',
          dark: '#15803d',
          accent: '#fbbf24',
        }
      }
    },
  },
};
