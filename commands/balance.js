const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription("Check your or someone's balance")
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to check the balance for')
        .setRequired(false)
    ),
  async execute(interaction) {
    const userToCheck = interaction.options.getUser('user') || interaction.user;
    const balance = (await db.get(`balance_${userToCheck.id}`)) || 0;
    const balEmbed = new EmbedBuilder()
      .setTitle(`${userToCheck.username}'s Balance`)
      .setDescription(`Current balance: ⏣${balance}`)
      .setColor(process.env.color)
      .setTimestamp();
    await interaction.reply({ embeds: [balEmbed] }).catch(console.error);
  },
};