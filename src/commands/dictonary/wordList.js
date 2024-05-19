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
	name: "word_list",
	description: "Adds a word to the dictonary.",
	// devOnly: true,
	// testOnly: true,

	/**
	 * 
	 * @param {Client} client 
	 * @param {Interaction} interaction 
	 */
	callback: async (client, interaction) => {
		await interaction.deferReply();

		try {
			// Fetch all words from the database
			const words = await Word.find({}, 'word pronunciation addedBy');

			if (words.length === 0) {
				await interaction.editReply("The dictionary is currently empty.");
				return;
			}

			let wordList = "Here is the list of all valid words:\n\n";
			words.forEach((word) => {
				wordList += `**Word:** ${word.word}\n**Pronunciation:** ${word.pronunciation}\n**Added By:** ${word.addedBy}\n\n`;
			});

			// Message has to be split into multiple messages due to Discord's 2000 character limit
			const messageChunks = [];
			while (wordList.length > 2000) {
				let chunk = wordList.slice(0, 2000);
				const lastNewlineIndex = chunk.lastIndexOf('\n');
				if (lastNewlineIndex !== -1) {
					chunk = wordList.slice(0, lastNewlineIndex);
				}
				messageChunks.push(chunk);
				wordList = wordList.slice(chunk.length).trim();
			}
			messageChunks.push(wordList);

			// Send each chunk as a separate message
			for (const chunk of messageChunks) {
				await interaction.followUp(chunk);
			}

		} catch (err) {
			console.log(`There was an error getting the dictionary: ${err}`);
			await interaction.editReply(`There was an error getting the dictionary. Please try again later.`);
		}
	}
}