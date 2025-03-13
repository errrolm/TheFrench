const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member-info')
        .setDescription('Gets you info about a member')
        .addUserOption((option) =>
          option
                  .setName('member')
                  .setDescription('Choose a member')
                  .setRequired(false)
          ),
  
    async execute(interaction) {
      const member = interaction.options.getMember('member');
      if(!member){
        const memberEmbed = new MessageEmbed()
      .setTitle(`${interaction.user.tag}'s profile`)
      .setColor(process.env.color)
      .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
		    { name: 'Account ID:', value: interaction.user.id },
		    { name: 'Account Created:', value: moment(interaction.user.createdAt).format("MM/DD/YY") },
        { name: 'Joined server:', value: moment(interaction.user.joinedAt).format("MM/DD/YY") },
        { name: 'Server Nickname:', value: `${interaction.user.displayName}` }
	      )
      .setTimestamp()
        interaction.reply({ embeds: [memberEmbed], ephemeral: true }).catch(console.error);
      } else {
      const memberEmbed = new MessageEmbed()
      .setTitle(`${member.user.tag}'s profile`)
      .setColor(process.env.color)
      .setThumbnail(member.user.displayAvatarURL())
        .addFields(
		    { name: 'Account ID:', value: member.user.id },
		    { name: 'Account Created:', value: moment(member.user.createdAt).format("MM/DD/YY") },
        { name: 'Joined server:', value: moment(member.user.joinedAt).format("MM/DD/YY") },
        { name: 'Server Nickname:', value: `${member.user.displayName}` }
	      )
      .setTimestamp()
        interaction.reply({ embeds: [memberEmbed], ephemeral: true }).catch(console.error);
      }
      
    }
};