const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jail')
    .setDescription('Jail a member or yourself')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to jail (or yourself)')
        .setRequired(false)),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      const botAvatar = interaction.client.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const jailImage = await canvacord.Canvas.jail(botAvatar, authorAvatar);
      const imageAttachment = new MessageAttachment(jailImage, 'jail.png');
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const jailImage = await canvacord.Canvas.jail(authorAvatar, memberAvatar);
      const imageAttachment = new MessageAttachment(jailImage, 'jail.png');
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
