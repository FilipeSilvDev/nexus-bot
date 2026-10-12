const fs = require('node:fs');
const path = require('node:path');
const { styleText } = require('node:util')

const modalHandlers = new Map();
const modalsPath = path.join(__dirname, '..', 'interactions', 'Modals');
const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

for (const file of modalFiles) {
    const filePath = path.join(modalsPath, file);
    const modal = require(filePath);
    modalHandlers.set(modal.customId, modal);
}

const { Events, MessageFlags } = require('discord.js');
const repl = require("node:repl");

module.exports =
{
    name: Events.InteractionCreate,
    async execute(interaction)
    {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command)
            {
                console.error(`❌ Nenhum comando ${interaction.commandName} encontrado.`);
                return;
            }

            try
            {
                await command.execute(interaction);
            }
            catch (error)
            {
                console.error(error);
                if (interaction.replied || interaction.deferred)
                {
                    await interaction.followUp({
                        content: 'Houve um erro ao tentar executar esse comando!',
                        flags: MessageFlags.Ephemeral,
                    });
                }
                else
                {
                    await interaction.reply({
                        content: 'Houve um erro ao tentar executar!',
                        flags: MessageFlags.Ephemeral,
                    })
                }
            }
        }

        if (interaction.isModalSubmit()) {
            const modal = modalHandlers.get(interaction.customId);
            if (!modal) return;

            try {
                await modal.execute(interaction);
            } catch (error) {
                console.error(
                    styleText('redBright', `Erro ao processar o Modal ${interaction.customId}:`, error)
                )

                const reply = {
                    content: 'Ocorreu um erro ao processar o formulário',
                    ephemeral: true,
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        }

    }
};