const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');

// LOGGER
const path = require('node:path')
const { initLogger } = require('./logger'); 
const componentName = path.parse(__filename).name
const { log } = initLogger(componentName);

const initDiscord = async (config, mongodb, stats) => {
  log('∝ initializing omponent')

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.login(config.discord.token);

  client.commands = new Collection();
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  }

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction, mongodb, stats);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });


  // WAIT FOR INIT
  await new Promise((resolve) => {
    client.once(Events.ClientReady, (c) => {
      log(`👍 ready and logged in (as ${c.user.tag})`);
      resolve();
    });
  });

  const guild = client.guilds.cache.get(config.discord.guildId);

  return { client, guild };
};

module.exports = {
  initDiscord,
};
