const colors = require('tailwindcss/colors');
const path = require('node:path');
const appEntry = path.join(__dirname, 'app');
const relevantFilesGlob = '**/*.{html,js,ts,hbs,gjs,gts}';

module.exports = {
  content: [path.join(appEntry, relevantFilesGlob)],
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
