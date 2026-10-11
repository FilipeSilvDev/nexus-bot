const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { memoryUsage, version } = require('node:process');
const config = require('../../config/config.json');
const packageInfo = require('../../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Exibi status do bot e configurações'),
    async execute(interaction) {
        const memoryConsume = memoryUsage.rss();
        const formatarMB = (valor) => `${(valor / 1024 / 1024).toFixed(2)} MB`;

        const upTimeMs = interaction.client.uptime ?? 0;
        const seconds = Math.floor(upTimeMs / 1000) % 60;
        const minutes = Math.floor((upTimeMs / (1000 * 60)) % 60);
        const horas = Math.floor((upTimeMs / (1000 * 60 * 60)) % 24);
        const days = Math.floor((upTimeMs / (1000 * 60 * 60 * 24)));
        const upTimeStr = `${days}d ${horas}h ${minutes}m ${seconds}s`;

        const statusEmbed = new EmbedBuilder()
            .setTitle('🤖 Bot Status/Técnico')
            .setThumbnail(`${interaction.client.user.displayAvatarURL()}`)
            .setColor(`${config.cor_embeds}`)
            .addFields(
                {
                    name: 'Meu Nome:',
                    value: `\`${interaction.client.user.tag}\``,
                    inline: true,
                },
                {
                    name: "Node.JS:",
                    value: `\`${version}\``,
                    inline: true,
                },
                {
                    name: "Discord.JS:",
                    value: `\`${packageInfo.dependencies["discord.js"]}\``,
                    inline: true,
                },
                {
                    name: "Usuários (aprox.):",
                    value: `\`${interaction.client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}\``,
                    inline: true,
                },
                {
                    name: "Uptime:",
                    value: `${upTimeStr}`,
                    inline: true,
                },
                {
                    name: "Memoria Usada:",
                    value: `${formatarMB(memoryConsume)}`
                }
            );

        await interaction.reply({
            embeds: [statusEmbed]
        })
    }
}
