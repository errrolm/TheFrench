const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const request = require('request');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('space')
    .setDescription("Gets you an image from space!"),
  async execute(interaction) {
    request(
      'https://api.nasa.gov/planetary/apod?api_key=YYzxBE1FfmEzZvzWXCPX5qliuslXFbXbQOluaDfW',
      (error, response, body) => {
        if (error) {
          return interaction.reply({ content: error.toString(), ephemeral: true }).catch(console.error);
        }
        try {
          const parsedResponse = JSON.parse(body);
          const spaceEmbed = new EmbedBuilder()
            .setTitle('An image from space appeared!')
            .setColor(process.env.color)
            .setImage(parsedResponse.url)
            .setTimestamp();
          interaction.reply({ embeds: [spaceEmbed] }).catch(console.error);
        } catch (err) {
          console.error(err);
          interaction.reply({ content: 'Error parsing NASA response.', ephemeral: true }).catch(console.error);
        }
      }
    );
  },
};
