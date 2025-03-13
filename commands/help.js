const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton,  Collection} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const helpRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL('https://discord.com/api/oauth2/authorize?client_id=953557418913181696&permissions=2349190208&scope=bot%20applications.commands')
        .setLabel('Invite me!')
					.setStyle('LINK')
          .setDisabled(false),
        
        new MessageButton()
          .setURL('https://top.gg/bot/953557418913181696')
        .setLabel('Vote on Tog.gg')
					.setStyle('LINK')
          .setDisabled(false),
        
        new MessageButton()
          .setURL('https://discordbotlist.com/bots/thefrench')
        .setLabel('Vote on DBL')
					.setStyle('LINK')
          .setDisabled(false)
);

const helpEmbed = new MessageEmbed()
            .setTitle("How may I help you?")
            .setColor(process.env.color)
            .setTimestamp()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Come on, Get some help'),
    async execute(interaction) {
      const commands = interaction.client.commands;

      for (const command of commands.values()) {
        helpEmbed.addField(command.data.name, command.data.description);
      }
         interaction.reply({ embeds: [helpEmbed],  components: [helpRow] }).catch(console.error)
    }
};

