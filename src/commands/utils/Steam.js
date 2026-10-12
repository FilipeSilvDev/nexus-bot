const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { GetLayerSummarieApi } = require('../../services/Steam/GetPlayerSummaries');
const { convertUnixToDate } = require('../../utils/ConvertUnixToDate');
const { SeachGameInStore } = require('../../services/Steam/SteamStorage');
const { RemoveHtml } = require('../../utils/RemoveHtml')

async function SteamProfileCommand(interaction) {
        const SteamKey = process.env.STEAM_API_KEY;
        const targetSteamID = interaction.options.getString("steam_id");
        const player = await GetLayerSummarieApi(SteamKey, targetSteamID);

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
            .setTitle(`Steam Profile: ${player.personaname}`)
            .setURL(player.profileurl)
            .setThumbnail(player.avatarfull)
            .setColor("#212121")
            .addFields(
                {
                        name: 'Steam Profile ID:',
                        value: `${targetSteamID}`,
                        inline: true,
                },
                {
                        name: 'Real Name:',
                        value: `${player.realname}`
                },
                {
                        name: 'Localização:',
                        value: `${player.loccountrycode}`,
                        inline: true,
                },
                {
                        name: 'Perfil Publico:',
                        value: `${profileIsPublic}`,
                        inline: true
                },
                {
                        name: 'User State:',
                        value: `${stateProfile(player.userstate)}`,
                        inline: true,
                },
                {
                        name: 'Link Perfil:',
                        value: `${player.profileurl}`
                },
                {
                        name: 'Conta Crida em:',
                        value: `${convertUnixToDate(unixCreateProfile)}`,
                        inline: true,
                },
                {
                        name: 'Ultima Vez Online:',
                        value: `${convertUnixToDate(unixLastOnline)}`,
                        inline: true,
                }
            )
            .setTimestamp(Date.now());

        await interaction.reply({ embeds: [profileEmbed] });
}

async function SteamSearchGame(interaction) {
        const termo = interaction.options.getString('game_name');
        const game = await SeachGameInStore(termo)

        if (game === null) {
                interaction.reply({
                        message: "O jogo `" + interaction.options.getString("game_name") + "` não encontrado!",
                        ephemeral: true,
                })
        }

        const shortDescription = await RemoveHtml(game.short_description);
        const isFree = game.is_free ? "Sim" : "Não";

        const embedGame = new EmbedBuilder()
            .setTitle(`${game.name}`)
            .setDescription(`${shortDescription}`)
            .setImage(`${game.header_image}`)
            .setColor("#212121")
            .setURL(`https://store.steampowered.com/app/${game.steam_appid}/`)
            .addFields(
                {
                        name: 'É gratuito?',
                        value: `${isFree}`,
                        inline: true,
                },
                {
                        name: 'Linguagens Suportadas:',
                        value: `${await RemoveHtml(game.supported_languages)}`
                },
                {
                        name: 'Website:',
                        value: `${game.website}`
                },
                {
                        name: 'Editora:',
                        value: `${game.publishers}`
                },
                {
                        name: 'Preço:',
                        value: `${game.price_overview.final_formatted}`
                }
            )
            .setTimestamp(Date.now())

        await interaction.reply({
                message: `Resultado Baseado em \`${termo}\``,
                embeds: [embedGame]
        })
}

module.exports = {
        async execute(interaction) {
                const subcommand = interaction.options.getSubcommand();

                if (subcommand === "profile") {
                        SteamProfileCommand(interaction);
                }
                if (subcommand === "game") {
                        SteamSearchGame(interaction);
                }
        },
        data: new SlashCommandBuilder()
            .setName("steam")
            .setDescription("Comando voltado para a Steam")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("profile")
                    .setDescription("Busca um perfil publico da steam via steamID")
                    .addStringOption((option) =>
                        option
                            .setName("steam_id")
                            .setDescription("Steam ID do perfil que deseja pesquisar")
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
}