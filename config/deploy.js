/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  const ENV = {
    build: {},
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary in order to run ember-cli-deploy-cloudfront.
      // To disable CloudFront invalidation, remove this setting or change it to `false`.
      // To disable ember-cli-deploy-cloudfront for only a particular environment, add
      // `ENV.pipeline.activateOnDeploy = false` to an environment conditional below.
      activateOnDeploy: true,
    },
    s3: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      filePattern: '*',
    },
    's3-index': {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      allowOverwrite: true,
    },
    cloudfront: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
  };

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV.s3.bucket = 'anihistory.moe';
    ENV.s3.region = 'us-east-1';
    ENV['s3-index'].bucket = 'anihistory.moe';
    ENV['s3-index'].region = 'us-east-1';
    ENV.cloudfront.distribution = 'E3RJ815PE513Z4';
    ENV.cloudfront.region = 'us-east-1';
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
