const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('Receive a random fortune.'),
  async execute(interaction) {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      interaction.reply(data.content);
    } catch (error) {
      console.error(error);
      interaction.reply('An error occurred while fetching a fortune.');
    }
  },
};
