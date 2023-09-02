import containerQueriesPlugin from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [containerQueriesPlugin],
} satisfies Config;
