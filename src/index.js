require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Création du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Collection pour stocker les commandes
client.commands = new Collection();

// Chargement des gestionnaires
const handlersDir = path.join(__dirname, 'handlers');
const handlerFiles = fs.readdirSync(handlersDir).filter(file => file.endsWith('.js'));

for (const file of handlerFiles) {
  const handler = require(path.join(handlersDir, file));
  handler(client);
}

// Connexion du bot
client.login(process.env.BOT_TOKEN);
