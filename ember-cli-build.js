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

  return require('@embroider/compat').compatBuild(app, Webpack, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        externals: ({ request }, callback) => {
          if (/xlsx|canvg|pdfmake/.test(request)) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
        // module: {
        //   rules: [
        //     {
        //       test: /\.css$/,
        //       exclude: /node_modules/,
        //       use: [
        //         {
        //           loader: 'style-loader',
        //         },
        //         {
        //           loader: 'css-loader',
        //           options: {
        //             importLoaders: 1,
        //           },
        //         },
        //         {
        //           loader: 'postcss-loader',
        //         },
        //       ],
        //     },
        //   ],
        // },
      },
    },
  });
};
