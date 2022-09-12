// >> Modules
require('dotenv').config();

// >> Main function
async function change(client, colorHex) {
	client.guilds.cache.forEach((guild) => {
		const role = guild.roles.cache.find(
			(role) => role.name === process.env.botRoleName
		);
		if (role) {
			role.edit({ color: `${colorHex}` }).catch((error) => {
				console.log(
					`'${guild.name}': Error: Bot don't have permissions to edit '${process.env.botRoleName}' role!`
				);
			});
		} else {
			console.log(
				`'${guild.name}': Error: '${process.env.botRoleName}' role not found! (Check permissions)`
			);
		}
	});
}

module.exports = { change };
