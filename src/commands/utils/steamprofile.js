const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { request } = require("undici");

const dataCommand = new SlashCommandBuilder()
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

const SteamKey = process.env.STEAM_API_KEY;

module.exports = {
        data: dataCommand,
        async execute(interaction) {
                const targetSteamID = interaction.options.getString("steam_id");
                if (!targetSteamID) {
                        await interaction.reply({
                                message: "Você não adicionou o steamID para procurar",
                                ephemeral: true,
                        })
                }

                const { body } = await request(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${SteamKey}&steamids=${targetSteamID}`);
                const data = await body.json();
                const player = data.response.players[0];

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

                function convertUnixToDate(unixTime) {
                        return new Date(unixTime * 1000).toLocaleDateString("pt-BR");
                }

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
}