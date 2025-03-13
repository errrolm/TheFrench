const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const memes = require('random-memes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme.'),
  async execute(interaction) {
    async function sendMeme() {
      try {
        const meme = await memes.random();
        const memeEmbed = new EmbedBuilder()
          .setColor(process.env.color)
          .setTitle(meme.caption)
          .setImage(meme.image)
          .setFooter({ text: `Category: ${meme.category}` });
        await interaction.reply({ embeds: [memeEmbed] });
      } catch (error) {
        console.error(error);
        await interaction.followUp({ content: 'Uh-oh! Our memer went on a coffee break. Better luck next time!', ephemeral: true });
      }
    }
    sendMeme();
  },
};
