require("dotenv").config();
const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	AttachmentBuilder,
	PermissionFlagsBits,
} = require("discord.js");
const canvacord = require("canvacord");
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
			description:
				"Enter a user's global name with an @ to lookup their infractions.",
			type: ApplicationCommandOptionType.Mentionable,
		},
	],

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("You can only run this command inside a server.");
			return;
		}

		const mentionedUserId = interaction.options.get("user")?.value;
		const userId = mentionedUserId || interaction.member.id;
		const user = await interaction.guild.members.fetch(userId);

		await interaction.deferReply();

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
				let allInfractions = await Infraction.find({ guildId: interaction.guild.id }).select('-_id infractions userId')

				// Does not work
				let currentRank = allInfractions.findIndex((infraction) => infraction.userId === userId) + 1;

				canvacord.Font.loadDefault();

				const card = new canvacord.RankCardBuilder()
					.setUsername(`${user.user.username} (Total Infractions: ${infractionRecord.infractions})`)
					.setDisplayName(user.user.globalName)
					// .setDiscriminator(user.user.discriminator)
					.setAvatar(user.user.displayAvatarURL())
					.setCurrentXP(infractionRecord.infractions % 10)
					.setRequiredXP(10)
					.setLevel(Math.floor(infractionRecord.infractions / 10))
					.setRank(currentRank)
					.setTextStyles({
						level: `Infraction Threshold:`,
						xp: `Infractions:`,
						rank: `Rank:`,
					});
				// let infractionDetails = `**User:** ${
				// 	user.user.globalName || user.user.username
				// }\n**Total Infractions:** ${
				// 	infractionRecord.infractions
				// }\n**Words Used:**\n`;

				// infractionRecord.wordUsed.forEach((word, index) => {
				// 	infractionDetails += ` ${index + 1}: ${word}\n`;
				// });

				const data = await card.build({ format: 'png' });
				const attachment = new AttachmentBuilder(data);

				// await interaction.editReply(infractionDetails);
				await interaction.editReply({ files: [attachment] });
			} else {
				await interaction.editReply(
					`User ${
						user.user.globalName || user.user.username
					} has no infractions.`
				);
			}
		} catch (err) {
			console.log(`There was an error looking up this user: ${err}`);
			await interaction.editReply(
				`There was an error looking up this user. Please try again later.`
			);
		}
	},
};
