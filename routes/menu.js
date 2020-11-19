const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();



//10--------------------------------------------------------------------------------
Router.get('/menu/:branchId', (req, res) => {
    let branchId = req.params.branchId;
    if (branchId == "all") {
      mysqlConnection.query(
        `SELECT imgUrl, menu_id, name, type, price, ingredient FROM menu`,
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
        `SELECT imgUrl, menu_id, name, type, price, ingredient FROM menu natural join branch_has_menu where branch_id = ${branchId}`,
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


//14--------------------------------------------------------------------------------
  Router.delete("/delete/menu/:menuId/:branchId", (req, res) => {
    let branch_id = req.params.branchId
    let menu_id = req.params.menuId
    let qb = req.body;
    if (branch_id == "all") {
      mysqlConnection.query(
        `DELETE FROM menu WHERE menu_id= ${menu_id} `,
        [req.params.id],
        (err, results, fields) => {
          if (!err) {
            res.send("The selected quarterback has been successfully deleted.");
          } else {
            console.log(err);
          }
        }
      );
    }
    else {
        mysqlConnection.query(
          `DELETE FROM branch_has_menu WHERE menu_id= ${menu_id} and branch_id = ${branch_id} `,
          [req.params.id],
          (err, results, fields) => {
            if (!err) {
              res.send("The selected quarterback has been successfully deleted.");
            } else {
              console.log(err);
            }
          }
        );
    }
  });

module.exports = Router;