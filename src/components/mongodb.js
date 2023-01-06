const { MongoClient } = require('mongodb');

// LOGGER
const path = require('node:path');
const { initLogger } = require('./logger');
const componentName = path.parse(__filename).name;
const { log, logError } = initLogger(componentName);

let usersCollection;
let statsCollection;

const initMongodb = async ({ mongodb }) => {
  log('∝ initializing component');
  try {
    const client = new MongoClient(mongodb.uri);
    await client.connect();
    const db = await client.db(mongodb.dbName);
    usersCollection = db.collection(mongodb.usersCollection);
    statsCollection = db.collection(mongodb.statsCollection);
  } catch (e) {
    logError(e);
  }

  const getPlatformUserIdentifierById = async (id) =>
    usersCollection.findOne({ discordId: id });

  const bindDiscordUser = async ({ id, username, discriminator }, originId) => {
    const doc = {
      id,
      username,
      discriminator,
      originId,
    };

    return usersCollection.findOneAndUpdate(
      { discordId: id },
      { $set: doc },
      { upsert: true }
    );
  };

  const saveStats = async (originId, stats) => {
    const doc = {
      originId,
      cachedOn: new Date(),
      ...stats,
    };

    return statsCollection.findOneAndUpdate(
      { originId },
      { $set: doc },
      { upsert: true }
    );
  };

  const getStatsByOriginId = async (originId) =>
    statsCollection.findOne({ originId });

  return {
    statsCollection,
    usersCollection,
    getPlatformUserIdentifierById,
    bindDiscordUser,
    getStatsByOriginId,
    saveStats,
  };
};

module.exports = {
  initMongodb,
};
