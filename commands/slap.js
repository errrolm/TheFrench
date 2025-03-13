const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap a member or yourself')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to slap (or yourself)')
        .setRequired(false)), // Make the option not required
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      // If no member is mentioned, slap the user who executed the command
      const botAvatar = interaction.client.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const slapImage = await canvacord.Canvas.slap(botAvatar, authorAvatar);
      const imageAttachment = new MessageAttachment(slapImage, 'slap.png');
      await interaction.reply({ files: [imageAttachment] });
    } else {
      // If a member is mentioned, slap the mentioned member
      const memberAvatar = target.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const slapImage = await canvacord.Canvas.slap(authorAvatar, memberAvatar);
      const imageAttachment = new MessageAttachment(slapImage, 'slap.png');
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
