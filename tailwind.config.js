module.exports = {
  mode: 'jit',
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: {
          max: '639px',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
