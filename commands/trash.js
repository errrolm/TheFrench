const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trash')
    .setDescription('Apply a "Trash" filter to a member or yourself')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The member to apply the "Trash" filter (or yourself)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      const trashImage = await canvacord.Canvas.trash(authorAvatar);
      const imageAttachment = new AttachmentBuilder(trashImage, { name: 'trash.png' });
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ format: 'png' });
      const trashImage = await canvacord.Canvas.trash(memberAvatar);
      const imageAttachment = new AttachmentBuilder(trashImage, { name: 'trash.png' });
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
