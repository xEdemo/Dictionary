require("dotenv").config();
const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");
const { Word, Infraction } = require("../../models");

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
		const word = interaction.options.get('word').value.toLowerCase();

		await interaction.deferReply();

		const user = await interaction.guild.members.fetch(userId);

		if (!user) {
			await interaction.editReply(
				"This user does not exist in this server."
			);
			return;
		}

		try {
			// Check to see if the word is in the dictonary
			const checkWord = await Word.findOne({ word });
			if (!checkWord) {
				await interaction.editReply(
					`'${word}' does not exist in the dictionary. Use command /add_word to add ${word} to the dictionary.'`
				);
				return;
			}

			// Give the user an infraction
			const userDB = await Infraction.findOne({
				userId: userId,
				guildId: interaction.guild.id,
			});
			let infractionCount;

			if (userDB) {
				userDB.infractions++;
				userDB.wordUsed.push(word);

				await userDB.save();

				infractionCount = userDB.infractions;

				await interaction.editReply({
					content: `Report submitted for ${user.user.globalName || user.user.username}. They were given an infraction for using the word '${word}.' They now have ${infractionCount} infractions.'`,
                    ephemeral: true
				});
			} else {
				const newUser = new Infraction({
					userId,
					guildId: interaction.guild.id,
					wordUsed: [word],
					infractions: 1,
				});

				await newUser.save();

				infractionCount = 1;

				await interaction.editReply({
					content: `Report submitted for ${user.user.globalName || user.user.username}. They were given their first infraction for using the word '${word}.'`,
					ephemeral: true
				});
			}

			// Send a message to the infraction channel
			if (process.env.INFRACTION_CHANNEL_ID) {
				const infractionChannel = client.channels.cache.get(process.env.INFRACTION_CHANNEL_ID);
				if (infractionChannel) {
					infractionChannel.send(
						`User ${user} was reported for using the word: '${word}'. They now have ${infractionCount} infraction(s).`
					);
				}
			} else {
				console.log(`Infraction channel was not found.`);
			}

			// Add timeout at X amount of infractions, bots needs permissions (muteMembers)

		} catch (err) {
			console.log(`There was an error reporting a user: ${err}`);
			await interaction.editReply(`There was an error reporting this user. Please try again later.`);
		}
	},
};
