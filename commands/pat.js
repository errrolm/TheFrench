const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Pat someone')
      .addUserOption((option) =>
          option
                  .setName('member')
                  .setDescription('Who do you want to pat?')
                  .setRequired(true)
          )
  .addStringOption((option) =>
          option
                  .setName('message')
                  .setDescription('Your message')
                  .setRequired(true)
          ),
    async execute(interaction) {
    let message = interaction.options.getString('message');
    let member = interaction.options.getMember('member')
      
    interaction.reply({ content: `${interaction.user} patted ${member} and said ${message}` }).catch(console.error);
    }
};