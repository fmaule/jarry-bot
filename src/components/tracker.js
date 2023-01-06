const axios = require('axios');

// LOGGER
const path = require('node:path');
const { initLogger } = require('./logger');
const componentName = path.parse(__filename).name;
const { log, logError } = initLogger(componentName);

const initTracker = async (config) => {
  log('∝ initializing component');

  const baseUrl = 'https://public-api.tracker.gg/v2/apex/standard/profile';
  const endpointUrl = `${baseUrl}/origin`;

  const statsClient = axios.create({
    headers: {
      get: {
        'TRN-Api-Key': config.tracker.token,
      },
    },
  });

  const getProfileStats = async (platformUserIdentifier) => {
    const { data } = await statsClient.get(
      `${endpointUrl}/${platformUserIdentifier}`
    );
    return data;
  };

  const getSegmentStats = async (platformUserIdentifier, segmentType) => {
    const { data } = await statsClient.get(
      `${endpointUrl}/${platformUserIdentifier}/segments/${segmentType}`
    );
    return data;
  };

  const getHistory = async (platformUserIdentifier) => {
    const { data } = await statsClient.get(
      `${endpointUrl}/${platformUserIdentifier}/sessions`
    );
    return data;
  };

  return {
    getProfileStats,
    getSegmentStats,
    getHistory,
  };
};

module.exports = {
  initTracker,
};
