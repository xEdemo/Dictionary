const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
	word: {
		type: String,
		required: true,
		unique: true,
	},
	pronunciation: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	addedBy: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Word', WordSchema);