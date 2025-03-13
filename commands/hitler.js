const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hitler')
    .setDescription('Apply a "Hitler" filter to a member or yourself')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The member to apply the "Hitler" filter (or yourself)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');
    if (!target) {
      const hitlerImage = await canvacord.Canvas.hitler(authorAvatar);
      const imageAttachment = new AttachmentBuilder(hitlerImage, { name: 'hitler.png' });
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ format: 'png' });
      const hitlerImage = await canvacord.Canvas.hitler(memberAvatar);
      const imageAttachment = new AttachmentBuilder(hitlerImage, { name: 'hitler.png' });
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
