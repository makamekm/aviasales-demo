const withImages = require('next-images');
const withWorkers = require('@zeit/next-workers');
module.exports = withWorkers(
  withImages(),
);