//interaction.channel.send()
module.exports = {
	// deleted: true,
	name: "add_word",
	description: "Adds a word to the dictonary.",
	// devOnly: true,
	// testOnly: true,
	// options: Object[],

	callback: (client, interaction) => {
		interaction.reply(`This took ${client.ws.ping}ms to fire.`);
	},
};