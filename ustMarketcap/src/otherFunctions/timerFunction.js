// >> Modules
require('dotenv').config();
const snekfetch = require('snekfetch');

// >> Imports
const changeName = require('./../otherFunctions/changeName.js');
const changeDesc = require('./../otherFunctions/changeDesc.js');

// >> Variables
const api = `https://api.coingecko.com/api/v3/coins/${process.env.tokenName}`;
const refreshTime = 1000 * 90; // 1 minute
let current = 0;
let last = 0;
let change = 0;
let first = true;
let globalClient;

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Timer functions loaded!`);
	globalClient = client;

	//Refresh prices function
	async function refreshPrices() {
		snekfetch.get(api).then((response) => {
			// New values
			last = current;
			current = (
				Number(response.body.market_data.market_cap.usd) / 1000000000
			).toFixed(2);

			// Changing bot name
			changeDesc.change(globalClient, '$UST Market Cap');

			// Change bot desc
			changeName.change(globalClient, `$${current}bn`);
		});
	}

	//Set refresh timer
	refreshPrices();

	setInterval(function () {
		refreshPrices();
	}, refreshTime);
}

module.exports = { mainFunction };

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
