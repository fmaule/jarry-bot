const { SlashCommandBuilder } = require('discord.js');
const os = require('node:os');
const { join } = require('path');

const { NoPermission } = require('../errors/interaction-errors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manifest')
    .setDescription('Replies with manifest (bot admin only)'),
  async execute({ interaction, config, discordClient }) {
    await interaction.deferReply();

    const { members } = discordClient;
    const { roles } = members.cache.get(interaction.user.id);
    const isBotAdmin = roles.cache.has(config.discord.roles.botadmin);

    if (!isBotAdmin) {
      throw new NoPermission(
        'Sorry you do not have the permissions to do this.',
        { options: { discordId: interaction.user.id } }
      );
    }

    const reply = [];
    reply.push(`${os.hostname()} ${os.release()} ${os.type()} release ${os.release}.`);

    try {
      const manifest = require(join(process.cwd(), 'manifest.json'))
      reply.push(JSON.stringify(manifest))
    } finally {
      await interaction.editReply(reply.join('\n'))
    }

  },
};
