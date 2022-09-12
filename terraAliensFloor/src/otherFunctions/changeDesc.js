// >> Modules
require('dotenv').config();

// >> Main function
async function change(client, low_24h, high_24h) {
	client.user.setActivity(
		`${process.env.arrowDown}: ${low_24h.toFixed(Number(2))}$L, ${
			process.env.arrowUp
		}: ${high_24h.toFixed(Number(2))}$L`,
		{
			type: 'WATCHING',
		}
	);
}

module.exports = { change };
