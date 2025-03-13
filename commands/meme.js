const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const memes = require('random-memes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme.'),
  async execute(interaction) {
    async function sendMeme() {
      try {
        const meme = await memes.random();

        const memeEmbed = {
          color: process.env.color,
          title: meme.caption,
          image: { url: meme.image },
          footer: { text: `Category: ${meme.category}` },
        };

        await interaction.reply({ embeds: [memeEmbed] });

      } catch (error) {
        console.error(error);
        await interaction.followUp({content: 'Uh-oh! Our memer went on a coffee break. Better luck next time!', ephemeral: true});
      }
    }

    sendMeme();
  },
};
