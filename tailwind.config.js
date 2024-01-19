const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
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
      },
      colors: {
        'chevara': {
          500: '#1fb6ff'
        }
      },
    },
  },
  plugins: [
    'tailwindcss/nesting',
    require('tailwindcss-animated')
  ],
};
