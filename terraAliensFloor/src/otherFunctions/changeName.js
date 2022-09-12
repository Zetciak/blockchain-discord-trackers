// >> Modules
require('dotenv').config();

// >> Imports
const changeColor = require('./../otherFunctions/changeColor.js');

// >> Main function
async function change(client, firstTime, current, change) {
	let newName = ``;
	if (firstTime === true) {
		newName = `FP ${process.env.arrowNormal} ${current.toFixed(
			Number(2)
		)}$LUNA`;
		changeColor.change(client, process.env.orangeHex);
	} else {
		if (change < 0) {
			change = change * -1;
			newName = `FP ${process.env.arrowDown} ${current.toFixed(
				Number(2)
			)}$LUNA (-${change}$LUNA)`;
			changeColor.change(client, process.env.redHex);
		} else if (change == 0) {
			// Równe
			newName = `FP ${process.env.arrowNormal} ${current.toFixed(
				Number(2)
			)}$LUNA`;
			changeColor.change(client, process.env.orangeHex);
		} else if (change > 0) {
			//Wzrosło
			newName = `FP ${process.env.arrowUp} ${current.toFixed(
				Number(2)
			)}$LUNA (+${change}$LUNA)`;
			changeColor.change(client, process.env.greenHex);
		}
	}

	client.guilds.cache.forEach((guild) => {
		guild.me.setNickname(newName);
	});
}

module.exports = { change };
