const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap a member or yourself')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The member to slap (or yourself)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      const botAvatar = interaction.client.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const slapImage = await canvacord.Canvas.slap(botAvatar, authorAvatar);
      const imageAttachment = new AttachmentBuilder(slapImage, { name: 'slap.png' });
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const slapImage = await canvacord.Canvas.slap(authorAvatar, memberAvatar);
      const imageAttachment = new AttachmentBuilder(slapImage, { name: 'slap.png' });
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
