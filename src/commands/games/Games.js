const { SlashCommandBuilder } = require('discord.js');

const MinecraftProfile = require('./Minecraft/MinecraftProfile');
const SteamProfile = require('./Steam/SteamProfile');
const SteamSearchGame = require('./Steam/SteamSearchGame');

const commandsGroup = {
    minecraft: {
        profile: MinecraftProfile,
    },
    steam: {
        profile: SteamProfile,
        game: SteamSearchGame,
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription("Comandos de jogos")
        .addSubcommandGroup(group =>
        group
            .setName('minecraft')
            .setDescription("Comandos do Minecraft")
            .addSubcommand(subcommand =>
            subcommand
                .setName('profile')
                .setDescription("Consulta o perfil de um jogador")
                .addStringOption(option =>
                option
                    .setName('username')
                    .setDescription("Nickname do jogador")
                    .setRequired(true)
                )
            )
        )
        .addSubcommandGroup(group =>
        group
            .setName('steam')
            .setDescription('Comando da Steam')
            .addSubcommand(subcommand =>
            subcommand
                .setName('profile')
                .setDescription('Realiza a busca de um perfil público da steam')
                .addStringOption(option =>
                option
                    .setName('perfil')
                    .setDescription('SteamID64, Vanity URL ou link do perfil')
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('game')
                    .setDescription('Procura um jogo na steam baseado no termo inserido')
                    .addStringOption((option) =>
                        option
                            .setName('game_name')
                            .setDescription("Nome do jogo que deseja pesquisar")
                            .setRequired(true)
                    )
            )
        ),

    async execute(interaction) {
        const group = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        const handler = commandsGroup[group]?.[subcommand];

        if (!handler) {
            await interaction.reply({
                content: `O comando **${subcommand}** não existe!.`,
                ephemeral: true,
            })
        }

        handler(interaction);
    }
}