// Portfolio Route
var express = require('express');
var router = express.Router();
var portCtrl = require('../controllers/portfolioController');

router.route('/')
	// find user by username
	// .get(function(req, res) {
	// 	userCtrl.findByUserName(req, res);
	// })

	// Update user by id
	.post(function(req, res) {
		portCtrl.savePortfolio(req, res);
	});


module.exports = router;