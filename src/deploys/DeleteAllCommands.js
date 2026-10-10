const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const clientId = process.env.DISCORD_BOT_ID;
const clientToken = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.GUILD_TESTE_ID;

const rest = new REST().setToken(clientToken);

rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
    .then(() => console.log("Todos comando deletado com sucesso ✅"))
    .catch(console.error);