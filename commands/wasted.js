const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wasted')
    .setDescription('Apply a "Wasted" filter to a member or yourself')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to apply the "Wasted" filter (or yourself)')
        .setRequired(false)),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      const botAvatar = interaction.client.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const wastedImage = await canvacord.Canvas.wasted(authorAvatar);
      const imageAttachment = new MessageAttachment(wastedImage, 'wasted.png');
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const wastedImage = await canvacord.Canvas.wasted(memberAvatar);
      const imageAttachment = new MessageAttachment(wastedImage, 'wasted.png');
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
