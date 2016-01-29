// Portfolio Controller
var mongoose = require('mongoose');
var portdata = require('../models/portfolioModel');

exports.savePortfolio = function savePortfolio(req, res) {

	// Get data from request POST
	// var Port = mongoose.model('PortfolioModel');
	var port = { name: req.body.name, description: req.body.description };
	console.log("model port", port);

	//Save to db
	portdata.addPortfolio(port, function(err, retport){
		res.json( { Portfolio: retport });
	});
}