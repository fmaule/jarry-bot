const { SlashCommandBuilder } = require('discord.js');
const os = require('node:os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with a pong'),
  async execute({ interaction }) {
    await interaction.reply(
      `YESSS! I'm alive. ${os.hostname()} ${os.release()} ${os.type()} release ${
        os.release
      }. Its ${new Date()} here.`
    );
  },
};
