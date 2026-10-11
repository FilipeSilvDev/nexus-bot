const fs = require('node:fs');
const path = require('node:path');

module.exports =
{
    async execute(client)
    {
        const foldersPath = path.join(__dirname, '..', 'commands');
        const commandFolders = fs.readdirSync(foldersPath)
        for (const folder of commandFolders)
        {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = await fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
            for (const file of commandFiles)
            {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'data' in command)
                {
                    client.commands.set(command.data.name, command);
                }
            }
        }
    }
}