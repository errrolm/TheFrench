const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const helpRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setURL('https://discord.com/api/oauth2/authorize?client_id=953557418913181696&permissions=2349190208&scope=bot%20applications.commands')
    .setLabel('Invite me!')
    .setStyle(ButtonStyle.Link),
  new ButtonBuilder()
    .setURL('https://top.gg/bot/953557418913181696')
    .setLabel('Vote on Tog.gg')
    .setStyle(ButtonStyle.Link),
  new ButtonBuilder()
    .setURL('https://discordbotlist.com/bots/thefrench')
    .setLabel('Vote on DBL')
    .setStyle(ButtonStyle.Link)
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Come on, Get some help'),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setTitle("How may I help you?")
      .setColor(process.env.color || 0x00FF00)
      .setTimestamp();
    const commands = Array.from(interaction.client.commands.values());
    if (commands.length > 25) {
      for (let i = 0; i < 24; i++) {
        const command = commands[i];
        helpEmbed.addFields({ name: command.data.name, value: command.data.description });
      }
      helpEmbed.addFields({ name: "More Commands", value: `+ ${commands.length - 24} more commands...` });
    } else {
      for (const command of commands) {
        helpEmbed.addFields({ name: command.data.name, value: command.data.description });
      }
    }
    await interaction.reply({ embeds: [helpEmbed], components: [helpRow] }).catch(console.error);
  }
};
