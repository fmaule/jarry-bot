const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bind')
    .setDescription('Binds your account to apex tracker')
    .addStringOption((option) =>
      option
        .setName('username')
        .setDescription('Apex tracker username (your origin name basically)')
        .setRequired(true)
    ),
  async execute({ interaction, stats, client, config }) {
    await interaction.deferReply({ ephemeral: true });
    const originId = interaction.options.getString('username');

    await stats.bind(interaction.user, originId);

    const userStats = await stats.getUser(interaction.user.id);
    const statsOverview = userStats.segments.find((s) => s.type === 'overview');
    const { value: level } = statsOverview.stats.level;

    const nickname = `${level} | ${originId}`;

    // TODO maybe use methods on interaction instead? idk
    await client.guilds.cache
      .get(config.discord.guildId)
      .members.cache.get(interaction.user.id)
      .setNickname(nickname);

    await interaction.editReply(
      `Your account is now connected to the [apex tracker](https://apex.tracker.gg/apex/profile/origin/${originId}/overview)`
    );
  },
};
