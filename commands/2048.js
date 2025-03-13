// const { TwoZeroFourEight } = require('discord-gamecord');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("2048")
//         .setDescription("Play the 2048 game!"),
//     async execute(interaction) {
//         try {
//             const game = new TwoZeroFourEight({
//                 message: interaction,
//                 isSlashGame: true,
//                 embed: {
//                     title: '2048',
//                     color: '#5865F2'
//                 },
//                 emojis: {
//                     up: '⬆️',
//                     down: '⬇️',
//                     left: '⬅️',
//                     right: '➡️',
//                 },
//                 timeoutTime: 60000,
//                 buttonStyle: 'PRIMARY',
//                 playerOnlyMessage: 'Only {player} can use these buttons.'
//             });

//             game.startGame();

//             game.on('gameOver', result => {
//                 console.log(result);  // Handle game over result if needed
//             });
//         } catch (error) {
//             console.error(error);
//             await interaction.reply('An error occurred while starting the game.');
//         }
//     },
// };
