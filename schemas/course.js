// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// tag schema
var courseSchema = new Schema({
	name: { type: String, required: true},
	category: { type: String, required: true},
	dateCreated: { type: String, required: true },
	description: { type: String, required: true }
});

// return the model
module.exports = mongoose.model('Course', courseSchema);
