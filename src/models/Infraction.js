const mongoose = require('mongoose');

const InfractionSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	wordUsed: {
		type: [String],
		required: true,
	},
	infractions: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model('Infraction', InfractionSchema);