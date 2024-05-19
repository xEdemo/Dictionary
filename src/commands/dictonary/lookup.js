require("dotenv").config();
const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");
const { Infraction } = require("../../models");

//interaction.channel.send()
module.exports = {
	// deleted: true,
	name: "lookup",
	description: "Looksup a user to see if they have any infractions.",
	// devOnly: true,
	// testOnly: true,
	options: [
		{
			name: "user",
			description: "Enter a user's global name with an @ to lookup their infractions.",
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
	],

	/**
	 * 
	 * @param {Client} client 
	 * @param {Interaction} interaction 
	 */
	callback: async (client, interaction) => {
		const userId = interaction.options.get('user').value;

		await interaction.deferReply();

		const user = await interaction.guild.members.fetch(userId);

		if (!user) {
			await interaction.editReply(
				"This user does not exist in this server."
			);
			return;
		}

		try {
			const infractionRecord = await Infraction.findOne({
				userId: userId,
				guildId: interaction.guild.id,
			});

			if (infractionRecord) {
				let infractionDetails = `**User:** ${user.user.globalName || user.user.username}\n**Total Infractions:** ${infractionRecord.infractions}\n**Words Used:**\n`;

				infractionRecord.wordUsed.forEach((word, index) => {
					infractionDetails += ` ${index + 1}: ${word}\n`;
				});

				await interaction.editReply(infractionDetails);
			} else {
				await interaction.editReply(`User ${user.user.globalName || user.user.username} has no infractions.`)
			}
		} catch (error) {
			console.log(`There was an error looking up this user: ${err}`);
			await interaction.editReply(`There was an error looking up this user. Please try again later.`);
		}	
	},
};