const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "bcoffee_test2",
  password: "password",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log(err);
  }
});

module.exports = mysqlConnection;