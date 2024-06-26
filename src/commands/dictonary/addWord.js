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
	name: "add_word",
	description: "Adds a word to the dictonary.",
	// devOnly: true,
	// testOnly: true,
	options: [
		{
			name: "word",
			description: "A word to be added to the dictonary.",
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "pronunciation",
			description: "Proper way to pronouce the word.",
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
		const pronunciation = interaction.options.get('pronunciation').value.toLowerCase();

		await interaction.deferReply();

		try {
			// Check to see if word already exists in DB
			const entry = await Word.findOne({ word });
			if (entry) {
				await interaction.editReply(
					`'${word}' already exists in the dictionary.`
				);
				return;
			} else {
				const newEntry = await Word({
					word,
					pronunciation,
					guildId: interaction.guild.id,
					addedBy: interaction.user.globalName || interaction.user.username,
				});

				await newEntry.save();

				await interaction.editReply(
					`'${word}' has been added to the dictionary by ${newEntry.addedBy}.`
				);
			}
		} catch (err) {
			console.log(`There was an error updating the dictionary: ${err}`);
			await interaction.editReply(`There was an error adding the word to the dictionary. Please try again later.`);
		}
	},
};