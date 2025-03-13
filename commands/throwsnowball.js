const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database');
const emojiServerId = '1173442208129634455'; 

const commandCooldown = 20;
const cooldowns = new Set();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const winterRanks = [
  { name: 'Snowflake Apprentice', minHits: 0, maxHits: 10 },
  { name: 'Frosty Fighter', minHits: 11, maxHits: 20 },
  { name: 'Ice Master', minHits: 21, maxHits: 30 },
  { name: 'Blizzard Champion', minHits: 31, maxHits: 50 },
  { name: 'Snowstorm Conqueror', minHits: 51, maxHits: 100 },
  { name: 'Winter Legend', minHits: 101, maxHits: Infinity },
];

function getWinterRank(hits) {
  for (const rank of winterRanks) {
    if (hits >= rank.minHits && hits <= rank.maxHits) {
      return rank.name;
    }
  }
  return 'Winter Legend';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('throwsnowball')
    .setDescription('Throw a snowball at someone. (December only)')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user you want to throw a snowball at.')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Only allow the command during December (month 11, since January is 0)
    if (new Date().getMonth() !== 11) {
      return interaction.reply({
        content: 'This command is only available during December!',
        ephemeral: true,
      });
    }

    const userId = interaction.user.id;

    if (cooldowns.has(userId)) {
      return interaction.reply({
        content: `You can only throw a snowball every ${commandCooldown} seconds.`,
        ephemeral: true,
      });
    }

    const targetUser = interaction.options.getUser('target');
    if (!targetUser) {
      return interaction.reply({
        content: 'Please mention a user to throw a snowball at.',
        ephemeral: true,
      });
    }

    const initiatorSnowballs = (await db.get(`snowballs_${interaction.user.id}`)) || 0;
    const targetSnowballs = (await db.get(`snowballs_${targetUser.id}`)) || 0;

    if (initiatorSnowballs < 1) {
      return interaction.reply({
        content: "You don't have any snowballs to throw!",
        ephemeral: true,
      });
    }

    const hitProbability = 0.6;
    const hit = Math.random() < hitProbability;

    if (hit) {
      await db.sub(`snowballs_${interaction.user.id}`, 1);
      await db.add(`snowballs_${targetUser.id}`, 1);

      cooldowns.add(userId);
      setTimeout(() => {
        cooldowns.delete(userId);
      }, commandCooldown * 1000);

      const server = interaction.client.guilds.cache.get(emojiServerId);
      const snowballEmoji = server.emojis.cache.find(e => e.name === 'snowball');

      const rankEmbed = new EmbedBuilder()
        .setTitle('Snowball Fight!')
        .setDescription(`${interaction.user} threw a ${snowballEmoji} snowball at ${targetUser}.\n${interaction.user} got ⏣100 in the process.`)
        .addFields({ name: 'Winter Rank', value: getWinterRank(targetSnowballs + 1) })
        .setColor(process.env.color);

      await db.add(`balance_${interaction.user.id}`, 100);
      interaction.reply({ embeds: [rankEmbed] });
    } else {
      const missQuotes = [
        "You couldn't find anything even though you searched really hard. Maybe next time!",
        `Oops! Your search in the current spot didn't yield any results. Keep exploring!`,
        `You missed! It seems luck wasn't on your side. Try again!`,
      ];
      const missQuote = missQuotes[getRandomInt(missQuotes.length)];

      const rankEmbed = new EmbedBuilder()
        .setTitle('Snowball Fight!')
        .setDescription(`${interaction.user} threw a snowball at ${targetUser}.${missQuote}\n${interaction.user} lost ⏣100 in the process.`)
        .addFields({ name: 'Winter Rank', value: getWinterRank(targetSnowballs) })
        .setColor(process.env.color);

      await db.add(`balance_${targetUser.id}`, 100);
      await db.sub(`balance_${interaction.user.id}`, 100);
      interaction.reply({ embeds: [rankEmbed] });
    }
  },
};
