module.exports = {
	// deleted: true,
	name: "word_info",
	description: "A brief description of a word followed by the proper way to pronouce it.",
	// devOnly: true,
	// testOnly: true,
	// options: Object[],

	callback: (client, interaction) => {
		interaction.reply(`This took ${client.ws.ping}ms to fire.`);
	},
};