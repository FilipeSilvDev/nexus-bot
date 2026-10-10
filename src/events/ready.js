const { Events, Activity } = require('discord.js');

module.exports =
{
    name: Events.ClientReady,
    once: true,
    execute(client)
    {
        client.user.setPresence({
            activities: [{
                name: 'Criando features',
                type: 'PLAYING',
            }]
        });

        console.log(`[🟢 ONLINE]`);
        console.log(`Logado como: ${client.user.username}`);
        console.log(`Tag: ${client.user.tag}`);
        console.log(`Client ID: ${client.user.id}`);
    }
}