const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with 🏓pong'),
    async execute(interaction) {
        interaction.reply({ content: '🏓 Pong',  ephemeral: true }).catch(console.error);
    }
};