require("dotenv").config();
const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");
const { Word } = require("../../models");

//interaction.channel.send()
module.exports = {
	// deleted: true,
	name: "remove_word",
	description: "Removes a word to the dictonary.",
	// devOnly: true,
	// testOnly: true,
	options: [
		{
			name: "word",
			description: "A word to be added to the dictonary.",
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],

	/**
	 * 
	 * @param {Client} client 
	 * @param {Interaction} interaction 
	 */
	callback: async (client, interaction) => {
		const word = interaction.options.get('word').value.toLowerCase();

		await interaction.deferReply();

		try {
			// Check to see if word already exists in DB
			const entry = await Word.findOneAndDelete({ word });
			if (entry) {
				await interaction.editReply(
					`'${word}' was successfully removed from the dictionary ✅`
				);
			} else {
				await interaction.editReply(
					`'${word}' does not exist in the dictionary.`
				);
				return;
			}
		} catch (err) {
			console.log(`There was an error updating the dictionary: ${err}`);
			await interaction.editReply(`There was an error removing the word fro, the dictionary. Please try again later.`);
		}
	},
};