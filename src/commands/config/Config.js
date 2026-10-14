const {SlashCommandBuilder} = require("discord.js");
const { styleText } = require('node:util');

const {
    setNewsChannel,
    setLogsChannel
} = require('../../database/repositories/GuildSettings.repository');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Realiza configurações do bot")
        .addSubcommandGroup((subcommandGroup) =>
        subcommandGroup
            .setName("servidor")
            .setDescription("Configurações para o servidor")
            .addSubcommand((subcommand) =>
            subcommand
                .setName("canalnoticias")
                .setDescription('Seleciona o canal que será enviado noticias RSS')
                .addChannelOption((channelOption) =>
                    channelOption
                    .setName("canalrss")
                    .setDescription("Canal que será enviado as noticias")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("canallog")
                .setDescription("Canal que mostrar as logs")
                .addStringOption((option) =>
                option
                    .setName('canallog')
                    .setDescription('Canal que será enviado as logs')
                    .setRequired(true)
                )
            )
        ),
    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (subcommandGroup === "servidor") {
            if (subcommand === "canalnoticias") {
                await setCanalNoticias(interaction);
            }
        } else {
            await interaction.reply({
                message: "Opção invalida",
                ephemeral: true,
            })
        }
    }
}

async function setCanalNoticias(interaction) {
    const guild = interaction.guild;
    const channel = interaction.options.getChannel("canalrss");

    await interaction.reply("Aguarde enquanto configuro o canal...🚧");
    const att = await setNewsChannel(guild.id, channel.id);
    if (att === true) {
        console.log(styleText('greenBright', `[RSS] Canal atualizado com sucesso:\nGUILD: ${guild}\,CHANNEL: ${channel.name}`))
        await interaction.editReply(`✅ Canal de noticias configurado para: <#${channel.id}>`);
    } else {
        console.log(styleText('redBright', `[RSS] Canal não atualizado:\nGUILD: ${guild}\nCHANNEL: ${channel.name}`))
        await interaction.editReply(`❌ Erro ao configurar o canal para: <#${channel.id}>`);
    }
}