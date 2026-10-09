const fs = require('fs');
const path = require('path');

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

/*  - ORIGINAL
const foldersPath = path.join(__dirname, 'src', 'commands');
const commandFolders = fs.readdirSync(commandPath).filter((file) => file.endsWith('.js'));

for (const folder of commandFolders)
{
const commandsPath = path.join(foldersPath, folder);
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}
}
*/