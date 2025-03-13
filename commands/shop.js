const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const db = require('../database');
const emojiServerId = '1173442208129634455';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View and purchase mystery boxes in the shop.'),
  async execute(interaction) {
    const server = interaction.client.guilds.cache.get(emojiServerId);
    const shiny = server.emojis.cache.find(e => e.name === 'commonbox');
    const enchanted = server.emojis.cache.find(e => e.name === 'enchantedbox');
    const mystical = server.emojis.cache.find(e => e.name === 'mysticalbox');
    const errols = server.emojis.cache.find(e => e.name === 'errolsbox');

    const shopEmbed = new EmbedBuilder()
      .setColor(process.env.color)
      .setTitle('TheFrench Shop')
      .setDescription('Shop command coming soon.')
      .setTimestamp()
      .setFooter({ text: 'Coming soon.' });

    await interaction.reply({ embeds: [shopEmbed] });
  },
};
