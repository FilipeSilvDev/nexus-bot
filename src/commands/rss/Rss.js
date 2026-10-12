const { SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle,
    LabelBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rss')
        .setDescription('Gerencia as fontes de notícias do NEXO')
        .addSubcommand(subcommand =>
        subcommand
            .setName('adicionar_canal_noticias')
            .setDescription('Cadastra uma fonte RSS')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'adicionar_canal_noticias') {
            adicionarRSS(interaction);
        }
    }
}

async function adicionarRSS(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('rss:add-feed')
        .setTitle('Cadastrar fonte RSS');

    const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setPlaceholder('Ex.: ING')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);
    const nameLabel = new LabelBuilder()
        .setLabel('Nome da Fonte')
        .setTextInputComponent(nameInput);

    const categoryInput = new TextInputBuilder()
        .setCustomId('category')
        .setPlaceholder('Ex.: Games')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(50);
    const categoryLabel = new LabelBuilder()
        .setLabel('Categoria')
        .setTextInputComponent(categoryInput);

    const urlInput = new TextInputBuilder()
        .setCustomId('url')
        .setPlaceholder('https://exemplo.com/feed.xml')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(500);
    const urlLabel = new LabelBuilder()
        .setLabel('URL do feed RSS')
        .setTextInputComponent(urlInput);

    modal.addLabelComponents(nameLabel, categoryLabel, urlLabel);

    await interaction.showModal(modal);
}