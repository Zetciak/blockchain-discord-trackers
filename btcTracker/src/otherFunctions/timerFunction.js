// >> Modules
require('dotenv').config();
const snekfetch = require('snekfetch');

// >> Imports
const changeName = require('./../otherFunctions/changeName.js');
const changeDesc = require('./../otherFunctions/changeDesc.js');

// >> Variables
const api = `https://api.coingecko.com/api/v3/coins/${process.env.tokenName}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
const refreshTime = 1000 * 60; // 1 minute
let high_24h = 0;
let low_24h = 0;
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
			high_24h = Number(
				response.body.market_data.high_24h.usd.toFixed(
					Number(process.env.fixedPrice)
				)
			);
			low_24h = Number(
				response.body.market_data.low_24h.usd.toFixed(
					Number(process.env.fixedPrice)
				)
			);
			current = Number(
				response.body.market_data.current_price.usd.toFixed(
					Number(process.env.fixedPrice)
				)
			);

			// Check low and top
			if (current > high_24h) {
				high_24h = current;
			} else if (current < low_24h) {
				low_24h = current;
			}

			// Changing bot name
			if (first == true) {
				changeName.change(globalClient, first, current, change);
				first = false;
			} else {
				change = (current - last).toFixed(
					Number(process.env.fixedPrice)
				);
				changeName.change(globalClient, first, current, change);
			}
			// Change bot desc
			changeDesc.change(globalClient, low_24h, high_24h);
		});
	}

	//Set refresh timer
	refreshPrices();

	setInterval(function () {
		refreshPrices();
	}, refreshTime);
}

module.exports = { mainFunction };
