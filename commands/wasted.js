const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wasted')
    .setDescription('Apply a "Wasted" filter to a member or yourself')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The member to apply the "Wasted" filter (or yourself)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      const wastedImage = await canvacord.Canvas.wasted(authorAvatar);
      const imageAttachment = new AttachmentBuilder(wastedImage, { name: 'wasted.png' });
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ format: 'png' });
      const wastedImage = await canvacord.Canvas.wasted(memberAvatar);
      const imageAttachment = new AttachmentBuilder(wastedImage, { name: 'wasted.png' });
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
