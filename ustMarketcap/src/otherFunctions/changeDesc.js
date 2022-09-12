// >> Modules
require('dotenv').config();

// >> Main function
async function change(client, desc) {
	client.user.setActivity(desc, {
		type: 'WATCHING',
	});
}

module.exports = { change };
