const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
const he = require('he');
const db = require('../database');

const commandCooldown = 20;
const cooldowns = {};

const API_BASE_URL = 'https://opentdb.com/api.php';
const API_AMOUNT = 1;
const API_CATEGORY = 9;
const API_DIFFICULTY = 'medium';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Answer a trivia question.'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      if (cooldowns[userId] && cooldowns[userId] > Date.now()) {
        const remainingTime = (cooldowns[userId] - Date.now()) / 1000;
        return interaction.reply({ content: `You are on cooldown. Please wait ${remainingTime.toFixed(1)} seconds.`, ephemeral: true });
      }

      cooldowns[userId] = Date.now() + commandCooldown * 1000;

      const response = await fetch(
        `${API_BASE_URL}?amount=${API_AMOUNT}&category=${API_CATEGORY}&difficulty=${API_DIFFICULTY}&type=multiple`
      );
      const data = await response.json();

      if (data.results.length === 0) {
        throw new Error('No trivia questions found.');
      }

      const item = data.results[0];
      const correctAnswer = item.correct_answer;
      const incorrectAnswers = item.incorrect_answers.map((answer) => he.decode(answer));
      const answers = [...incorrectAnswers, correctAnswer];
      answers.sort(() => Math.random() - 0.5);

      const row = new MessageActionRow();
      const buttons = [];

      for (const answer of answers) {
        buttons.push(
          new MessageButton()
            .setCustomId(answer)
            .setLabel(answer)
            .setStyle('PRIMARY')
        );
      }

      row.addComponents(buttons);

      await interaction.reply({
        content: he.decode(item.question),
        components: [row],
      });

      const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });

      collector.on('collect', async (btn) => {
        buttons.forEach((button) => {
          button.setDisabled(true);
        });

        if (btn.customId === correctAnswer) {
          db.add(`balance_${btn.user.id}`, 100);
          await interaction.editReply({
            content: `${btn.user.tag} got the correct answer and was awarded ⏣100! The answer was: ${correctAnswer}`,
            components: [row],
          });
        } else {
          await interaction.editReply({
            content: `${btn.user.tag} gave an incorrect answer. The correct answer was: ${correctAnswer}`,
            components: [row],
          });
        }
      });

      collector.on('end', () => {
        buttons.forEach((button) => {
          button.setDisabled(true);
        });
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred while fetching a trivia question.');
    }
  },
};
