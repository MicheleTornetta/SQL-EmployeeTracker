const mysql = require("mysql2");
const secrets = require('./secrets.json');

const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: secrets.password,
  database: "testdb"
});

module.exports = connection;
