// >> Modules
require('dotenv').config();

// >> Imports
const changeColor = require('./../otherFunctions/changeColor.js');

// >> Main function
async function change(client, firstTime, current, change) {
	let newName = ``;
	if (firstTime === true) {
		newName = `${process.env.realTokenName} ${
			process.env.arrowNormal
		} $${current.toFixed(Number(process.env.fixedPrice))}`;
		changeColor.change(client, process.env.orangeHex);
	} else {
		if (change < 0) {
			change = change * -1;
			newName = `${process.env.realTokenName} ${
				process.env.arrowDown
			} $${current.toFixed(
				Number(process.env.fixedPrice)
			)} (-$${change})`;
			changeColor.change(client, process.env.redHex);
		} else if (change == 0) {
			// Równe
			newName = `${process.env.realTokenName} ${
				process.env.arrowNormal
			} $${current.toFixed(Number(process.env.fixedPrice))}`;
			changeColor.change(client, process.env.orangeHex);
		} else if (change > 0) {
			//Wzrosło
			newName = `${process.env.realTokenName} ${
				process.env.arrowUp
			} $${current.toFixed(
				Number(process.env.fixedPrice)
			)} (+$${change})`;
			changeColor.change(client, process.env.greenHex);
		}
	}

	client.guilds.cache.forEach((guild) => {
		guild.me.setNickname(newName);
	});
}

module.exports = { change };
