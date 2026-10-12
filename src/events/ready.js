const { styleText } = require('node:util');
const { Events } = require('discord.js');
const { startNews, testeFeed } = require('../services/Noticias/NewServices');
const { createDb } = require('../database/connection');

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

        // Inicialziar Serviços Background
        async function startBotServices() {
            const db = await createDb();
            console.log(styleText(['green', "italic"], '💽 Banco de dados inicializados...'));

            startNews(client);
            console.log(styleText(['green', 'italic'], '📰 Sistema de RSS inicilizados...'));

            // --- Inicialização do Bot ---
            console.log('\n')
            console.log(styleText("green", `[🟢 ONLINE] Logado como: ${client.user.username}`));
            console.log(styleText('green', `🔰 Tag: ${client.user.tag}`));
            console.log(styleText('magentaBright', `🆔 Client ID: ${client.user.id}`));
        }
        startBotServices().catch(console.error);

        /* TESTE RSS
        testeFeed(client, {
            name: 'ING',
            category: 'Games',
            url: 'https://br.ign.com/feed.xml'
        })
        */
    }
}