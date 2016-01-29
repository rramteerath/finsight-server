// Portfolio Model
var mongoose = require('mongoose');

exports.addPortfolio = function addPortfolio(portData, callback){

	var Port = mongoose.model('Portfolio');
	var newPort = new Port ({ name: portData.name, description: portData.description });

	console.log("Saving data...");
	console.log(newPort);
	newPort.save(function(err, updatedPort) {
		if (err){
			console.error(err);
		}
		else {
			callback("", updatedPort);
		}
	});
}