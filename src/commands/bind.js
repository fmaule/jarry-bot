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
  async execute({ interaction, mongodb, stats, client, config }) {
    const originId = interaction.options.getString('username');
    console.log(
      `interaction from user ${interaction.user.id} to origin id ${originId}`
    );

    await mongodb.bindDiscordUser(interaction.user.id, originId);

    const userStats = await stats.getUser(interaction.user.id);
    const statsOverview = userStats.segments.find((s) => s.type === 'overview');
    const { value: level } = statsOverview.stats.level;

    const nickname = `${level} | ${originId}`;

    // TODO maybe use methods on interaction instead? idk
    await client.guilds.cache
      .get(config.discord.guildId)
      .members.cache.get(interaction.user.id)
      .setNickname(nickname);

    await interaction.reply(
      `Your account is now connected to the [apex tracker](https://apex.tracker.gg/apex/profile/origin/${originId}/overview)`
    );
  },
};
