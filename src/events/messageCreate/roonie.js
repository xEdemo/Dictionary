module.exports = (client, message) => {
	if (message.author.bot) {
		return;
	};

	if (message.content === "roonie") {
		message.reply("Fuck off roonie.");
	};
}