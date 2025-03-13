// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageEmbed } = require('discord.js');
// const db = require('../database');
// const emojiServerId = '1173442208129634455';

// const commandCooldown = 7200;

// const cooldowns = {};

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('rollsnowball')
//     .setDescription('Roll a snowball.'),
//   async execute(interaction) {
//     const userId = interaction.user.id;

//     if (cooldowns[userId] && cooldowns[userId] > Date.now()) {
//       const remainingTime = (cooldowns[userId] - Date.now()) / 1000;
//       return interaction.reply({
//         content: `You can only roll one snowball every 2 hours.`,
//         ephemeral: true,
//       });
//     }

//     cooldowns[userId] = Date.now() + commandCooldown * 1000;

//     async function getRandom() {
//       await db.add(`snowballs_${interaction.user.id}`, 1);
//       const balance = await db.get(`snowballs_${interaction.user.id}`) || 0;
//       const server = interaction.client.guilds.cache.get(emojiServerId);
//       const snowballEmoji = server.emojis.cache.find((e) => e.name === 'snowball');
//       const treeEmoji = server.emojis.cache.find((e) => e.name === 'pixeltree');

//       const balEmbed = new MessageEmbed()
//         .setTitle(`${interaction.user.username} rolled up a snowball.`)
//         .setDescription(`${interaction.user} now has ${snowballEmoji}${balance} snowballs.\n${treeEmoji}You may begin using these via the /throwsnowball command.${treeEmoji}`)
//         .setColor(process.env.color)
//         .setTimestamp();

//       interaction.reply({ embeds: [balEmbed] }).catch(console.error);
//     }

//     getRandom();
//   },
// };
