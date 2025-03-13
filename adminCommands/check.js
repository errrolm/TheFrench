const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkservers')
    .setDescription('List all servers the bot is in with their IDs'),
  async execute(interaction) {
    const servers = interaction.client.guilds.cache.map((server) => `${server.name} - ${server.id}`);
    const serversToShow = servers.slice(0, 20); // Show the first 20 servers.

    await interaction.reply(`List of servers:\n\`\`\`${serversToShow.join('\n')}\`\`\``);

    // If there are more servers, provide a button to see the rest.
    if (servers.length > 20) {
      const restOfServers = servers.slice(20);
      const restOfServersText = restOfServers.join('\n');
      await interaction.followUp(`There are more servers. Click the button below to see the rest.\n\`\`\`${restOfServersText}\`\`\``);
    }
  },
};
