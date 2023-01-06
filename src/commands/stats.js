const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Returns your stats (if bound to tracker)'),
	async execute(interaction, mongodb, stats) {
    console.log(`interaction from user ${interaction.user.id}`)
    
    // get stats for user
    try {
      const userStats = await stats.getUser(interaction.user.id)
      console.log('stats for user', userStats)
    } catch (e) {
      console.log(e)
    }


		await interaction.reply(`Stats printed to console, yolo`)
	},
};