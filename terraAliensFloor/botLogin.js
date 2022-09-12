// >> Modules
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// >> Imports
const { dbCon } = require('./dbConnect.js');

// >> Bot startup
const client = new Client({
	intents: [Intents.FLAGS.GUILDS],
});

const botFunctions = fs
	.readdirSync('./src/functions')
	.filter((file) => file.endsWith('.js'));
const botEventFiles = fs
	.readdirSync('./src/events')
	.filter((file) => file.endsWith('.js'));

(async () => {
	for (botFiles of botFunctions) {
		require(`./src/functions/${botFiles}`)(client);
	}
	client.handleEvents(botEventFiles, './src/events');
	client.login(process.env.botToken);
})();
