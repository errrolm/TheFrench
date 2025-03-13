const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const changeEmbed = new MessageEmbed()
  .setTitle('TheFrench Changelog')
  .setColor(process.env.color)
  .addFields(
              { name: 'Fixes', value: `We've spent more time putting out fires caused due to bad code, we've mainly tried to make out code infrastructure more efficient.\n `},
              { name: "New updates", value: `Let's get into the spirit of christmas with commands to match the vibe.` },
              { name: "Last Updated", value: `<t:1701185449:R>` }
            )
  .setTimestamp()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Gets you my changelog by the developer'),
    async execute(interaction) {
        await interaction.reply({ embeds: [changeEmbed] }).catch(console.error);
    }
};