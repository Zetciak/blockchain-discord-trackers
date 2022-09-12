// >> Modules
require('dotenv').config();

// >> Main function
async function change(client, low_24h, high_24h) {
	client.user.setActivity(
		`${process.env.arrowDown}: $${low_24h.toFixed(
			Number(process.env.fixedPrice)
		)}, ${process.env.arrowUp}: $${high_24h.toFixed(
			Number(process.env.fixedPrice)
		)}`,
		{
			type: 'WATCHING',
		}
	);
}

module.exports = { change };
