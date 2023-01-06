const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bind')
		.setDescription('Binds your account to apex tracker')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Apex tracker username (your origin name basically)')
        .setRequired(true)),
	async execute(interaction) {
    const originId = interaction.options.getString('username');
    console.log(`interaction from user ${interaction.user.id} to origin id ${originId}`)
		await interaction.reply(`Your account is now connected to the [apex tracker](https://apex.tracker.gg/apex/profile/origin/${originId}/overview)`)
    await interaction.reply('another reply');
	},
};