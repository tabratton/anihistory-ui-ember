/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  const ENV = {
    build: {
      environment: 'production',
    },
    pipeline: {
      activateOnDeploy: true,
    },
    'revision-data': {
      type: 'version-commit',
    },
    s3: {},
    's3-index': {},
  };

  if (deployTarget === 'production') {
    ENV.s3.accessKeyId = process.env.AWS_KEY;
    ENV.s3.secretAccessKey = process.env.AWS_SECRET;
    ENV.s3.bucket = process.env.BUCKET;
    ENV.s3.region = process.env.REGION;
    ENV['s3-index'].accessKeyId = process.env.AWS_KEY;
    ENV['s3-index'].secretAccessKey = process.env.AWS_SECRET;
    ENV['s3-index'].bucket = process.env.BUCKET;
    ENV['s3-index'].region = process.env.REGION;
    ENV.cloudfront = {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      distribution: process.env.CLOUDFRONT_DISTRIBUTION,
    };
  }

  return ENV;
};
