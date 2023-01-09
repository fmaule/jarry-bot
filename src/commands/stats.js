const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Returns your stats (if bound to tracker)'),
  async execute({ interaction, stats }) {
    await interaction.deferReply();
    const userStats = await stats.getUserPrintable(interaction.user.id);
    await interaction.editReply(userStats.join('\n'));
  },
};
