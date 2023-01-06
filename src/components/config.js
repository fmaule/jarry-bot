const config = require('../../config.json');

// LOGGER
const path = require('node:path')
const { initLogger } = require('./logger'); 
const componentName = path.parse(__filename).name
const { log } = initLogger(componentName);

const initConfig = async () => {
  log('∝ initializing component')
  return config;
}

module.exports = {
  initConfig
}