const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('../database');

const commandCooldown = 20;
const cooldowns = {};

const searchOptions = ['Under the sofa', 'In the backyard', 'In the kitchen', 'In the attic', 'At the park'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for money or cheese'),
  async execute(interaction) {
    const userId = interaction.user.id;

    if (cooldowns[userId] && cooldowns[userId] > Date.now()) {
      const remainingTime = (cooldowns[userId] - Date.now()) / 1000;
      return interaction.reply({ content: `You are on cooldown. Please wait ${remainingTime.toFixed(1)} seconds.`, ephemeral: true });
    }

    cooldowns[userId] = Date.now() + commandCooldown * 1000;

    const randomValue = Math.random();

    const randomPlace = searchOptions[Math.floor(Math.random() * searchOptions.length)];

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('search_money')
          .setLabel('Search for Money')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('search_cheese')
          .setLabel('Search for Cheese')
          .setStyle('PRIMARY'),
      );

    interaction.reply({
      content: `Choose what to search for in ${randomPlace}:`,
      components: [row],
    });

    setTimeout(() => {
      row.components.forEach(button => button.setDisabled(true));
      interaction.editReply({
        content: 'You took too long to make a choice. The search has ended.',
        components: [row],
      });
    }, 15000);

    const filter = i => {
      i.deferUpdate();
      return i.user.id === userId && (i.customId === 'search_money' || i.customId === 'search_cheese');
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', i => {
      row.components.forEach(button => button.setDisabled(true));

      const choice = i.customId;
      let resultText = '';

      if (randomValue < 0.3) {
        const amount = Math.floor(Math.random() * 100) + 1;
        db.add(`balance_${interaction.user.id}`, amount);

        resultText = `You searched ${randomPlace} for money and found ⏣${amount}.`;
      } else if (randomValue >= 0.3 && randomValue < 0.6) {
        db.add(`cheese_${interaction.user.id}`, 1);
        resultText = `You searched ${randomPlace} and found a 🧀 cheese piece.`;
      } else {
        const errorMessages = [
          "You couldn't find anything even though you searched really hard. Maybe next time!",
          "Oops! Your search in ${randomPlace} didn't yield any results. Keep exploring!",
          `You searched ${randomPlace}, but it seems luck wasn't on your side. Try again!`,
        ];
        resultText = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      }

      const resultEmbed = new MessageEmbed()
        .setTitle(`${interaction.user.username} searched ${randomPlace}.`)
        .setDescription(resultText)
        .setColor(process.env.color)
        .setTimestamp();

      interaction.editReply({ embeds: [resultEmbed], components: [row] }).catch(console.error);

      collector.stop();
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply('You took too long to make a choice. The search has ended.');
      }
    });
  },
};
