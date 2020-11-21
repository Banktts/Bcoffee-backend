const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();


//9-------------------------------------------------------------------------------
Router.get("/branch/:branchId", (req, res) => {
  let branch_id = req.params.branchId;
  if (branch_id == "all") {
      mysqlConnection.query(
        `SELECT ordert.branch_id, branch.street, sum(price*amount) as totalprice 
        FROM ordert natural join orderline natural join menu, branch
        where ordert.branch_id = branch.branch_id
        group by branch_id;`,
        (err, results, fields) => {
          if (!err) {
            res.send(results);
          } else {
            console.log(err);
          }
        }
      );
  } else {
    mysqlConnection.query(
      `SELECT ordert.branch_id, branch.street, sum(price*amount) as totalprice 
      FROM ordert natural join orderline natural join menu, branch
      where ordert.branch_id = branch.branch_id and ordert.branch_id = ${branch_id}
      group by branch_id;`,
      (err, results, fields) => {
        if (!err) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  }
  });


  module.exports = Router;