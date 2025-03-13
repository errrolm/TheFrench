const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const replyOptions = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it.",
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask me a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your Question')
        .setRequired(true)
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(interaction.options.getString('question'))
      .setColor(process.env.color)
      .setDescription(replyOptions[Math.floor(Math.random() * replyOptions.length)]);
    await interaction.reply({ embeds: [embed] });
  },
};
