const prod = require('./webpack.prod');
const stage = require('./webpack.stage');
const dev = require('./webpack.dev');

module.exports = () => {
  const DEPLOYMENT_ENV = process.env.DEPLOYMENT_ENV || 'dev';
  console.log(`Deployment environment is: ${DEPLOYMENT_ENV}`);
  switch(DEPLOYMENT_ENV) {
    case 'production':
    case 'prod':
      return prod;
    case 'staging':
      return stage;
    case 'development':
    case 'dev':
    default:
      return dev;
  }
};
