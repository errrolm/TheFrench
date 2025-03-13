const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('../database');
const emojiServerId = '1173442208129634455'; 
// const mysteryBoxes = [
//   { name: 'Shiny Surprise Box', price: 100, rewards: ['Golden Coin', 'Magic Gem', 'Lucky Charm'] },
//   { name: 'Enchanted Chest', price: 200, rewards: ['Mystic Potion', 'Ancient Scroll', 'Dragon Scale'] },
//   { name: 'Mystical Reliquary', price: 500, rewards: ['Eternal Crystal', 'Phoenix Feather', 'Enchanted Elixir'] },
//   { name: 'Super Expensive Box', price: , rewards: ['Mythical Artifact', 'Celestial Orb', 'Epic Treasure'] },
// ];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View and purchase mystery boxes in the shop.'),
  async execute(interaction) {
    const server = interaction.client.guilds.cache.get(emojiServerId); 
    const shiny = server.emojis.cache.find((e) => e.name === 'commonbox');
    const enchanted = server.emojis.cache.find((e) => e.name === 'enchantedbox');
    const mystical = server.emojis.cache.find((e) => e.name === 'mysticalbox');
    const errols = server.emojis.cache.find((e) => e.name === 'errolsbox');

    const shopEmbed = new MessageEmbed()
    .setColor(process.env.color)
    .setTitle('TheFrench Shop')
    .setDescription('Shop command coming soon.')
      // .addFields(
      //   { name: `${shiny}Shiny Surprise Box`, value: 'Cost: ⏣1000'},
      //   { name: `${enchanted}Enchanted Chest`, value: 'Cost: ⏣2000'},
      //   { name: `${mystical}Mystical Reliquary`, value: 'Cost: ⏣5000'},
      //   { name: `${errols}Errol's box`, value: 'Cost: ⏣690000000, Phoenix Feather, Enchanted Elixir' }
      // )
    .setTimestamp()
    .setFooter({ text: 'Coming soon.' });

    await interaction.reply({ embeds: [shopEmbed] });
    
  },
};
