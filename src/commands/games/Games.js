const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { getProfile } = require('../../services/Minecraft/MinecraftProfile.service');
const { MinecraftProfile } = require('./Minecraft/MinecraftProfile');

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
        ),

    async execute(interaction) {
        const group = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (group === "minecraft") {
            switch (subcommand) {
                case "profile":
                    return MinecraftProfile(interaction);

                default:
                    throw new Error(`Subcomando Minecraft não implementado: ${subcommand}`);
            }
        }

        await interaction.reply({
            content: `O comando **${subcommand}** do grupo **${group}** não existe.`,
            ephemeral: true,
        })
    }
}