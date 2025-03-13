const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spank')
    .setDescription('Spank a member or yourself')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to spank (or yourself)')
        .setRequired(false)),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      const botAvatar = interaction.client.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const spankImage = await canvacord.Canvas.spank(botAvatar, authorAvatar);
      const imageAttachment = new MessageAttachment(spankImage, 'spank.png');
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const spankImage = await canvacord.Canvas.spank(authorAvatar, memberAvatar);
      const imageAttachment = new MessageAttachment(spankImage, 'spank.png');
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
