require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
	{
		name: "help",
		description: "Type /commands for a full list of commands.",
	},
	{
		name: "commands",
		description: "List of useful commands.",
	},
	{
		name: "word_list",
		description: "List of all the naughty words",
	},
	{
		name: "report",
		description:
			"Used to report an infraction. Use /report <globalName> <word>",
	},
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Regestering slash commands...');

		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }
		);

		console.log('Success ✔: Slash commands registered.');
	} catch (err) {
		console.log(`There was an error: ${err}`);
	}
})();
