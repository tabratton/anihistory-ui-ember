'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { Webpack } = require('@embroider/webpack');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // postcssOptions: {
    //   compile: {
    //     enabled: true,
    //     cacheInclude: [/.*\.(css|scss)$/],
    //     plugins: [
    //       { module: require('postcss-import') },
    //       { module: require('postcss-nested') },
    //     ],
    //   },
    //   filter: {
    //     enabled: true,
    //     plugins: [{ module: require('autoprefixer') }],
    //   },
    // },
  });

  function isProduction() {
    return EmberApp.env() === 'production';
  }

  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    // staticAddonTrees: true,
    // staticHelpers: true,
    // staticModifiers: true,
    // staticComponents: true,
    staticEmberSource: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      // publicAssetURL is used similarly to Ember CLI's asset fingerprint prepend option.
      publicAssetURL: '/',
      // Embroider lets us send our own options to the style-loader
      cssLoaderOptions: {
        // don't create source maps in production
        sourceMap: isProduction() === false,
        // enable CSS modules
        modules: {
          // global mode, can be either global or local
          // we set to global mode to avoid hashing tailwind classes
          mode: 'global',
          // class naming template
          localIdentName: isProduction()
            ? '[sha512:hash:base64:5]'
            : '[path][name]__[local]',
        },
      },
      webpackConfig: {
        module: {
          rules: [
            {
              // When webpack sees an import for a CSS file
              test: /(node_modules\/\.embroider\/rewritten-app\/)(.*\.css)$/i,
              use: [
                {
                  // use the PostCSS loader addon
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: isProduction() === false,
                    postcssOptions: {
                      config: './postcss.config.js',
                    },
                  },
                },
              ],
            },
            {
              test: /(node_modules\/\.embroider\/rewritten-app\/)(.*\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg))$/,
              use: [
                {
                  // include a image/font standard loader for certain
                  // Tailwind/CSS features.
                  loader: 'url-loader',
                  options: {
                    limit: 8192,
                  },
                },
              ],
            },
          ],
        },
        externals: ({ request }, callback) => {
          if (/xlsx|canvg|pdfmake/.test(request)) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      },
    },
  });
};
