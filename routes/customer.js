const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();

//comit

 //11--------------------------------------------------------------------------------
Router.get("/customer/:customerId", (req, res) => {
  let customer_id = req.params.customerId
  if (customer_id == "") {
    mysqlConnection.query(
      `SELECT customer_id, name, SSN, sex, birthdate, phone_no, memberpoint FROM customer`,
      (err, results, fields) => {
        if (!err) {
          res.send(results);
          console.log(req.body);
        } else {
          console.log(err);
        }
      }
    );
  }
  else {
    mysqlConnection.query(
      `SELECT customer_id, name, SSN, sex, birthdate, phone_no, memberpoint FROM customer WHERE customer_id = ${customer_id}`,
      (err, results, fields) => {
        if (!err) {
          res.send(results);
          console.log(req.body);
        } else {
          console.log(err);
        }
      }
    );
  }
});

 //12--------------------------------------------------------------------------------
 Router.post("/customer/add", (req, res) => {
  let qb = req.body;
  const sql =
    "SET @name = ?;SET @SSN = ?;SET @sex = ?;SET @birthdate = ?;SET @memberpoint = ?;SET @phone_no = ?;CALL AddCustomer(@name, @SSN, @sex, @birthdate, @memberpoint, @phone_no)";
  mysqlConnection.query(
    sql,
    [
      qb.name,
      qb.SSN,
      qb.sex,
      qb.birthdate,
      qb.memberpoint,
      qb.phone_no
    ],
    (err, results, fields) => {
      if (!err) {
        results.forEach((element) => {
          if (element.constructor == Array) res.send(element);
        });
      } else {
        console.log(err);
      }
    }
  );
});

 



module.exports = Router;





