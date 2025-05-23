const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('share')
    .setDescription('Share coins with another user')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Enter the amount of coins to share')
        .setRequired(true)
    )
    .addUserOption(option =>
      option
        .setName('recipient')
        .setDescription('Mention the user to share coins with')
        .setRequired(true)
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const recipient = interaction.options.getMember('recipient');
    const senderBalance = (await db.get(`balance_${interaction.user.id}`)) || 0;

    if (!amount || amount <= 0) {
      return interaction.reply({ content: 'Please provide a valid amount of coins to share.', ephemeral: true });
    }
    if (amount > senderBalance) {
      return interaction.reply({ content: 'You do not have enough coins to share.', ephemeral: true });
    }
    if (interaction.user.id === recipient.user.id) {
      return interaction.reply({ content: 'You cannot share coins with yourself.', ephemeral: true });
    }
    if (recipient.user.bot) {
      return interaction.reply({ content: 'You cannot share coins with a bot.', ephemeral: true });
    }

    await db.sub(`balance_${interaction.user.id}`, amount);
    await db.add(`balance_${recipient.id}`, amount);
    await interaction.reply({ content: `${interaction.user.username} shared ⏣${amount} with ${recipient.user.username} successfully!` });
  },
};
