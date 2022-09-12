// >> Modules
require('dotenv').config();
const snekfetch = require('snekfetch');

// >> Imports
const changeName = require('./../otherFunctions/changeName.js');
const changeDesc = require('./../otherFunctions/changeDesc.js');
const dbCon = require('../../dbConnect.js');

// >> Variables
const api = `https://luart-marketplace-prices-indexer.2ue2d8tpif5rs.eu-central-1.cs.amazonlightsail.com/nft-collection-prices/${process.env.tokenName}`;
const refreshTime = 1000 * 120;
let lunaPrice = 0;
let collectionFloor = 0;
let collectionFloorCount = 0;
let lastFloor = 0;
let floorChange = 0;
let max24h = 0;
let floor24h = 0;
let firstTime = true;
let globalClient;

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Timer functions loaded!`);
	globalClient = client;

	// Refresh LUNA Price
	refreshLunaPrice();

	setInterval(function () {
		refreshLunaPrice();
	}, refreshTime);
}

function refreshLunaPrice() {
	snekfetch
		.get(
			'https://api.coingecko.com/api/v3/coins/terra-luna?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'
		)
		.then((response) => {
			lunaPrice = Number(
				response.body.market_data.current_price.usd.toFixed(2)
			);
			cacheFloor();
		});
}

function cacheFloor() {
	lastFloor = collectionFloor;
	collectionFloor = 0;
	let collectionLength = 0;
	let count1 = 0;
	snekfetch
		.get(
			`https://luart-marketplace-prices-indexer.2ue2d8tpif5rs.eu-central-1.cs.amazonlightsail.com/nft-collection-prices/${process.env.collectionAddress}`
		)
		.then((response) => {
			for (const [key, value] of Object.entries(response.body.prices)) {
				collectionLength = collectionLength + 1;
			}
			for (const [key, value] of Object.entries(response.body.prices)) {
				let tokenPrice;
				count1 = count1 + 1;
				if (value.sellPriceCurrency === 'LUNA') {
					tokenPrice = Number(value.sellPriceAmount);
				} else {
					tokenPrice = Number(
						(value.sellPriceAmount / lunaPrice).toFixed(2)
					);
				}
				if (collectionFloor === 0) {
					collectionFloor = tokenPrice;
				} else {
					if (collectionFloor > tokenPrice) {
						collectionFloor = tokenPrice;
					}
				}
				if (count1 === collectionLength) {
					//Insert into floor cache
					let nowTimestamp = Number(Date.now());
					dbCon.query(
						`INSERT INTO ta_floors (price, timestamp) VALUES ("${collectionFloor}", "${nowTimestamp}")`,
						async function (err, result, fields) {
							cacheFloorCount(response, collectionLength);
						}
					);
				}
			}
		});
}

function cacheFloorCount(response, collectionLength) {
	collectionFloorCount = 0;
	let count1 = 0;
	for (const [key, value] of Object.entries(response.body.prices)) {
		let tokenPrice;
		count1 = count1 + 1;

		if (value.sellPriceCurrency === 'LUNA') {
			tokenPrice = Number(value.sellPriceAmount);
		} else {
			tokenPrice = Number((value.sellPriceAmount / lunaPrice).toFixed(2));
		}

		if (tokenPrice === collectionFloor) {
			collectionFloorCount = collectionFloorCount + 1;
		}

		if (count1 === collectionLength) {
			cacheMinMax();
		}
	}
}

function cacheMinMax() {
	let nowTimestamp = Number(Date.now());
	let db24h = nowTimestamp - 86400000;
	dbCon.query(
		`SELECT price FROM ta_floors WHERE timestamp>${db24h}`,
		async function (error, result, fields) {
			if (error) {
				console.log(error);
			} else {
				max24h = 0;
				floor24h = 0;
				for (const [key, value] of Object.entries(result)) {
					if (Number(key) === 0) {
						max24h = value.price;
						floor24h = value.price;
					} else {
						if (value.price > max24h) {
							max24h = value.price;
						}
						if (value.price < floor24h) {
							floor24h = value.price;
						}
					}
				}
				changeInformations();
			}
		}
	);
}

async function changeInformations() {
	// Change name
	if (firstTime === true) {
		changeName.change(
			globalClient,
			firstTime,
			collectionFloor,
			floorChange
		);
		firstTime = false;
	} else {
		floorChange = (collectionFloor - lastFloor).toFixed(Number(2));
		changeName.change(
			globalClient,
			firstTime,
			collectionFloor,
			floorChange
		);
	}

	// Change desc
	changeDesc.change(globalClient, floor24h, max24h);

	// Change channels names
	const floorChannel = await globalClient.channels.fetch(
		process.env.floorChannel
	);
	if (floorChannel) {
		floorChannel.setName(`🔻┇Floor: ${collectionFloor.toFixed(2)}$LUNA`);
	}

	const floorCountChannel = await globalClient.channels.fetch(
		process.env.floorCountChannel
	);
	if (floorCountChannel) {
		floorCountChannel.setName(`🔄┇Floor Count: ${collectionFloorCount}`);
	}
}

module.exports = { mainFunction };
