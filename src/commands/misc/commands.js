module.exports = {
	// deleted: true,
	name: "commands",
	description: "List of useful bot commands.",
	// devOnly: true,
	// testOnly: true,
	// options: Object[],

	callback: (client, interaction) => {
		interaction.reply("**COMMANDS:**\n- /report (Reports a user for an infraction)\n- /help (Gives an idea on how to use this bot)\n- /word_list (Gives a full list of banned words)\n- /add_word (Adds a word to the dictionary)");
	},
};