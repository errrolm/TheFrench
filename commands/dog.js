const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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

    const randomIndex = Math.floor(Math.random() * cuteDogTitles.length);
    return cuteDogTitles[randomIndex];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dog")
        .setDescription("Gets you a cute little doggo with a button for a new dog!"),
    async execute(interaction) {
        try {
            request('https://random.dog/woof.json', function (error, response, body) {
                if (error) {
                    interaction.reply(error).catch(console.error);
                } else {
                    function parseMyHeader() {
                        try {
                            return JSON.parse(body);
                        } catch (e) {
                            return interaction.reply({ content: '404 Error', ephemeral: true }).catch(console.error);
                        }
                    }

                    const parsedResponse = parseMyHeader();

                    const cuteDogTitle = getRandomCuteDogTitle();

                    const dogEmbed = new MessageEmbed()
                        .setTitle(cuteDogTitle)
                        .setColor(process.env.color)
                        .setImage(parsedResponse.url)
                        .setTimestamp();

                    const newDogButton = new MessageButton()
                        .setCustomId('new_dog')
                        .setLabel('Woof?')
                        .setStyle('PRIMARY')
                        .setDisabled(false); // This sets the button to be initially enabled.

                    const row = new MessageActionRow().addComponents(newDogButton);

                    interaction.reply({ embeds: [dogEmbed], components: [row] }).catch(console.error);

                    const filter = (btnInteraction) => btnInteraction.customId === 'new_dog' && btnInteraction.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                    collector.on('collect', async (buttonInteraction) => {
                        request('https://random.dog/woof.json', function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                const parsedResponse = JSON.parse(body);
                                const cuteDogTitle = getRandomCuteDogTitle();

                                const dogEmbed = new MessageEmbed()
                                    .setTitle(cuteDogTitle)
                                    .setColor(process.env.color)
                                    .setImage(parsedResponse.url)
                                    .setTimestamp();

                                buttonInteraction.update({ embeds: [dogEmbed] });
                            } else {
                                buttonInteraction.update('Failed to fetch a new dog image. Please try again.', { ephemeral: true });
                            }
                        });
                    });

                    collector.on('end', (collected) => {
                        newDogButton.setDisabled(true); // Disable the button after the time limit has been reached.
                        interaction.editReply({ components: [row] });
                    });
                }
            });
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching a cute dog image.');
        }
    },
};
