const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const changeEmbed = new EmbedBuilder()
  .setTitle('TheFrench Changelog')
  .setColor(process.env.color)
  .addFields(
    { name: 'Fixes', value: "We've spent more time putting out fires caused due to bad code, we've mainly tried to make our code infrastructure more efficient.\n" },
    { name: 'New updates', value: "Wordle game is now available to play, use `/todayswordle` to start the game and `/guesswordle` to guess the word.\n" },
    { name: 'Last Updated', value: `<t:1747108896:R>` }
  )
  .setTimestamp();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('Gets you my changelog by the developer'),
  async execute(interaction) {
    await interaction.reply({ embeds: [changeEmbed] }).catch(console.error);
  },
};
