const { SlashCommandBuilder, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('devsearch')
    .setDescription('Searches all servers for messages from a user or containing a specific word.')
    .addStringOption(option =>
      option
        .setName('user_id')
        .setDescription('The user ID to search for (leave empty if searching by word)')
    )
    .addStringOption(option =>
      option
        .setName('word')
        .setDescription('The word to search for in messages (leave empty if searching for a user)')
    ),
  async execute(interaction) {
    const authorizedUser = '848559054614954006';
    if (interaction.user.id !== authorizedUser) {
      return interaction.reply({ content: 'Not authorized', ephemeral: true });
    }
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.options.getString('user_id');
    const searchWord = interaction.options.getString('word');

    // Ensure that exactly one search option is provided.
    if ((!userId && !searchWord) || (userId && searchWord)) {
      return interaction.editReply({ content: 'Please provide exactly one search option: either a user_id or a word.' });
    }

    const outputChannelId = '1349661871950659584';
    let outputChannel;
    try {
      outputChannel = await interaction.client.channels.fetch(outputChannelId);
    } catch (err) {
      return interaction.editReply({ content: 'Could not fetch target channel.' });
    }
    if (!outputChannel || outputChannel.type !== ChannelType.GuildText)
      return interaction.editReply({ content: 'Target channel is not a text channel.' });

    let foundUser = false; // only used in user search mode

    // Loop through all guilds the bot is in.
    for (const guild of interaction.client.guilds.cache.values()) {
      // If searching by user, try to fetch the member in the current guild.
      let member;
      if (userId) {
        try {
          member = await guild.members.fetch(userId);
          foundUser = true;
          await outputChannel.send({ embeds: [new EmbedBuilder().setTitle(`Server: ${guild.name} | ${member.user.tag} found`).setColor('Random')] });
        } catch (err) {
          // If the user isn't in this guild, move to the next one.
          continue;
        }
      } else if (searchWord) {
        // For word search, output server info.
        await outputChannel.send({ embeds: [new EmbedBuilder().setTitle(`Server: ${guild.name} | Searching for word: "${searchWord}"`).setColor('Random')] });
      }

      // Get all text channels the bot has access to.
      const textChannels = guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText);
      for (const [, channel] of textChannels) {
        // Skip channels where the bot lacks necessary permissions.
        if (
          !channel.permissionsFor(interaction.client.user)?.has(PermissionsBitField.Flags.ViewChannel) ||
          !channel.permissionsFor(interaction.client.user)?.has(PermissionsBitField.Flags.ReadMessageHistory)
        ) continue;

        await outputChannel.send({ embeds: [new EmbedBuilder().setTitle(`Channel: ${channel.name}`).setColor('Random')] });
        let lastId;
        let fetched;
        let channelHasMessages = false;
        do {
          try {
            fetched = await channel.messages.fetch({ limit: 100, before: lastId });
          } catch (err) {
            await outputChannel.send(`Error fetching messages from ${channel.name}. Skipping this channel.`);
            break;
          }
          // Sort messages in ascending order.
          const messages = fetched.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
          for (const msg of messages.values()) {
            // For user search, check by user ID.
            if (userId) {
              if (msg.author.id !== userId) continue;
            } 
            // For word search, do a case-insensitive check.
            else if (searchWord) {
              if (!msg.content || !msg.content.toLowerCase().includes(searchWord.toLowerCase())) continue;
            }
            channelHasMessages = true;
            const content = (msg.content && msg.content.trim() !== '') ? msg.content : 'No text content';
            const embed = new EmbedBuilder()
              .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
              .setTimestamp(msg.createdAt)
              .setColor('Random')
              .setDescription(content);
            if (msg.attachments.size > 0) {
              const imageAttachment = msg.attachments.find(att =>
                (att.contentType && att.contentType.startsWith('image/')) || /\.(png|jpe?g|gif)$/i.test(att.url)
              );
              if (imageAttachment) embed.setImage(imageAttachment.url);
            }
            await outputChannel.send({ embeds: [embed] });
            await new Promise(r => setTimeout(r, 250)); // Reduced delay between sending messages.
          }
          if (fetched.size > 0) lastId = fetched.last().id;
          await new Promise(r => setTimeout(r, 500)); // Reduced delay between fetches.
        } while (fetched.size === 100);

        if (!channelHasMessages) {
          if (userId)
            await outputChannel.send(`No messages from <@${userId}> found in channel: ${channel.name}`);
          else
            await outputChannel.send(`No messages containing "${searchWord}" found in channel: ${channel.name}`);
        } else {
          await outputChannel.send(`Finished processing channel: ${channel.name}`);
        }
      }
    }
    if (userId && !foundUser)
      await outputChannel.send(`User with ID ${userId} was not found in any server.`);
    await interaction.editReply({ content: 'Finished processing all servers.' });
  }
};
