import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',
          blue: '#1d4ed8',
          accent: '#3b82f6',
          light: '#eff6ff',
        },
      },
      fontFamily: {
        tajawal: ['var(--font-tajawal)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
