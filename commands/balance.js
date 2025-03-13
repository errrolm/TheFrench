const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js'); // Import MessageEmbed
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your or someone else\'s balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check the balance for')
        .setRequired(false)
    ),
  async execute(interaction) {
    const userToCheck = interaction.options.getUser('user') || interaction.user;
    const balance = await db.get(`balance_${userToCheck.id}`) || 0;
    // await db.add(`balance_${interaction.user.id}`, 1000000000);

    const balEmbed = new MessageEmbed()
      .setTitle(`${userToCheck.username}'s Balance`)
      .setDescription(`Current balance: ⏣${balance}`)
      .setColor(process.env.color)
      .setTimestamp();

    await interaction.reply({ embeds: [balEmbed] }).catch(console.error);
  },
};
