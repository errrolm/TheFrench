const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const request = require('request');

function getRandomCuteDogTitle() {
  const cuteDogTitles = [
    'Adorable Doggo',
    'Pawsitively Cute Pup',
    'Tail-Wagging Happiness',
    'Woof-tastic!',
    'Barking Lovely!',
    'Puppy Love',
  ];
  return cuteDogTitles[Math.floor(Math.random() * cuteDogTitles.length)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Gets you a cute little doggo with a button for a new dog!"),
  async execute(interaction) {
    try {
      request('https://random.dog/woof.json', function (error, response, body) {
        if (error) {
          interaction.reply({ content: error.toString(), ephemeral: true }).catch(console.error);
        } else {
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(body);
          } catch (e) {
            return interaction.reply({ content: '404 Error', ephemeral: true }).catch(console.error);
          }
          const cuteDogTitle = getRandomCuteDogTitle();
          const dogEmbed = new EmbedBuilder()
            .setTitle(cuteDogTitle)
            .setColor(process.env.color)
            .setImage(parsedResponse.url)
            .setTimestamp();
          const newDogButton = new ButtonBuilder()
            .setCustomId('new_dog')
            .setLabel('Woof?')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);
          const row = new ActionRowBuilder().addComponents(newDogButton);
          interaction.reply({ embeds: [dogEmbed], components: [row] }).catch(console.error);
          const filter = (btnInteraction) => btnInteraction.customId === 'new_dog' && btnInteraction.user.id === interaction.user.id;
          const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15000 });
          collector.on('collect', async (buttonInteraction) => {
            request('https://random.dog/woof.json', function (error, response, body) {
              if (!error && response.statusCode === 200) {
                let parsedResponse;
                try {
                  parsedResponse = JSON.parse(body);
                } catch (e) {
                  return buttonInteraction.reply({ content: 'Error parsing response', ephemeral: true }).catch(console.error);
                }
                const newCuteDogTitle = getRandomCuteDogTitle();
                const newDogEmbed = new EmbedBuilder()
                  .setTitle(newCuteDogTitle)
                  .setColor(process.env.color)
                  .setImage(parsedResponse.url)
                  .setTimestamp();
                buttonInteraction.update({ embeds: [newDogEmbed] });
              } else {
                buttonInteraction.reply({ content: 'Failed to fetch a new dog image. Please try again.', ephemeral: true });
              }
            });
          });
          collector.on('end', () => {
            newDogButton.setDisabled(true);
            row.setComponents(newDogButton);
            interaction.editReply({ components: [row] });
          });
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while fetching a cute dog image.', ephemeral: true });
    }
  },
};
