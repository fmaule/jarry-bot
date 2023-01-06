const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

// LOGGER
const path = require('node:path')
const { initLogger } = require('./logger'); 
const componentName = path.parse(__filename).name
const { log } = initLogger(componentName);

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

const initCommands = async (config) => {
  log('∝ initializing component')

  const { discord: { token, clientId, guildId }} = config
  const rest = new REST({ version: '10' }).setToken(token);
  log(`♻ started refreshing ${commands.length} application (/) commands.`);

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands },
  );

  log(`👍 reloaded ${data.length} application (/) commands.`);
}

module.exports = {
  name: path.basename(__filename),
  initCommands
}