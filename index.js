const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const life = require('./server.js');
const db = require('./database.js');
const request = require('request');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && typeof command.data.toJSON === 'function') {
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  } else {
    console.error(`Invalid command data for file: ${file}`);
  }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, commands));
  } else {
    client.on(event.name, (...args) => event.execute(...args, commands));
  }
}

client.on('messageCreate', async message => {
  const prefix = process.env.prefix;
  if (message.author.bot) return;
  if (message.content.includes(client.user.id)) return message.reply('Use /help to begin.');
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const checkCredit = (await db.get(`balance_${message.author.id}`)) || 0;
  if (checkCredit <= 0) {
    db.add(`balance_${message.author.id}`, 100);
  }
});

life();
client.login(process.env.key);
