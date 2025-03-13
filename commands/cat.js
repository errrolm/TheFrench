const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require('axios');

function getRandomCuteTitle() {
  const cuteTitles = [
    'Adorable Cat',
    'Fluffy Kitty',
    'Cuteness Overload',
    'Purrfect Cat',
    'Sweet Feline Friend',
    'Charming Kitty',
    'Pawsitively Adorable!',
    'Meow-gnificent!',
    'Purr-fectly Cute',
    'Feline Fine!',
    'Whisker-tastic!',
    'Cattitude is Everything!',
  ];

  const randomIndex = Math.floor(Math.random() * cuteTitles.length);
  return cuteTitles[randomIndex];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a cute cat image with a button for a new image'),
  async execute(interaction) {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search');

      if (response.status === 200 && response.data.length > 0) {
        const catImageUrl = response.data[0].url;

        const newCatButton = new MessageButton()
          .setCustomId('new_cat')
          .setLabel('Meow?')
          .setStyle('PRIMARY');

        const row = new MessageActionRow().addComponents(newCatButton);

        const cuteTitle = getRandomCuteTitle();

        const catEmbed = new MessageEmbed()
          .setColor(process.env.color)
          .setTitle(cuteTitle)
          .setImage(catImageUrl);

        await interaction.deferReply();

        const initialMessage = await interaction.followUp({ embeds: [catEmbed], components: [row] });

        const collector = initialMessage.createMessageComponentCollector({
          componentType: 'BUTTON',
          time: 60000,
        });

        collector.on('collect', async (buttonInteraction) => {
          if (buttonInteraction.customId === 'new_cat') {
            if (buttonInteraction.user.id === interaction.user.id) {
              const newResponse = await axios.get('https://api.thecatapi.com/v1/images/search');
              if (newResponse.status === 200 && newResponse.data.length > 0) {
                const newCatImageUrl = newResponse.data[0].url;
                const newCuteTitle = getRandomCuteTitle();
                const newCatEmbed = new MessageEmbed()
                  .setColor('#0099ff')
                  .setTitle(newCuteTitle)
                  .setImage(newCatImageUrl);
                await buttonInteraction.update({ embeds: [newCatEmbed] });
              }
            } else {
              await buttonInteraction.reply('Sorry, only the user who used the command can click this button.');
            }
          }
        });

        collector.on('end', (collected, reason) => {
          if (reason === 'time') {
            newCatButton.setDisabled(true);
            row.components = [newCatButton];
            initialMessage.edit({ components: [row] });
          }
        });
      } else {
        await interaction.followUp('Unable to fetch a cute cat image.');
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred while fetching a cute cat image.');
    }
  },
};
