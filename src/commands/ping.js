const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with a pong'),
  async execute({ interaction }) {
    await interaction.reply(`YESSS! I'm alive. its ${new Date()} here.`);
  },
};
