// >> Modules
require('dotenv').config();

// >> Imports
const timerFunction = require('./../otherFunctions/timerFunction.js');

// >> Functions
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[BOT]: Logged as ${client.user.tag}!`);

		// Start other functions
		timerFunction.mainFunction(client);
	},
};
