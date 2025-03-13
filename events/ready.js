const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {  
  name: "ready",
  once: true,
  execute(client, commands){
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ name: `/help in ${client.guilds.cache.size} servers`, type: 'WATCHING' }], status: 'idle' });
 const CLIENT_ID = client.user.id;
    const TEST_GUILD_ID = ""
    const rest = new REST({
        version: '9'
    }).setToken(process.env.key);
    (async () => {
        try {
            if (!TEST_GUILD_ID) {
                await rest.put(
                    Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands globally');
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands for development guild');
            }
        } catch (error) {
            if (error) console.error(error);
        }
    })();
  }
}