module.exports = {
	// deleted: true,
	name: "ping",
	description: "Roonie",
	// devOnly: Boolean,
	testOnly: true,
	// options: Object[],

	callback: async (client, interaction) => {
		await interaction.deferReply();

		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		interaction.editReply(`Client: ${ping}ms | WS: ${client.ws.ping}ms`);
	},
};
