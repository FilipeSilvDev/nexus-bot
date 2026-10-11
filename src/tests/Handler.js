const fs = require('node:fs');
const path = require('node:path');

const foldersPath = path.join(__dirname, '..', 'commands');
const commandFolders = fs.readdirSync(foldersPath); // Retorna o array de pastas

let categorias = {};

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFile = fs.readdirSync(commandsPath); // Retorna o array de arquivos

    // Cada pasta será uma propriedade
    categorias[folder] = [];

    for (const file of commandFile) {
        // Guarda o nome do arquivo na categoria correspondente
        const comando = file.replace(".js", "");
        categorias[folder].push(comando);
    }
}

console.log(categorias);