// LOGGER
const path = require('node:path');
const { initLogger } = require('./logger');
const componentName = path.parse(__filename).name;
const { log, logError } = initLogger(componentName);

const { DiscordUserStatsAlreadyBound, OriginStatsAlreadyBound, UserNotBound } = require('../errors/interaction-errors')

const CACHE_TIME = 600000 // 10 minutes

const initStats = async (config, mongodb, tracker) => {
  log('∝ initializing component');

  const getUser = async (discordId) => {
    log(`fetching stats for user ${discordId}`);

    const storedOriginUser = await mongodb.getOriginIdByDiscordId(discordId);
    if (!storedOriginUser) {
      throw new UserNotBound('Sorry your stats account is not connected. Use /bind', { discordId })
    }

    const { originId } = storedOriginUser

    // cache results for 10 minutes
    const userStats = await mongodb.getStatsByOriginId(originId);

    const refreshStats = async () => {
      const trackerStats = await tracker.getProfileStats(originId)
      await mongodb.saveStats(originId, trackerStats)
      return trackerStats
    }
    
    if (userStats) {
      const { cachedOn } = userStats
      log(`user ${discordId} stats have been saved on ${cachedOn}`);

      const hasCacheExpired = new Date() - new Date(cachedOn) > CACHE_TIME
      if (hasCacheExpired) {
        log(`user ${discordId} stats cache expired, refreshing results`)
        return await refreshStats()
      }

      return userStats
    }

    log(`user ${discordId} saving stats for the first time`)
    return await refreshStats()
  };

  const getUserPrintable = async (discordUserId) => {
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

    const userStats = await getUser(discordUserId);
    const statsOverview = userStats.segments.find(s => s.type === 'overview')
    const mappedStats = Object.entries(statsOverview.stats).map(statsMapper)
    return mappedStats
  }
  
  const bind = async (discordUser, originId) => {
    const { id: discordId } = discordUser

    const storedOriginUser = await mongodb.getOriginIdByDiscordId(discordId);
    if (storedOriginUser) {
      throw new DiscordUserStatsAlreadyBound('Discord user already bound to a stats account. Please ask the admin to unbind.', { discordId, originId })
    }

    const storedDiscordUser = await mongodb.getDiscordIdByOriginId(originId);
    if (storedDiscordUser) {
      throw new OriginStatsAlreadyBound('Stats account already bound to someone else. Please ask the admin to unbind.', { discordId, originId })
    }

    return mongodb.bindDiscordUser(discordUser, originId);
  }


  return {
    getUser,
    getUserPrintable,
    bind,
  };
};

module.exports = {
  initStats,
};
