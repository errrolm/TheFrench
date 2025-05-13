const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const db = require("../database");
const games = require("../wordleState");
const moment = require("moment");

const toEmoji = (feedback) =>
  feedback
    .map((ci) =>
      ci.scoring.correct_idx ? "🟩" : ci.scoring.in_word ? "🟨" : "⬜",
    )
    .join("");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guesswordle")
    .setDescription("Guess the current Wordle")
    .addStringOption((opt) =>
      opt
        .setName("word")
        .setDescription("Your 5-letter guess")
        .setRequired(true),
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const game = games.get(userId);
      if (!game) {
        return interaction.reply({
          content: "❌ You must start with `/todayswordle`.",
          ephemeral: true,
        });
      }
      const word = interaction.options.getString("word").toLowerCase();
      if (!/^[a-z]{5}$/.test(word)) {
        return interaction.reply({
          content: "❌ Enter a valid 5-letter word.",
          ephemeral: true,
        });
      }

      const { data } = await axios.post(
        "https://wordle-api.vercel.app/api/wordle",
        { guess: word },
      );
      const feedback = data.was_correct
        ? "🟩🟩🟩🟩🟩"
        : toEmoji(data.character_info);
      game.guesses.push(feedback);

      const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s Wordle`)
        .setColor(data.was_correct ? "Green" : "Yellow")
        .addFields(
          {
            name: "Guesses Left",
            value: `${6 - game.guesses.length}`,
            inline: true,
          },
          {
            name: "History",
            value: game.guesses.map((guess) => `\`${guess}\`\n`).join(""),
            inline: true,
          }, // Vertical spacing here
        )
        .setTimestamp();

      if (data.was_correct) {
        await db.add(`balance_${userId}`, 1000);
        games.delete(userId);
        await db.set(
          `last_played_${userId}`,
          moment().utc().format("YYYY-MM-DD"),
        );
        return interaction.reply({
          embeds: [embed.setDescription(`🎉 Correct! You earned ⏣1000.`)],
        });
      }

      if (game.guesses.length >= 6) {
        games.delete(userId);
        await db.set(
          `last_played_${userId}`,
          moment().utc().format("YYYY-MM-DD"),
        );
        return interaction.reply({
          embeds: [
            embed.setDescription(`❌ Out of guesses! Try again tomorrow.`),
          ],
        });
      }

      await interaction.reply({
        embeds: [
          embed.setDescription(`${feedback} (${game.guesses.length}/6)`),
        ],
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Could not process your guess. Try again later.",
        ephemeral: true,
      });
    }
  },
};
