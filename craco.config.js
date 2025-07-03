// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'), // This tells CRACO to use the Tailwind PostCSS plugin
        require('autoprefixer'),
      ],
    },
  },
};
