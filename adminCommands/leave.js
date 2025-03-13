const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave a server by providing its ID")
    .addStringOption((option) =>
      option
        .setName("serverid")
        .setDescription("ID of the server you want to leave")
        .setRequired(true),
    ),
  async execute(interaction) {
    const serverIdToLeave = interaction.options.getString("serverid");
    const server = interaction.client.guilds.cache.get(serverIdToLeave);
    if (server) {
      await server.leave();
      await interaction.reply(`Left server: ${server.name}`);
    } else {
      await interaction.reply(`Server with ID ${serverIdToLeave} not found.`);
    }
  },
};
