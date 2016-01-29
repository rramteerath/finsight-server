var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://localhost/finsight');

autoIncrement.initialize(connection);

var portfolioSchema = new Schema({
    name: String,
    description: String,
    created: Date,
    updated: { type: Date, default: Date.now }
});

var teamSchema = new mongoose.Schema({
	country: String,
	GroupName: String
});

// Add auto-increment 
portfolioSchema.plugin(autoIncrement.plugin, {model: 'Portfolio'});

module.exports = mongoose.model('Portfolio', portfolioSchema);
// mongoose.model('Teams', portfolioSchema);


