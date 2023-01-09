// LOGGER
const path = require('node:path');
const { initLogger } = require('./logger');
const componentName = path.parse(__filename).name;
const { log, logError } = initLogger(componentName);

const CACHE_TIME = 600000 // 10 minutes

const initStats = async (config, mongodb, tracker) => {
  log('∝ initializing component');

  const getUser = async (userId) => {
    log(`fetching stats for user ${userId}`);

    const { originId } = await mongodb.getPlatformUserIdentifierById(userId);

    if (!originId) {
      throw new Error(`User ${userId} not found`);
    }

    // cache results for 10 minutes
    const userStats = await mongodb.getStatsByOriginId(originId);

    const refreshStats = async () => {
      const trackerStats = await tracker.getProfileStats(originId)
      const savedStats = await mongodb.saveStats(originId, trackerStats)
      return trackerStats
    }
    
    if (userStats) {
      const { cachedOn } = userStats
      log(`user ${userId} stats have been saved on ${cachedOn}`);

      const hasCacheExpired = new Date() - new Date(cachedOn) > CACHE_TIME
      if (hasCacheExpired) {
        log(`user ${userId} stats cache expired, refreshing results`)
        return await refreshStats()
      }

      return userStats
    }

    log(`user ${userId} saving stats for the first time`)
    return await refreshStats()
  };

  const getUserPrintable = async (userId) => {
    const statsMapper = ([stat, values]) => {
      const displayStat = []
      displayStat.push(`${values.displayName}: ${values.value}`)
      
      if (values.rank) {
        displayStat.push(`rank #${values.rank}`)
      }
      if (values.percentile) {
        displayStat.push(`(top ${(100 - values.percentile).toFixed(2)}%)`)
      }
    
      return displayStat.join(' ')
    }

    const userStats = await getUser(userId);
    console.log(userStats)
    const statsOverview = userStats.segments.find(s => s.type === 'overview')
    console.log(statsOverview)
    const mappedStats = Object.entries(statsOverview.stats).map(statsMapper)
    return mappedStats
  }


  return {
    getUser,
    getUserPrintable,
  };
};

module.exports = {
  initStats,
};
