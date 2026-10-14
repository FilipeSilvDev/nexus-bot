const { EmbedBuilder } = require('discord.js');
const { getProfile } = require("../../../services/Minecraft/MinecraftProfile.service");

async function MinecraftProfile(interaction) {
    const username = interaction.options.getString("username");

    // A consulta HTTP pode demorar.
    await interaction.deferReply();

    try {
        const profile = await getProfile(username);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle(`Perfil Minecraft: ${profile.username}`)
            .setURL(
                `https://namemc.com/profile/${profile.uuid}`
            )
            .setThumbnail(profile.avatarUrl)
            .setImage(profile.bodyUrl)
            .addFields(
                {
                    name: "Jogador",
                    value: `\`${profile.username}\``,
                    inline: true
                },
                {
                    name: "UUID",
                    value: `\`${profile.formattedUUID}\``,
                    inline: false
                },
                {
                    name: "Skin",
                    value: profile.skinUrl
                        ? `[Baixar skin](${profile.skinUrl})`
                        : "Skin não disponível",
                    inline: true
                },
                {
                    name: "Perfil",
                    value: `[Visualizar no NameMC](
https://namemc.com/profile/${profile.uuid})`
                        .replace(/\n/g, ""),
                    inline: true
                }
            )
            .setFooter({
                text: "NEXO • Minecraft"
            })
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed]
        });

    } catch (error) {
        console.error(
            "[Minecraft Profile]",
            error
        );

        let message =
            "Não foi possível consultar o perfil agora. Tente novamente mais tarde.";

        if (error.message === "INVALID_USERNAME") {
            message =
                "O nickname informado é inválido. Use de 1 a 16 letras, números ou underscores.";
        } else if (
            error.message === "PROFILE_NOT_FOUND" ||
            error.status === 204 ||
            error.status === 404
        ) {
            message =
                `Não encontrei um perfil Minecraft para \`${username}\`.`;
        } else if (error.status === 429) {
            message =
                "A API está recebendo muitas requisições. Aguarde um pouco e tente novamente.";
        }

        await interaction.editReply({
            content: message,
            embeds: []
        });
    }
}

module.exports = { MinecraftProfile}