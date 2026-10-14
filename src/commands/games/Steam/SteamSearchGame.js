const {EmbedBuilder} = require("discord.js");

const SearchGameInStore = require('../../../services/Steam/SteamStorage');
const RemoveHtml = require('../../../utils/RemoveHtml')

async function SteamSearchGame(interaction) {
    const termo = interaction.options.getString('game_name');
    const game = await SearchGameInStore(termo)

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

module.exports = SteamSearchGame