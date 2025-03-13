const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comic')
    .setDescription('Get a random XKCD comic'),
  async execute(interaction) {
    try {
      const maxComicNumber = 2500;
      const randomComicNumber = Math.floor(Math.random() * maxComicNumber) + 1;
      const apiUrl = `https://xkcd.com/${randomComicNumber}/info.0.json`;
      const response = await fetch(apiUrl);
      const comicData = await response.json();
      const comicEmbed = new EmbedBuilder()
        .setTitle(`XKCD Comic #${comicData.num}: ${comicData.title}`)
        .setImage(comicData.img)
        .setURL(`https://xkcd.com/${comicData.num}`)
        .setFooter({ text: `Description: ${comicData.alt}` })
        .setColor(process.env.color);
      await interaction.reply({ embeds: [comicEmbed] });
    } catch (error) {
      console.error('Error fetching XKCD comic:', error);
      await interaction.reply('An error occurred while fetching the XKCD comic.');
    }
  },
};
