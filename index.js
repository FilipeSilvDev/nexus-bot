const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const CommandHandler = require("./src/handler/CommandHandler");
const EventHandler = require("./src/handler/EventHandler");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

CommandHandler.execute(client);
EventHandler.execute(client);

client.login(token);