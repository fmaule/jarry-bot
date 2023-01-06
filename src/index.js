const { initConfig } = require('./components/config')
const { initMongodb } = require('./components/mongodb');
const { initDiscord } = require('./components/discord');
const { initCommands } = require('./components/discord-commands');
const { initTracker } = require('./components/tracker');
const { initStats } = require('./components/stats');


const main = async () => {
  const config = await initConfig();

  const mongodb = await initMongodb(config);
  const tracker = await initTracker(config);
  const stats = await initStats(config, mongodb, tracker);
  const { discord: client } = await initDiscord(config, mongodb, stats);
  await initCommands(config);

  console.log('Bot ready! 🚀');
}

main().catch(console.error);