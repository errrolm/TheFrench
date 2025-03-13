const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notify')
    .setDescription('Sends a live update message.')
    .addBooleanOption(option =>
      option.setName('test')
        .setDescription('Test mode: only notify the current server')
        .setRequired(false)
    ),
  async execute(interaction) {
    const testMode = interaction.options.getBoolean('test') || false;
    await interaction.deferReply({ ephemeral: true });
    const notifyEmbed = new EmbedBuilder()
      .setTitle('TheFrench is back!')
      .setDescription('The bot is now back live after being updated and patched.')
      .setColor(0x00FF00)
      .setTimestamp();
    const logChannel = interaction.client.channels.cache.get('1349598982166413453');
    let report = [];
    const now = new Date();
    async function getMemberCounts(guild) {
      let humanCount = 'Unknown', botCount = 'Unknown';
      try {
        const members = await guild.members.fetch();
        humanCount = members.filter(member => !member.user.bot).size;
        botCount = members.filter(member => member.user.bot).size;
      } catch {
        humanCount = 'Unknown';
        botCount = 'Unknown';
      }
      return { total: guild.memberCount, humanCount, botCount };
    }
    async function processGuild(guild) {
      let channelSent = null;
      for (const [, channel] of guild.channels.cache) {
        if (channel.isTextBased() && channel.permissionsFor(guild.members.me).has('SendMessages')) {
          try {
            await channel.send({ embeds: [notifyEmbed] });
            channelSent = channel;
            const { total, humanCount, botCount } = await getMemberCounts(guild);
            const successEmbed = new EmbedBuilder()
              .setTitle('Notification Sent')
              .setDescription(`Notification sent in **${guild.name}** (#${channel.name})`)
              .setColor(0x00FF00)
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setImage(guild.iconURL({ dynamic: true, size: 1024 }))
              .addFields(
                { name: 'Time', value: now.toISOString() },
                { name: 'Total Members', value: `${total}`, inline: true },
                { name: 'Humans', value: `${humanCount}`, inline: true },
                { name: 'Bots', value: `${botCount}`, inline: true }
              );
            if (logChannel) await logChannel.send({ embeds: [successEmbed] });
            report.push(`Notification sent in ${guild.name} (#${channel.name})`);
            break;
          } catch (error) {
            const { total, humanCount, botCount } = await getMemberCounts(guild);
            const failEmbed = new EmbedBuilder()
              .setTitle('Notification Failed')
              .setDescription(`Failed in **${guild.name}** (#${channel.name})`)
              .setColor(0xFF0000)
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setImage(guild.iconURL({ dynamic: true, size: 1024 }))
              .addFields(
                { name: 'Error', value: error.message },
                { name: 'Time', value: now.toISOString() },
                { name: 'Total Members', value: `${total}`, inline: true },
                { name: 'Humans', value: `${humanCount}`, inline: true },
                { name: 'Bots', value: `${botCount}`, inline: true }
              );
            if (logChannel) await logChannel.send({ embeds: [failEmbed] });
            report.push(`Failed in ${guild.name} (#${channel.name})`);
          }
        }
      }
      if (!channelSent) {
        const { total, humanCount, botCount } = await getMemberCounts(guild);
        const noChannelEmbed = new EmbedBuilder()
          .setTitle('No Available Channel')
          .setDescription(`No available channel in **${guild.name}** to send notification.`)
          .setColor(process.env.color)
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setImage(guild.iconURL({ dynamic: true, size: 1024 }))
          .addFields(
            { name: 'Time', value: now.toISOString() },
            { name: 'Total Members', value: `${total}`, inline: true },
            { name: 'Humans', value: `${humanCount}`, inline: true },
            { name: 'Bots', value: `${botCount}`, inline: true }
          );
        if (logChannel) await logChannel.send({ embeds: [noChannelEmbed] });
        report.push(`No available channel in ${guild.name}`);
      }
    }
    if (testMode) {
      await processGuild(interaction.guild);
      await interaction.editReply({ content: report.join('\n') });
    } else {
      for (const [, guild] of interaction.client.guilds.cache) {
        await processGuild(guild);
      }
      await interaction.editReply({ content: report.join('\n') });
    }
  }
};
