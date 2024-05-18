const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");

//interaction.channel.send()
module.exports = {
	// deleted: true,
	name: "report",
	description: "Used to report an infraction.",
	// devOnly: true,
	// testOnly: true,
	options: [
		{
			name: "user",
			description: "A user to give an infraction.",
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
		{
			name: "word",
			description: "A valid word from the dictionary.",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],

	/**
	 * 
	 * @param {Client} client 
	 * @param {Interaction} interaction 
	 */

	callback: async (client, interaction) => {
		const userId = interaction.options.get('user').value;
		const word = interaction.options.get('word').value;

		await interaction.deferReply();

		const user = await interaction.guild.members.fetch(userId);

		if (!user) {
			await interaction.editReply(
				"This user does not exist in this server."
			);
			return;
		}

		// Check to see if the word is in the dictonary

		// Give the user an infraction
		try {
			await interaction.editReply(
				`User ${user} was given an infraction for using the word: '${word}.'`
			);
		} catch (err) {
			console.log(`There was an error reporting a user: ${err}`);
		}
	},
};
