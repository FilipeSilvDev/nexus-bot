const { SlashCommandBuilder, EmbedBuilder, Embed} = require('discord.js');
const fs = require('node:fs')
const path = require('node:path');

const folderPath = path.join(__dirname, '..');
const commandFolders = fs.readdirSync(folderPath); // Retorna o array de pastas

let categorias = {};
for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    const commandFile = fs.readdirSync(commandsPath); //  Retonra o array de arquivos

    // Cada categoria = uma propriedade
    categorias[folder] = [];

    for (const file of commandFile) {
        // Guarda o comando na categoria
        let comando = file.replace(".js", "").toLowerCase();
        categorias[folder].push(comando);
    }
}

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('ajuda')
        .setDescription('[AJUDA] Exibe todos os comando por categoria'),
    async execute(interaction) {
        const ajudaEmbed = new EmbedBuilder()
            .setTitle('NEXO | Central de Comandos')
            .setDescription('Confira os comandos diponíveis')
            .setColor(0x5865F2)

        for (const [categoria, comandos] of Object.entries(categorias)) {
            ajudaEmbed.addFields({
                name: categoria,
                value: comandos
                    .map(comando => `\`${path.parse(comando).name}\``)
                    .join(`, `)
                    || 'Nenhum comando disponível ainda',
                inline: false,
            });
        }

        await interaction.reply({ embeds: [ajudaEmbed] });
    }
}