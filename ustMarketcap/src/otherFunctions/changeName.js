// >> Modules
require('dotenv').config();

// >> Main function
async function change(client, name) {
	client.guilds.cache.forEach((guild) => {
		guild.me.setNickname(name);
	});
}

module.exports = { change };
