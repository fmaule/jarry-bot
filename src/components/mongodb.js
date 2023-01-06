const { MongoClient } = require('mongodb');

// LOGGER
const path = require('node:path');
const { initLogger } = require('./logger');
const componentName = path.parse(__filename).name;
const { log, logError } = initLogger(componentName);

let mongoCollection;

const initMongodb = async ({ mongodb }) => {
  log('∝ initializing component');
  try {
    const client = new MongoClient(mongodb.uri);
    await client.connect();
    const db = await client.db(mongodb.dbName);
    mongoCollection = db.collection(mongodb.collectionName);
  } catch (e) {
    logError(e);
  }

  const getPlatformUserIdentifierById = async (id) =>
    mongoCollection.findOne({ discordId: id });

  const bindDiscordUser = async ({ id, username, discriminator }, originId) => {
    const doc = {
      id,
      username,
      discriminator,
      originId,
    };

    return mongoCollection.updateOne(
      { discordId: id },
      { $set: doc },
      { upsert: true }
    );
  };

  return {
    collection: mongoCollection,
    getPlatformUserIdentifierById,
    bindDiscordUser,
  }
};

module.exports = {
  initMongodb,
};
