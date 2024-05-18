const { ActivityType } = require('discord.js');

const status = [
	{
		name: "Listening for Infractions",
		type: ActivityType.Custom,
	},
	{
		name: "Crunching Numbers",
		type: ActivityType.Custom,
	},
]

module.exports = (client) => {
	setInterval(() => {
		const random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 60000);
}