const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Returns your stats (if bound to tracker)'),
  async execute({ interaction, stats }) {
    console.log(`interaction from user ${interaction.user.id}`);

    // get stats for user
    try {
      const userStats = await stats.getUserPrintable(interaction.user.id);
      console.log('stats for user', userStats);
      await interaction.reply(userStats.join('\n'));
    } catch (e) {
      console.log(e);
    }
  },
};
