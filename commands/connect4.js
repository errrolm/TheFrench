// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// class Connect4Game {
//     constructor(interaction, opponent) {
//         this.interaction = interaction;
//         this.player1 = interaction.user;
//         this.player2 = opponent;
//         this.currentPlayer = this.player1;
//         this.board = Array.from({ length: 6 }, () => Array(7).fill('⚪'));
//         this.moves = 0;
//         this.gameOver = false;

//         this.createBoard();
//         this.createButtons();
//     }

//     createBoard() {
//         const embed = new MessageEmbed()
//             .setTitle('Connect 4 Game')
//             .setDescription(this.board.map(row => row.join('')).join('\n'))
//             .setColor('#5865F2');

//         this.interaction.reply({ embeds: [embed] });
//     }

//     createButtons() {
//         const row = new MessageActionRow();

//         for (let i = 0; i < 7; i++) {
//             const button = new MessageButton()
//                 .setCustomId(`column_${i}`)
//                 .setLabel(`${i + 1}`)
//                 .setStyle('PRIMARY')
//                 .setDisabled(false);

//             row.addComponents(button);
//         }

//         this.interaction.followUp({ content: 'Make your move!', components: [row] });
//     }

//     async handleButton(button) {
//         if (this.gameOver) return;

//         const columnIndex = parseInt(button.customId.split('_')[1]);
//         const row = this.dropDisc(columnIndex);

//         if (row === -1) {
//             return await button.reply({ content: 'Column is full!', ephemeral: true });
//         }

//         const embed = new MessageEmbed()
//             .setTitle('Connect 4 Game')
//             .setDescription(this.board.map(row => row.join('')).join('\n'))
//             .setColor('#5865F2');

//         await button.update({ embeds: [embed] });

//         if (this.checkForWin(row, columnIndex)) {
//             this.gameOver = true;
//             return await this.interaction.followUp({ content: `${this.currentPlayer.username} won the game!`, ephemeral: true });
//         }

//         if (this.checkForTie()) {
//             this.gameOver = true;
//             return await this.interaction.followUp({ content: 'It\'s a tie! No one wins.', ephemeral: true });
//         }

//         this.moves++;
//         this.switchTurns();
//     }

//     dropDisc(columnIndex) {
//         for (let i = this.board.length - 1; i >= 0; i--) {
//             if (this.board[i][columnIndex] === '⚪') {
//                 this.board[i][columnIndex] = this.currentPlayer.id === this.player1.id ? '🔴' : '🟡';
//                 return i;
//             }
//         }
//         return -1; // Column is full
//     }

//     checkForWin(row, column) {
//         const directions = [
//             [[0, 1], [0, -1]],   // Horizontal
//             [[1, 0], [-1, 0]],   // Vertical
//             [[1, 1], [-1, -1]],  // Diagonal (up-right and down-left)
//             [[1, -1], [-1, 1]]   // Diagonal (up-left and down-right)
//         ];

//         for (const direction of directions) {
//             let count = 1;

//             for (const dir of direction) {
//                 let [dx, dy] = dir;
//                 let x = row + dx;
//                 let y = column + dy;

//                 while (x >= 0 && x < this.board.length && y >= 0 && y < this.board[0].length && this.board[x][y] === this.board[row][column]) {
//                     count++;
//                     x += dx;
//                     y += dy;
//                 }
//             }

//             if (count >= 4) return true;
//         }

//         return false;
//     }

//     checkForTie() {
//         return this.moves === this.board.length * this.board[0].length;
//     }

//     switchTurns() {
//         this.currentPlayer = this.currentPlayer.id === this.player1.id ? this.player2 : this.player1;
//     }
// }

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('connect4')
//         .setDescription('Starts a game of Connect 4.')
//         .addUserOption(option =>
//             option.setName('opponent')
//                 .setDescription('The opponent you want to play against.')
//                 .setRequired(true)),
//     async execute(interaction) {
//         try {
//             const opponent = interaction.options.getUser('opponent');
//             if (!opponent) {
//                 return await interaction.reply({ content: 'Please mention an opponent to play against.', ephemeral: true });
//             }

//             const connect4Game = new Connect4Game(interaction, opponent);

//             // Collect button interactions
//             const filter = (button) => button.user.id === connect4Game.currentPlayer.id;
//             const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

//             collector.on('collect', async (button) => {
//                 await connect4Game.handleButton(button);
//             });
//         } catch (error) {
//             console.error(error);
//             await interaction.reply({ content: 'An error occurred while starting the game.', ephemeral: true });
//         }
//     },
// };
