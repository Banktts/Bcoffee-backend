const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();

//-------------
 //3------------------------------------------------------------------
 Router.get("/order/:branchId", (req, res) => {
    let branch_id = req.params.branchId;
    if (branch_id == "all") {
      console.log("yes")
      mysqlConnection.query(
        `select order_id ,customer_id,date,time, branch_id,emp_id,sum(price*amount) as totalpriceb From ordert natural join orderline natural join menu group by order_id`,
        (err, results, fields) => {
          if (!err) {
            res.send(results);
          } else {
            console.log(err);
          }
        }
      );
    }
    else {
      mysqlConnection.query(
        `select order_id ,customer_id,date,time, branch_id,emp_id,sum(price*amount) as totalpriceb From ordert natural join orderline natural join menu where branch_id = ${branch_id} group by order_id`,
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

  //5-------------------------------------------------------------------เหลือ add orderline
Router.post("/post/order", (req, res) => {
    let qb = req.body;
    const sql =
      "SET @customer_id = ?;SET @date = ?;SET @time = ?;SET @branch_id = ?;SET @emp_id = ?;CALL placeOrder(@customer_id, @date, @time, @branch_id, @emp_id)";
    mysqlConnection.query(
      sql,
      [
        qb.customer_id,
        qb.date,
        qb.time,
        qb.branch_id,
        qb.emp_id
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


  Router.post("/post/orderline", (req, res) => {
    let order_id = req.body.orderId;
    let menu_id = req.body.menuId;
    let amount = req.body.amount;
    const sql =
      "SET @order_id = ?;SET @menu_id = ?;SET @amount = ?;CALL placeOrderline(@order_id, @menu_id, @amount)";
    mysqlConnection.query(
      sql,
      [
        order_id,
        menu_id,
        amount
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


  Router.get("/orderline/:orderId/:menuId", (req, res) => {
    let order_id = req.params.orderId;
    let menu_id = req.params.menuId;
    mysqlConnection.query(
      `select  M.name, amount, O.amount*M.price as price 
      from orderline O, menu M 
      where O.menu_id = M.menu_id and O.order_id = ${order_id} and O.menu_id = ${menu_id};`,
      (err, results, fields) => {
        if (!err) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
   });


   Router.put("/update/orderline/:orderId/:menuId", (req, res) => {
    let order_id = req.params.orderId
    let menu_id = req.params.menuId
    let newAmount = req.body.amount;
    const sql =
      "SET @order_id = ?;SET @menu_id = ?;SET @newAmount = ?;CALL updateAmountOrderline(@order_id, @menu_id, @newAmount)";
    mysqlConnection.query(
      sql,
      [
        order_id,
        menu_id,
        newAmount
      ],
      (err, results, fields) => {
        if (!err) {
          res.send(
            "The data for the selected quarterback has been successfully updated."
          );
        } else {
          console.log(err);
        }
      }
    );
  });


  Router.delete("/delete/orderline/:orderId/:menuId", (req, res) => {
    let order_id = req.params.orderId
    let menu_id = req.params.menuId
    mysqlConnection.query(
      `DELETE FROM orderline WHERE order_id= ${order_id} and menu_id= ${menu_id} `,
      (err, results, fields) => {
        if (!err) {
          res.send("The selected quarterback has been successfully deleted.");
        } else {
          console.log(err);
        }
      }
    );
  });


  //6--------------------------------------------------------------------------รอภีมมมมมมม
Router.get("/order/:orderId", (req, res) => {
    let order_id = req.params.orderId;
    mysqlConnection.query(
      `SELECT order_id, GROUP_CONCAT('Menu: ', name, ', Price: ', price, ', Amount: ', amount, ', Total Price: ', price*amount, ', IMG: ', imgUrl order by name asc separator ';  ') AS Orders, sum(price*amount) AS Total FROM ORDERT NATURAL JOIN ORDERLINE NATURAL JOIN MENU where order_id = ${order_id} group by order_id`,
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