const env = process.env.EMBER_ENV || 'development';

const plugins = {
  '@tailwindcss/postcss': {},
};

if (env === 'production') {
  plugins.cssnano = { preset: 'default' };
}

export default {
  plugins,
};
