const { Client, Collection, GatewayIntentBits, Intents } = require('discord.js');
const client = new Client({ intents: 32767 });
const life = require('./server.js');         
const fs = require('fs');
const db = require("./database.js");
const request = require('request');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    if (command.data && typeof command.data === 'object' && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
        console.error(`Invalid command data for file: ${file}`);
    }
}

for(const file of eventFiles){
  const event = require(`./events/${file}`);
  if(event.once){
    client.once(event.name, (...args) => event.execute(...args, commands));
  } else{
    client.on(event.name, (...args) => event.execute(...args, commands));
  }
}

client.on('messageCreate', async message =>{
const prefix = process.env.prefix;
if(message.author.bot) return;
if(message.content.includes(client.user.id)) return message.reply(`Use /help to begin.`);
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const checkCredit = await db.get(`balance_${message.author.id}`) || 0;
  
  if(checkCredit <=0){
    db.add(`balance_${message.author.id}`, 100);
  }
  
});
life();
client.login(process.env.key);