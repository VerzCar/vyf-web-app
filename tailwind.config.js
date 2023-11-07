const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: false,
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif']
      },
      flex: {
        '2': '2 2 0%'
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
};
