'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
// const { Webpack } = require('@embroider/webpack');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      webpack: {
        externals: ({ request }, callback) => {
          if (/xlsx|canvg|pdfmake/.test(request)) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
        module: {
          rules: [
            {
              test: /\.(scss)$/,
              use: [
                {
                  // inject CSS to page
                  loader: 'style-loader',
                },
                {
                  // translates CSS into CommonJS modules
                  loader: 'css-loader',
                },
                {
                  // Run postcss actions
                  loader: 'postcss-loader',
                  options: {
                    // `postcssOptions` is needed for postcss 8.x;
                    // if you use postcss 7.x skip the key
                    postcssOptions: {
                      // postcss plugins, can be exported to postcss.config.js
                      plugins: function () {
                        return [require('autoprefixer')];
                      },
                    },
                  },
                },
                {
                  // compiles Sass to CSS
                  loader: 'sass-loader',
                },
              ],
            },
          ],
        },
      },
    },
  });

  return app.toTree();
  // return require('@embroider/compat').compatBuild(
  //   app,
  //   Webpack,
  //   {
  //     skipBabel: [
  //       {
  //         package: 'qunit',
  //       },
  //     ],
  //     packagerOptions: {
  //       webpackConfig: {
  //         externals: ({ request }, callback) => {
  //           if (/xlsx|canvg|pdfmake/.test(request)) {
  //             return callback(null, `commonjs ${request}`);
  //           }
  //           callback();
  //         },
  //       },
  //     },
  //   }
  // );
};
