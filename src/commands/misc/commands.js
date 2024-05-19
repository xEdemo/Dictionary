const getLocalCommands = require("../../utils/getLocalCommands.js");

module.exports = {
	// deleted: true,
	name: "commands",
	description: "List of all bot commands.",
	// devOnly: true,
	// testOnly: true,
	// options: Object[],

	callback: (client, interaction) => {
		let str = "**Commands:**\n\n";
		let localCommands = getLocalCommands();

		localCommands = localCommands.sort((a, b) => a.name.localeCompare(b.name));

		for (const localCommand of localCommands) {
			const { name, description, deleted } = localCommand;
			if (!deleted) {
				str += `Command: /${name}\nDescription: ${description}\n\n`
			}
		}

		interaction.reply({
            content: str,
            ephemeral: true,
        });
	},
};