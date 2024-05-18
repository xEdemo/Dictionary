const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");

module.exports = {
	// deleted: true,
	name: "ban",
	description: "Bans a member from this server.",
	devOnly: true,
	// testOnly: Boolean,
	options: [
		{
			name: "target",
			description: "The user to ban.",
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: "reason",
			description: "The reason for banning.",
			required: false,
			type: ApplicationCommandOptionType.String,
		},
	],
	// Add whatever permissions are required to execute commands
	permissionsRequired: [PermissionFlagsBits.BanMembers],
	botPermissions: [PermissionFlagsBits.BanMembers],

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		const targetId = interaction.options.get("target").value;
		const reason =
			interaction.options.get("reason")?.value || "No reason provided";

		await interaction.deferReply();

		const target = await interaction.guild.members.fetch(targetId);

		if (!target) {
			await interaction.editReply(
				"This user does not exist in this server."
			);
			return;
		}

		if (target.id === interaction.guild.ownerId) {
			await interaction.editReply(
				"You cannot ban the owner of this server."
			);
			return;
		}

		// Highest role of the target user
		const targerUserRolePosition = target.roles.highest.position;
		// Highest role of the user running the command
		const requestUserRolePosition =
			interaction.member.roles.highest.position;
		// Highest role of the bot
		const botRolePosition =
			interaction.guild.members.me.roles.highest.position;

		if (targerUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				"You cannot ban that user because they have the same or higher role than you."
			);
			return;
		}

		if (targerUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"I cannot ban that user because they have the same or higher role than me."
			);
			return;
		}

		// Ban target
		try {
			await target.ban({ reason });
			await interaction.editReply(
				`User ${target} was banned.\nReason: ${reason}`
			);
		} catch (err) {
			console.log(`There was an error banning target: ${err}`);
		}
	},
};
