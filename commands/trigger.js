const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trigger')
    .setDescription('Apply a "Triggered" filter to a member or yourself')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to apply the "Triggered" filter (or yourself)')
        .setRequired(false)),
  async execute(interaction) {
    const authorAvatar = interaction.user.displayAvatarURL({ format: 'png' });
    const target = interaction.options.getMember('target');

    if (!target) {
      const botAvatar = interaction.client.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const triggerImage = await canvacord.Canvas.trigger(botAvatar, authorAvatar);
      const imageAttachment = new MessageAttachment(triggerImage, 'trigger.gif');
      await interaction.reply({ files: [imageAttachment] });
    } else {
      const memberAvatar = target.user.displayAvatarURL({ dynamic: false, format: 'png' });
      const triggerImage = await canvacord.Canvas.trigger(memberAvatar);
      const imageAttachment = new MessageAttachment(triggerImage, 'trigger.gif');
      await interaction.reply({ files: [imageAttachment] });
    }
  },
};
