const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (message.author.bot) return;
    const logChannel = message.client.channels.cache.get(process.env.logChannel);
    if (!logChannel) return;

    const attachments = message.attachments.size > 0
      ? message.attachments.map(att => att.url).join('\n')
      : 'No attachments';

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: message.author.tag, 
        iconURL: message.author.displayAvatarURL({ dynamic: true }) 
      })
      .setDescription(
        message.guild
          ? `Message in **${message.guild.name}** (ID: ${message.guild.id}) in channel: #${message.channel.name} (ID: ${message.channel.id})`
          : 'Message in Direct Message'
      )
      .addFields(
        { name: 'Message Content', value: message.content || 'No content', inline: false },
        { name: 'Attachments', value: attachments, inline: false },
        { name: 'User ID', value: message.author.id, inline: true },
        { name: 'Channel ID', value: message.channel.id, inline: true },
        { name: 'Server ID', value: message.guild ? message.guild.id : 'DM', inline: true },
        { name: 'Timestamp', value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`, inline: false }
      )
      .setColor(process.env.color)
      .setTimestamp(message.createdAt);

    logChannel.send({ embeds: [embed] }).catch(console.error);
  }
};
