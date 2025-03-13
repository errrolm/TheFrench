const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
  AudioPlayerStatus,
} = require('@discordjs/voice');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

const audioPlayers = new Map();
const queues = new Map();
//Emoji Slots
const emojiServerId = '1173442208129634455';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Search and play a song in a voice channel')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Enter a song name or keywords to search and play')
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const serverId = interaction.guild.id;
    const channel = interaction.member.voice.channel;
    const server = interaction.client.guilds.cache.get(emojiServerId);
    const addToCollectionEmoji = server.emojis.cache.find((e) => e.name === 'addtocollection');

    if (!channel) {
      await interaction.followUp({
        content: 'You need to be in a voice channel to use this command.',
      });
      return;
    }

    const query = interaction.options.getString('query');

    try {
      const searchResults = await ytSearch(query);

      if (!searchResults.videos.length) {
        await interaction.followUp({
          content: 'No search results found for the query.',
        });
        return;
      }

      const video = searchResults.videos[0];
      const audioUrl = video.url;

      if (!audioPlayers.has(serverId)) {
        audioPlayers.set(serverId, createAudioPlayer());
      }

      if (!queues.has(serverId)) {
        queues.set(serverId, []);
      }

      const audioPlayer = audioPlayers.get(serverId);
      const queue = queues.get(serverId);

      if (audioPlayer.state.status !== AudioPlayerStatus.Playing) {
        const resource = createAudioResource(ytdl(audioUrl, { filter: 'audioonly' }));
        audioPlayer.play(resource);

        if (!queue.length) {
          const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: serverId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
          });

          connection.subscribe(audioPlayer);
        }

        audioPlayer.on(AudioPlayerStatus.Idle, async () => {
          const nextInQueue = queue.shift();
          if (nextInQueue) {
            const nextResource = createAudioResource(ytdl(nextInQueue, { filter: 'audioonly' }));
            audioPlayer.play(nextResource);
          } else{
            audioPlayer.stop();
            const connection = joinVoiceChannel({
              channelId: channel.id,
              guildId: serverId,
              adapterCreator: interaction.guild.voiceAdapterCreator,
});
            connection.destroy();
            await interaction.followUp({ content: `Aight, I'm done.` });
          }
        });

        await interaction.followUp({ content: `Now playing: [${video.title}](${audioUrl})` });
      } else {
        queue.push(audioUrl);

        await interaction.followUp({
          content: `${addToCollectionEmoji}Added to queue: [${video.title}](${audioUrl})`,
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: 'An error occurred while searching and playing the song.',
      });
    }
  },
};
