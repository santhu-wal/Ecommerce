var mysql = require("mysql");
var util=require('util');

//establish connection to db
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Santhu@123",
  database: "shop",
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const query = util.promisify(connection.query).bind(connection);

module.exports = query;
