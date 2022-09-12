// >> Modules
require('dotenv').config();

// >> Imports
const timerFunction = require('./../otherFunctions/timerFunction.js');
const dbCon = require('../../dbConnect.js');
const dbPinger = require('./../otherFunctions/dbPinger.js');

// >> Functions
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[BOT]: Logged as ${client.user.tag}!`);

		// Start other functions
		dbPinger.mainFunction(client);
		timerFunction.mainFunction(client);
	},
};
