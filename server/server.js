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
const MongoClient = require('mongodb').MongoClient
const createRouter = require('./helpers/create_router.js');

var STOCKS_COLLECTION = "stocks";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;


// let MONGODB_URI = 'mongodb://heroku_qcn0j2rv:r4cv6kjmmbnbkuqa9qd7phcser@ds245387.mlab.com:45387/heroku_qcn0j2rv'

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

app.get("/api/stocks", function(req, res) {
    db.collection(STOCKS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get stocks.");
    } else {
      res.status(200).json(docs);
    }
  })
});

app.post("/api/stocks", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else {
    db.collection(STOCKS_COLLECTION).insertOne(newContact, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

app.get("/api/stocks/:id", function(req, res) {
});

app.patch("/api/stocks/:id", function(req, res) {
});


const port = process.env.PORT || 3000;
app.listen(port);
