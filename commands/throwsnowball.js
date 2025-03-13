// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageEmbed } = require('discord.js');
// const db = require('../database');
// const emojiServerId = '1173442208129634455';

// const commandCooldown = 20;
// const cooldowns = new Set();

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

// const winterRanks = [
//   { name: 'Snowflake Apprentice', minHits: 0, maxHits: 10 },
//   { name: 'Frosty Fighter', minHits: 11, maxHits: 20 },
//   { name: 'Ice Master', minHits: 21, maxHits: 30 },
//   { name: 'Blizzard Champion', minHits: 31, maxHits: 50 },
//   { name: 'Snowstorm Conqueror', minHits: 51, maxHits: 100 },
//   { name: 'Winter Legend', minHits: 101, maxHits: Infinity },
// ];

// function getWinterRank(hits) {
//   for (const rank of winterRanks) {
//     if (hits >= rank.minHits && hits <= rank.maxHits) {
//       return rank.name;
//     }
//   }
//   return 'Winter Legend';
// }

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('throwsnowball')
//     .setDescription('Throw a snowball at someone.')
//     .addUserOption(option =>
//       option.setName('target')
//         .setDescription('The user you want to throw a snowball at.')
//         .setRequired(true)),
//   async execute(interaction) {
//     const userId = interaction.user.id;

//     if (cooldowns.has(userId)) {
//       return interaction.reply({
//         content: `You can only throw a snowball every ${commandCooldown} seconds.`,
//         ephemeral: true,
//       });
//     }

//     const targetUser = interaction.options.getUser('target');
//     if (!targetUser) {
//       return interaction.reply({
//         content: 'Please mention a user to throw a snowball at.',
//         ephemeral: true,
//       });
//     }

//     const initiatorSnowballs = await db.get(`snowballs_${interaction.user.id}`) || 0;
//     const targetSnowballs = await db.get(`snowballs_${targetUser.id}`) || 0;

//     if (initiatorSnowballs < 1) {
//       return interaction.reply({
//         content: 'You don\'t have any snowballs to throw!',
//         ephemeral: true,
//       });
//     }

//     const hitProbability = 0.6;
//     const hit = Math.random() < hitProbability;

//     if (hit) {
//       db.sub(`snowballs_${interaction.user.id}`, 1);
//       db.add(`snowballs_${targetUser.id}`, 1);

//       cooldowns.add(userId);
//       setTimeout(() => {
//         cooldowns.delete(userId);
//       }, commandCooldown * 1000);

//       const server = interaction.client.guilds.cache.get(emojiServerId);
//       const snowballEmoji = server.emojis.cache.find((e) => e.name === 'snowball');

//       const rankEmbed = new MessageEmbed()
//         .setTitle('Snowball Fight!')
//         .setDescription(`${interaction.user} threw a ${snowballEmoji} snowball at ${targetUser}.\n${interaction.user} got ⏣100 in the process.`)
//         .addField('Winter Rank', getWinterRank(targetSnowballs + 1))
//         .setColor(process.env.color);

//       db.add(`balance_${interaction.user.id}`, 100);
//       interaction.reply({ embeds: [rankEmbed] });
//     } else {
//       const missProbability = 0.4;
//       const miss = Math.random() < missProbability;

//       const missQuotes = [
//         "Oops! The snowball missed the target!",
//         "The snowball sailed wide. Better luck next time!",
//         "A swing and a miss! The target narrowly avoided the snowball.",
//       ];

//       const missQuote = miss ? ` ${missQuotes[getRandomInt(missQuotes.length)]}` : '';

//       const rankEmbed = new MessageEmbed()
//         .setTitle('Snowball Fight!')
//         .setDescription(`${interaction.user} threw a snowball at ${targetUser}.${missQuote}\n${interaction.user} lost ⏣100 in the process.`)
//         .addField('Winter Rank', getWinterRank(targetSnowballs))
//         .setColor(process.env.color);

//       db.add(`balance_${targetUser.id}`, 100);
//       db.sub(`balance_${interaction.user.id}`, 100);
//       interaction.reply({ embeds: [rankEmbed] });
//     }
//   },
// };
