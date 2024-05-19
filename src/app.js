require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require('mongoose');
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates,
	],
});

(async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to Mongo");

		eventHandler(client);

		client.login(process.env.TOKEN);
	} catch (err) {
		console.log(`There was an error while attempting to connect to the DB: ${err}`);
	}
})();
