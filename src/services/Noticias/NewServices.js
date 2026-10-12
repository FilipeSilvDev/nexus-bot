
const Parser = require('rss-parser');
const { EmbedBuilder } = require('discord.js');

const parser = new Parser();
const CHANNEL_ID = '1559197851412594788';

const feeds = [
    {
        name: 'IGN',
        category: 'Games',
        url: 'https://br.ign.com/feed.xml'
    },
    {
        name: 'Anime News Network',
        category: 'Animes',
        url: 'https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us'
    }
];

// Armazena os IDs somente enquanto o bot estiver ligado.
const seenByFeed = new Map();

async function checkFeed(client, feed) {
    try {
        const result = await parser.parseURL(feed.url);

        if (!seenByFeed.has(feed.url)) {
            const knownItems = new Set(
                result.items
                    .map(item => item.guid || item.link || item.title)
                    .filter(Boolean)
            );

            seenByFeed.set(feed.url, knownItems);

            // Primeira consulta: registra as notícias sem publicá-las.
            return;
        }

        const seen = seenByFeed.get(feed.url);

        const newItems = result.items.filter(item => {
            const id = item.guid || item.link || item.title;
            return id && !seen.has(id);
        });

        // Publica da notícia mais antiga para a mais recente.
        for (const item of newItems.reverse()) {
            const channel = await client.channels.fetch(CHANNEL_ID);

            if (!channel || !channel.isTextBased()) {
                throw new Error('Canal de notícias inválido.');
            }

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setAuthor({ name: feed.name })
                .setTitle(item.title || 'Nova notícia')
                .setDescription(
                    (
                        item.contentSnippet ||
                        item.summary ||
                        'Acesse o link para ler a notícia.'
                    ).slice(0, 300)
                )
                .setFooter({
                    text: `Publicado em: ${new Date(item.pubDate).toLocaleString('pt-BR', {
                        timeZone: 'America/Sao_Paulo',
                        dateStyle: 'full',
                        timeStyle: 'short'
                    })}`,
                    iconURL: `${client.user.displayAvatarURL()}`
                });

            if (item.link) {
                embed.setURL(item.link);
            }
            if (item.enclosure) {
                embed.setImage(item.enclosure.url)
            }

            await channel.send({ embeds: [embed] });

            // Registra somente depois de publicar com sucesso.
            const id = item.guid || item.link || item.title;
            seen.add(id);
        }

        // Limita o cache a 200 identificadores por feed.
        while (seen.size > 200) {
            seen.delete(seen.values().next().value);
        }
    } catch (error) {
        console.error(
            `Erro ao consultar o feed ${feed.name}:`,
            error
        );
    }
}

async function checkAllFeeds(client) {
    for (const feed of feeds) {
        await checkFeed(client, feed);
    }
}

function startNews(client) {
    // Inicializa o controle de notícias.
    checkAllFeeds(client);

    // Consulta novamente a cada cinco minutos.
    setInterval(() => {
        checkAllFeeds(client);
    }, 5 * 60 * 1000);
}

async function testeFeed(client, feed) {
    try {
        const result = await parser.parseURL(feed.url);

        if (!result.items.length) {
            console.log(`Nenhuma notícia encontrada em ${feed.name}`);
            return;
        }

        const item = result.items[0];
        const channel = await client.channels.fetch(CHANNEL_ID);

        if (!channel || !channel.isTextBased()) {
            throw new Error('Canal de notícia inválido.');
        }
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setAuthor({ name: feed.name })
            .setTitle(item.title || 'Notícia de teste')
            .setDescription(
                (
                    item.contentSnippet ||
                    item.summary ||
                    'Acesse o link para ler a notícia.'
                ).slice(0, 300)
            )
            .setFooter({
                text: `Publicado em: ${new Date(item.pubDate).toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                    dateStyle: 'full',
                    timeStyle: 'short'
                })}`,
                iconURL: `${client.user.displayAvatarURL()}`
            });

        if (item.link) {
            embed.setURL(item.link);
        }
        if (item.enclosure) {
            embed.setImage(item.enclosure.url)
        }

        await channel.send({ embeds: [embed] });

        console.log(`Teste do feed ${feed.name} concluído.`);
    } catch (error) {
        console.error(`Falha no teste de ${feed.name}:`, error);
    }
}

module.exports = { startNews, testeFeed };