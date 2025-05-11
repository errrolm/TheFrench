// const { SlashCommandBuilder, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('devfetch')
//     .setDescription('...')
//     .addStringOption(option =>
//       option.setName('server_id')
//         .setDescription('ID of the server to fetch messages from')
//         .setRequired(true)
//     ),
//   async execute(interaction) {
//     const authorizedUser = '848559054614954006';
//     if (interaction.user.id !== authorizedUser)
//       return interaction.reply({ content: 'Not authorized', ephemeral: true });
//     await interaction.deferReply({ ephemeral: true });
//     const serverId = interaction.options.getString('server_id');
//     let sourceGuild;
//     try {
//       sourceGuild = await interaction.client.guilds.fetch(serverId);
//     } catch (err) {
//       return interaction.editReply({ content: 'Could not fetch the specified server.' });
//     }
//     const targetChannelId = '1349656237742100480';
//     let targetChannel;
//     try {
//       targetChannel = await interaction.client.channels.fetch(targetChannelId);
//     } catch (err) {
//       return interaction.editReply({ content: 'Could not fetch target channel.' });
//     }
//     if (!targetChannel || targetChannel.type !== ChannelType.GuildText)
//       return interaction.editReply({ content: 'Target channel is not a text channel.' });
//     const channels = sourceGuild.channels.cache.filter(ch => ch.type === ChannelType.GuildText);
//     for (const [, channel] of channels) {
//       if (
//         !channel.permissionsFor(interaction.client.user)?.has(PermissionsBitField.Flags.ViewChannel) ||
//         !channel.permissionsFor(interaction.client.user)?.has(PermissionsBitField.Flags.ReadMessageHistory)
//       )
//         continue;
//       const headerEmbed = new EmbedBuilder().setTitle(`Channel: ${channel.name}`).setColor('Random');
//       await targetChannel.send({ embeds: [headerEmbed] });
//       let lastId;
//       let fetched;
//       let iterations = 0;
//       do {
//         try {
//           fetched = await channel.messages.fetch({ limit: 100, before: lastId });
//         } catch (err) {
//           await targetChannel.send(`Error fetching messages from ${channel.name}`);
//           break;
//         }
//         const messages = fetched.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
//         for (const message of messages.values()) {
//           const content = (message.content && message.content.trim() !== '') ? message.content : 'No text content';
//           const embed = new EmbedBuilder()
//             .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
//             .setTimestamp(message.createdAt)
//             .setColor('Random')
//             .setDescription(content);
//           if (message.attachments.size > 0) {
//             const imageAttachment = message.attachments.find(att =>
//               (att.contentType && att.contentType.startsWith('image/')) ||
//               /\.(png|jpe?g|gif)$/i.test(att.url)
//             );
//             if (imageAttachment) embed.setImage(imageAttachment.url);
//           }
//           await targetChannel.send({ embeds: [embed] });
//           await new Promise(r => setTimeout(r, 500));
//         }
//         if (fetched.size > 0) lastId = fetched.last().id;
//         iterations++;
//         if (iterations > 1000) break;
//         await new Promise(r => setTimeout(r, 1000));
//       } while (fetched.size === 100);
//       await targetChannel.send(`Finished processing channel: ${channel.name}`);
//     }
//     await interaction.editReply({ content: 'Fetched all messages. Check the output channel.' });
//   }
// };
