/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cartzilla-inspired palette (top-rated e-commerce template)
        gray: {
          50: '#f5f7fa',
          100: '#eef1f6',
          200: '#e0e5eb',
          300: '#cad0d9',
          400: '#9ca3af',
          500: '#6c727f',
          600: '#4e5562',
          700: '#333d4c',
          800: '#222934',
          900: '#181d25',
          950: '#131920',
        },
        primary: {
          DEFAULT: '#f55266',
          hover: '#e84a5c',
          light: '#fde8eb',
          dark: '#c94454',
        },
        success: '#33b36b',
        info: '#2f6ed5',
        warning: '#fc9231',
        danger: '#f03d3d',
        shop: {
          foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
          background: 'rgb(var(--color-background) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'store-title': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'store-hero': ['clamp(2.25rem, 7vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        'store-subtitle': ['clamp(0.9375rem, 1.5vw, 1.125rem)', { lineHeight: '1.6' }],
      },
      boxShadow: {
        'store-sm': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'store': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'store-md': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'store-lg': '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
        'store-xl': '0 20px 25px -5px rgb(0 0 0 / 0.06), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
        'store-product': '0 2px 12px -2px rgb(0 0 0 / 0.08), 0 6px 16px -4px rgb(0 0 0 / 0.06)',
        'store-product-hover': '0 16px 32px -4px rgb(0 0 0 / 0.12), 0 12px 24px -8px rgb(0 0 0 / 0.08)',
        'store-input': '0 0 0 3px rgb(245 82 102 / 0.15)',
      },
      borderRadius: {
        'store': '0.5rem',
        'store-lg': '0.625rem',
        'store-xl': '0.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
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
      },
      maxWidth: {
        'store': '1320px',
        'store-narrow': '900px',
      },
    },
  },
  plugins: [],
};
