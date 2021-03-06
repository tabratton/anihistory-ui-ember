/* eslint-disable no-undef */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./app/**/*.{ts,hbs,html}'],
  theme: {
    colors: {
      main: colors.fuchsia,
      white: colors.white,
      gray: colors.stone,
    },
    extend: {
      opacity: {
        5: '.05',
        7: '.07',
        65: '.65',
      },
      colors: {
        'dark-base': 'rgba(12, 12, 12, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
