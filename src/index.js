const { initConfig } = require('./components/config')
const { initMongodb } = require('./components/mongodb');
const { initDiscord } = require('./components/discord');
const { initCommands } = require('./components/discord-commands');
const { initStats } = require('./components/stats');

const main = async () => {
  const config = await initConfig();

  const mongodb = await initMongodb(config);
  const { discord: client } = await initDiscord(config, mongodb);
  await initCommands(config);

  console.log('Bot ready! 🚀');
}

main().catch(console.error);