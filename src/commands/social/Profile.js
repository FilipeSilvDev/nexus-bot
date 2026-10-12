const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('[SOCIAL] Busca informações de usuários e servidores')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('usuario')
                .setDescription('[SOCIAL] Mostra informações de um usuário que esteja no servidor')
                .addStringOption((option) =>
                    option
                        .setName('usuario')
                        .setDescription('Usuário que desja buscar informações')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('servidor')
                .setDescription('[SOCIAL] Mostra informações de um servidor')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "usuario") {
            ProfileUsuario(interaction);
        }
        if (subcommand === 'servidor') {
            await interaction.reply({
                message: '🚧👷🏼‍♂️ Em construção...',
                ephemeral: true,
            })
            // ProfileServidor(interaction);
        }
    }
}

async function ProfileUsuario(interaction) {
    const User_Target = interaction.options.getUser('usuario') || interaction.user;
    const guild = interaction.guild;
    if (!guild) await interaction.reply({ message: "Este comando só pode ser executado dentro de servidores!", ephemeral: true })

    const User_CreateAt =  new Date(User_Target.createdTimestamp).toLocaleDateString("pt-BR");
    const User_Id = User_Target.id;
    const User_Tag = User_Target.tag;
    const User_Username = User_Target.globalName;
    const User_Solicitante = interaction.user.id === User_Id ? "Você mesmo solicitou 👀" : `<@${interaction.user.id}>`;
    const User_TagServidor = User_Target.primaryGuild.tag || "Não possui badge ativa!";

    const userEmbed = new EmbedBuilder()
        .setTitle(`PERFIL: ${User_Target.tag}`)
        .setDescription(`Solicitado por: ${User_Solicitante}\nPerfil de: <@${User_Target.id}>`)
        .setThumbnail(User_Target.displayAvatarURL())
        .setColor("DarkBlue")
        .addFields(
            {
                name: '💠Username:',
                value: `\`${User_Username}\``
            },
            {
                name: '🔰Nome Exibição:',
                value: `\`${User_Tag}\``
            },
            {
                name: '🆔:',
                value: `\`${User_Id}\``
            },
            {
                name: '🗓️ Conta Criada em:',
                value: `\`${User_CreateAt}\``
            },
            {
                name: `🅱️ Badge`,
                value: `\`${User_TagServidor}\``
            }
        )
        .setTimestamp(Date.now())

    await interaction.reply({ embeds:[userEmbed] });
}