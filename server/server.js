// const express = require('express');
// const app = express();
// const path = require('path');
// const parser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const createRouter = require('./helpers/create_router.js');
//
//
// const publicPath = path.join(__dirname, '../client/public');
// app.use(express.static(publicPath));
// app.use(parser.json());
//
// MongoClient.connect('mongodb://localhost:27017')
// .then((client) => {
//   const db = client.db('valued_stocks');
//   const stocksCollection = db.collection('stocks');
//   const stocksRouter = createRouter(stocksCollection);
//   app.use('/api/stocks', stocksRouter);
// })
// .catch(console.error)
//
// app.listen(3000, function(){
//   console.log(`Listening on Port ${this.address().port}`);
// });


var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW
