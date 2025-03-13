const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database');

const commandCooldown = 10;
const cooldowns = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('highlow')
    .setDescription('Play the high-low game for a chance to win coins or the jackpot.'),
  async execute(interaction) {
    const userId = interaction.user.id;

    if (cooldowns[userId]) {
      const remainingTime = (cooldowns[userId] - Date.now()) / 1000;
      return interaction.reply({ content: `You are on cooldown. Please wait ${remainingTime.toFixed(1)} seconds.`, ephemeral: true });
    }

    cooldowns[userId] = Date.now() + commandCooldown * 1000;
    setTimeout(() => {
      delete cooldowns[userId];
    }, commandCooldown * 1000);

    const originalNumber = Math.floor(Math.random() * 100) + 1;
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}, guess if the next number will be higher, lower, or jackpot:`)
      .setDescription(`Original Number: ${originalNumber}`)
      .setColor(process.env.color)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('higher').setLabel('Higher').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('lower').setLabel('Lower').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('jackpot').setLabel('Jackpot').setStyle(ButtonStyle.Primary)
    );

    try {
      await interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(error);
    }

    const filter = i => {
      i.deferUpdate();
      return i.user.id === userId && (i.customId === 'higher' || i.customId === 'lower' || i.customId === 'jackpot');
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });

    collector.on('collect', async i => {
      const choice = i.customId;
      row.components.forEach(button => button.setDisabled(true));
      await interaction.editReply({ embeds: [embed], components: [row] });

      const nextNumber = Math.floor(Math.random() * 100) + 1;
      let resultText = '';

      if (
        (choice === 'higher' && nextNumber > originalNumber) ||
        (choice === 'lower' && nextNumber < originalNumber) ||
        (choice === 'jackpot' && Math.random() < 0.04)
      ) {
        const amountWon = 100;
        db.add(`balance_${userId}`, amountWon);
        resultText = `Congratulations! You guessed correctly and won ⏣${amountWon}.`;
      } else {
        resultText = `Sorry, you guessed incorrectly.`;
      }

      const resultEmbed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} played High-Low.`)
        .setDescription(resultText)
        .addFields(
          { name: 'Original Number', value: originalNumber.toString(), inline: true },
          { name: 'Next Number', value: nextNumber.toString(), inline: true }
        )
        .setColor(process.env.color)
        .setTimestamp();

      row.components.forEach(button => button.setDisabled(false));
      await interaction.followUp({ embeds: [resultEmbed] });
      collector.stop();
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        try {
          interaction.followUp('You took too long to make a choice. The game has ended.');
        } catch (error) {
          console.error(error);
        }
      }
    });
  },
};
