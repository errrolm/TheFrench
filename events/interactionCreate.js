const { MessageEmbed } =  require('discord.js');
const db = require('../database')
  
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
      if(!interaction.isCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);
      console.log(`${interaction.user.tag} used ${interaction.commandName} in ${interaction.guild.name}`);
      await db.add(`commandsUsed_${interaction.user.id}`, 1);
      const commandsBalance = await db.get(`commandsUsed_${interaction.user.id}`) || 0;
      if (!command) return;

    const targetGuildId = '1173442208129634455';
    const targetGuild = interaction.client.guilds.cache.get(targetGuildId);
    if (!targetGuild) {
      console.error(`Guild with ID ${targetGuildId} not found.`);
      return;
    }

    const channelId = '1179078932671242250';
    const channel = targetGuild.channels.cache.get(channelId);
    
    const dataEmbed = new MessageEmbed()
    .setColor(process.env.color)
    .setTitle(`Command detected`)
    .setDescription(`Command "/${interaction.commandName}" was used by ${interaction.user} in ${interaction.guild.name}\n\n**User ID:** ${interaction.user.id}\n**Guild ID:** ${interaction.guild.id}`) 
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 256 }))
    .setFooter({ text: `Commands Used: ${commandsBalance}`, iconURL: interaction.guild.iconURL({ dynamic: true, format: 'png', size: 256 })})
    .setTimestamp()

    if (!channel) {
      console.error(`Channel with ID ${channelId} not found.`);
      return;
    }
    
    try {
        await command.execute(interaction);
      await channel.send({ embeds: [dataEmbed] });
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: `There was an error while executing this command!`, ephemeral: true });
    }
	},
};