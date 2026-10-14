const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    MessageFlags,
    version: djsVersion,
} = require('discord.js');
const config = require('../../config/config.json');

// ---------- Helpers ----------

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return [d && `${d}d`, (d || h) && `${h}h`, (d || h || m) && `${m}m`, `${s}s`]
        .filter(Boolean)
        .join(' ');
};

const progressBar = (percent, size = 10) => {
    const filled = Math.round((Math.min(Math.max(percent, 0), 100) / 100) * size);
    return '█'.repeat(filled) + '░'.repeat(size - filled);
};

const pingEmoji = (ms) => (ms < 150 ? '🟢' : ms < 300 ? '🟡' : '🔴');

const formatNumber = (n) => n.toLocaleString('pt-BR');

// ---------- Embed ----------

function buildEmbed(interaction, apiLatency) {
    const { client } = interaction;

    const wsPing = Math.round(client.ws.ping);
    const mem = process.memoryUsage();
    const heapPercent = (mem.heapUsed / mem.heapTotal) * 100;

    const startedAt = Math.floor((Date.now() - (client.uptime ?? 0)) / 1000);

    const guilds = client.guilds.cache;
    const totalUsers = guilds.reduce((acc, g) => acc + (g.memberCount ?? 0), 0);
    const totalChannels = client.channels.cache.size;

    return new EmbedBuilder()
        .setColor(config.cor_embeds || 0x5865f2)
        .setAuthor({
            name: `${client.user.username} • Painel de Status`,
            iconURL: client.user.displayAvatarURL(),
        })
        .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
        .setDescription(
            `🟢 **Online** desde <t:${startedAt}:f> (<t:${startedAt}:R>)\n` +
            `⏱️ Tempo ativo: \`${formatDuration(client.uptime ?? 0)}\``
        )
        .addFields(
            {
                name: '📡 Latência',
                value: [
                    `${pingEmoji(wsPing)} Gateway: \`${wsPing}ms\``,
                    `${pingEmoji(apiLatency)} API: \`${apiLatency}ms\``,
                ].join('\n'),
                inline: true,
            },
            {
                name: '📊 Alcance',
                value: [
                    `🏠 Servidores: \`${formatNumber(guilds.size)}\``,
                    `👥 Usuários: \`${formatNumber(totalUsers)}\``,
                    `💬 Canais: \`${formatNumber(totalChannels)}\``,
                ].join('\n'),
                inline: true,
            },
            {
                name: '🧰 Versões',
                value: [
                    `🟩 Node.js: \`${process.version}\``,
                    `📘 Discord.js: \`v${djsVersion}\``,
                ].join('\n'),
                inline: true,
            },
            {
                name: '🧠 Memória do Bot',
                value: [
                    `RSS: \`${formatBytes(mem.rss)}\``,
                    `Heap: \`${formatBytes(mem.heapUsed)} / ${formatBytes(mem.heapTotal)}\``,
                    `\`${progressBar(heapPercent)}\` ${heapPercent.toFixed(0)}%`,
                ].join('\n'),
                inline: true,
            }
        )
        .setFooter({
            text: `Solicitado por ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();
}

const buildRow = (disabled = false) =>
    new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('status_refresh')
            .setLabel('Atualizar')
            .setEmoji('🔄')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled)
    );

// ---------- Command ----------

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Exibe o status do bot e informações técnicas'),

    async execute(interaction) {
        // Mede a latência real da API (tempo até o Discord confirmar a resposta)
        const start = Date.now();
        await interaction.deferReply();
        const apiLatency = Date.now() - start;

        const message = await interaction.editReply({
            embeds: [buildEmbed(interaction, apiLatency)],
            components: [buildRow()],
        });

        // Botão "Atualizar" — só quem usou o comando pode clicar
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60_000,
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({
                    content: '❌ Apenas quem executou o comando pode atualizar.',
                    flags: MessageFlags.Ephemeral,
                });
            }

            const latency = Date.now() - i.createdTimestamp;
            await i.update({
                embeds: [buildEmbed(interaction, Math.max(latency, 0))],
                components: [buildRow()],
            });
        });

        collector.on('end', async () => {
            // Desativa o botão quando o tempo acaba
            await interaction.editReply({ components: [buildRow(true)] }).catch(() => {});
        });
    },
};