const {EmbedBuilder} = require("discord.js");
const {styleText} = require('node:util');

const GetLayerSummarieApi = require('../../../services/Steam/GetPlayerSummaries');
const convertUnixToDate = require('../../../utils/ConvertUnixToDate');
const ResolveSteamID = require('../../../services/Steam/ResolveSteamId');

async function SteamProfile(interaction) {
    const SteamKey = process.env.STEAM_API_KEY;
    const input = interaction.options.getString("perfil");

    try {
        const steamid = await ResolveSteamID(input);
        const player = await GetLayerSummarieApi(SteamKey, steamid);
        const profileIsPublic = player.communityvisibilitystate === 3 ? 'Publico ✅' : 'Privado ❌';
        let userState;

        function stateProfile(stateprofile) {
            if(player.profilestate === 0) {
                return userState = "⚪ Offline"
            } else if (player.profilestate === 1) {
                return userState = "🟢 Online"
            } else if (player.profilestate === 2) {
                return userState = "🔴 Ocupado"
            } else if (player.profilestate === 3) {
                return userState = "🟡 Ausente"
            } else {
                return userState = "⚫ Desconhecido..."
            }
        }

        const unixCreateProfile = player.timecreated;
        const unixLastOnline = player.lastlogoff;

        const profileEmbed = new EmbedBuilder()
            .setTitle(player.personaname)
            .setURL(player.profileurl)
            .setThumbnail(player.avatarfull)
            .setColor("#212121")
            .addFields(
                {
                    name: 'Steam Profile ID:',
                    value: `\`${steamid}\``,
                    inline: true,
                },
                {
                    name: 'Real Name:',
                    value: player.realname ? `\`${player.realname}\`` : "☠️ Desconhecido..."
                },
                {
                    name: 'Localização:',
                    value: `\`${player.loccountrycode}\``,
                    inline: true,
                },
                {
                    name: 'Perfil Publico:',
                    value: `\`${profileIsPublic}\``,
                    inline: true
                },
                {
                    name: 'User State:',
                    value: `\`${stateProfile(player.userstate)}\``,
                    inline: true,
                },
                {
                    name: 'Link Perfil:',
                    value: `${player.profileurl}`
                },
                {
                    name: 'Conta Crida em:',
                    value: `\`${convertUnixToDate(unixCreateProfile)}\``,
                    inline: true,
                },
                {
                    name: 'Ultima Vez Online:',
                    value: `\`${convertUnixToDate(unixLastOnline)}\``,
                    inline: true,
                }
            )
            .setTimestamp(Date.now());

        await interaction.reply({ embeds: [profileEmbed] });
    } catch (error) {
        console.error(
            styleText("redBright", "[Steam Profile] " + error)
        );

        let message = "Não foi possível consultar o perfil agora. Tente novamente mais tarde.";

        if (error.message === "URL_INVALID") {
            message = "URL da Steam está inválida.";
        } else if (error.message === "PROFILE_FORMAT_INVALID") {
            message = "Formato do perfil não suportado."
        } else if (error.message === "VANITY_STEAMID_INVALID") {
            message = "Informe um SteamID64 ou uma Vanity URL válida."
        } else if (error.message === "VANITY_INVALID") {
            message = "Identificador Inválido."
        } else if (error.message === "API_KEY_INVALID") {
            message = "Configuração da API Inválida."
        } else if (error.message === "STEAM_NOT_QUERY") {
            message = "Não foi possível consultar a Steam."
        } else if (error.message === "PROFILE_NOT_FOUND") {
            message = "Perfil Steam não encontrado."
        }

        await interaction.reply({
            content: message,
            embeds: []
        })
    }
}

module.exports = SteamProfile;