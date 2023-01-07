const { SlashCommandBuilder, IntegrationApplication } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('foobar')
    .setDescription('Change nickname test'),
  async execute({ interaction, client, config }) {
    await client.guilds.cache.get(config.discord.guildId).members.cache.get(interaction.user.id).setNickname('test123');
    // await interaction.reply(`YESSS! I'm alive. its ${new Date()} here.`);
  },
};
