const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member-info')
    .setDescription('Gets you info about a member')
    .addUserOption(option =>
      option
        .setName('member')
        .setDescription('Choose a member')
        .setRequired(false)
    ),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member') || interaction.member;
    const memberEmbed = new EmbedBuilder()
      .setTitle(`${targetMember.user.tag}'s profile`)
      .setColor(process.env.color)
      .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Account ID:', value: targetMember.user.id },
        { name: 'Account Created:', value: moment(targetMember.user.createdAt).format("MM/DD/YY") },
        { name: 'Joined Server:', value: moment(targetMember.joinedAt).format("MM/DD/YY") },
        { name: 'Server Nickname:', value: targetMember.displayName || 'None' }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [memberEmbed], ephemeral: true }).catch(console.error);
  }
};
