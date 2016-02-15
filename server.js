var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var epilogue = require('epilogue');

//var db = require('./models/dbModel');
// var routes = require('./routes');
//var portRoute = require('./routes/portfolioRoute');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('In server.js');

    // make sure we go to the next routes and don't stop here
    next(); 
});

app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080");
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
});

// Define database
var database = new Sequelize('finsight-prod', 'postgres', 'ch@ngeme', { dialect: 'postgres' });
//var database = new Sequelize('finsight', 'postgres', 'ch@ngeme', { dialect: 'postgres' });

// Portfolio Model
var Portfolio = database.define('Portfolio', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  firm: Sequelize.STRING,
  accountNumber: Sequelize.STRING
});

// Tickers Model
var Ticker = database.define('Ticker', {
  symbol: Sequelize.STRING,
  name: Sequelize.STRING,
  description: Sequelize.STRING
});

// TransactionType
var TransactionType = database.define('TransactionType', {
  name: Sequelize.STRING,
  description: Sequelize.STRING
});

// Transactions Model
var Transaction = database.define('Transaction', {
  executionDate: Sequelize.DATE,
  quantity: Sequelize.FLOAT,
  price: Sequelize.FLOAT,
  commission: Sequelize.FLOAT,
  tickerId: {
    type: Sequelize.INTEGER,
      references: {
        model: Ticker,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
  },
  transactionTypeId: {
    type: Sequelize.INTEGER,
      references: {
        model: TransactionType,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
  },
  portfolioId: {
    type: Sequelize.INTEGER,
      references: {
        model: Portfolio,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
  }
});

// PriceHistory Model
var PriceHistory = database.define('PriceHistory', {
  date: Sequelize.DATE,
  price: Sequelize.FLOAT,
  tickerId: {
    type: Sequelize.INTEGER,
      references: {
        model: Ticker,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
  }
});

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
});

// Create REST resources
var portfolioResource = epilogue.resource({
  model: Portfolio,
  endpoints: ['/portfolios', '/portfolios/:id']
});

var tickerResource = epilogue.resource({
  model: Ticker,
  endpoints: ['/tickers', '/tickers/:id']
});

var transactionTypeResource = epilogue.resource({
  model: TransactionType,
  endpoints: ['/transtypes', '/transtypes/:id']
});

var transactionResource = epilogue.resource({
  model: Transaction,
  endpoints: ['/trans', '/trans/:id']
});

var priceHistoryResource = epilogue.resource({
  model: PriceHistory,
  endpoints: ['/price', '/price/:id']
});

// Create database and listen
database
  .sync({ force: false })
  .then(function() {
    app.listen(port, function() {
      console.log('listening at %s', port);
    });
  });

