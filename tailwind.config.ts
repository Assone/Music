import containerQueriesPlugin from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        portrait: {
          raw: '(orientation: portrait)',
        },
        landscape: {
          raw: '(orientation: landscape)',
        },
      },
    },
  },
  plugins: [containerQueriesPlugin],
} satisfies Config;
