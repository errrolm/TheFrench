const { SlashCommandBuilder } = require('@discordjs/builders');
const games = require('../wordleState');
const db = require('../database');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('todayswordle')
    .setDescription('Start today’s Wordle'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const last = await db.get(`last_played_${userId}`);
      const today = moment().utc().format('YYYY-MM-DD');
      if (last === today) {
        return interaction.reply({ content: '❌ You have already played today. Come back tomorrow!', ephemeral: true });
      }
      games.set(userId, { guesses: [] });
      await interaction.reply('Today’s Wordle started! Use `/guesswordle` to make a guess.');
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Could not start Wordle. Try again later.', ephemeral: true });
    }
  },
};
