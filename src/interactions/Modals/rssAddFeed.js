const { addFeed } = require('../../database/repositories/RssRepository');

module.exports = {
    customId: 'rss:add-feed',
    async execute(interaction) {
        const name = interaction.fields
            .getTextInputValue('name')
            .trim();

        const category = interaction.fields
            .getTextInputValue('category')
            .trim()

        const url = interaction.fields
            .getTextInputValue('url')
            .trim();

        if (!name || !category || !url) {
            return interaction.reply({
                content: 'Preencha todos os campos',
                ephemeral: true
            });
        }

        await addFeed({name, category, url});
        await interaction.reply({
            content: `Fonte RSS "${name}" cadastrada ✅`,
            ephemeral: true
        });
    }
};