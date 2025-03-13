const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const request = require('request');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('space')
        .setDescription("Gets you an image from space!"),
    async execute(interaction) {
      request('https://api.nasa.gov/planetary/apod?api_key=YYzxBE1FfmEzZvzWXCPX5qliuslXFbXbQOluaDfW', function (error, response, body) {
                if(error) {
                   interaction.reply(error).catch(console.error);
                }
                else {
                    const parsedResponse = JSON.parse(body);
                    const spaceEmbed = new MessageEmbed()
                  .setTitle('An image from space appeared!')
                  .setColor(process.env.color)
                  .setImage(parsedResponse.url)
                  .setTimestamp()
                  interaction.reply({embeds: [spaceEmbed]}).catch(console.error);
                }
            });
    }
}