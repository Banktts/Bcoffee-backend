const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();


//9-------------------------------------------------------------------------------top spenderrrrrr-
Router.get("/branch/:date", (req, res) => {
    mysqlConnection.query(
      "select * from branch",
      (err, results, fields) => {
        if (!err) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  });


  module.exports = Router;