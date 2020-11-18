const express = require("express");
const mysqlConnection = require("../utils/database");

const Router = express.Router();

//1------------------------------------------------------------------
Router.get("/employee", (req, res) => {
    let qb = req.body;
    if (qb.branch == 0) {
        mysqlConnection.query(
            `SELECT emp_id, name, position, sex, birthdate, startDate, salary FROM employee`,
            (err, results, fields) => {
              if (!err) {
                res.send(results);
              } else {
                console.log(err);
              }
            }
          );
    }
    else{
        mysqlConnection.query(
            `SELECT emp_id, name, position, sex, birthdate, startDate, salary FROM employee where branch_id = ${qb.branch}`,
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

  //2------------------------------------------------------------------
   Router.put("/changeposition", (req, res) => {
    let qb = req.body;
    const sql =
      "SET @emp_id = ?;SET @position = ?;CALL updatePosition(@emp_id, @position)";  
      mysqlConnection.query(
      sql,
      [
          qb.emp_id,
          qb.position,
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


  //3------------------------------------------------------------------
Router.get("/order", (req, res) => {
  let qb = req.body;
  if (qb.branch == 0) {
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
      `select order_id ,customer_id,date,time, branch_id,emp_id,sum(price*amount) as totalpriceb From ordert natural join orderline natural join menu where branch_id = ${qb.branch} group by order_id`,
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



  //4------------------------------------------------------------------
Router.get("/ordermenu", (req, res) => {
  let qb = req.body;
  mysqlConnection.query(
    `SELECT imgUrl, name, price FROM menu natural join branch_has_menu where branch_id = 1;`,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
        console.log(req.body);
      } else {
        console.log(err);
      }
    }
  );
});

//5-------------------------------------------------------------------เหลือ add orderline
Router.post("/placeorder", (req, res) => {
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
 

//6--------------------------------------------------------------------------
Router.get("/order_line_detail", (req, res) => {
  let qb = req.body;
  mysqlConnection.query(
    `SELECT order_id, GROUP_CONCAT('Menu: ', name, ', Price: ', price, ', Amount: ', amount, ', Total Price: ', price*amount, ', IMG: ', imgUrl order by name asc separator ';  ') AS Orders, sum(price*amount) AS Total FROM ORDERT NATURAL JOIN ORDERLINE NATURAL JOIN MENU where order_id = ${qb.order_id} group by order_id`,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        console.log(err);
      }
    }
  );
 });

 
 //7--------------------------------------------------------------------------
 Router.get("/inventory", (req, res) => {
  let qb = req.body;
  if (qb.branch == 0) {
      mysqlConnection.query(
          `SELECT item_id, name, branch_id, amount, unit FROM inventory`,
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
  else{
      mysqlConnection.query(
        `SELECT item_id, name, branch_id, amount, unit FROM inventory where branch_id = ${qb.branch}`,
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

//8------------------------------------------------------------------
Router.put("/update_amount", (req, res) => {
  let qb = req.body;
  const sql =
    "SET @item_id = ?;SET @branch_id = ?;SET @amount = ?;CALL updateAmount(@item_id, @branch_id, @amount)";  
    mysqlConnection.query(
    sql,
    [
        qb.item_id,
        qb.branch_id,
        qb.amount
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

//9--------------------------------------------------------------------------------
Router.get("/branch", (req, res) => {
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


//10--------------------------------------------------------------------------------
Router.get("/menu", (req, res) => {
  let qb = req.body;
  if (qb.branch == 0) {
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
  else{
      mysqlConnection.query(
      `SELECT imgUrl, menu_id, name, type, price, ingredient FROM menu natural join branch_has_menu where branch_id = ${qb.branch}`,
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


 //11--------------------------------------------------------------------------------
 Router.get("/customer", (req, res) => {
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
});


 //12--------------------------------------------------------------------------------
 Router.post("/addcustomer", (req, res) => {
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

 //13--------------------------------------------------------------------------------
 Router.delete("/delete_employee", (req, res) => {
  let qb = req.body;
  mysqlConnection.query(
    `DELETE FROM employee WHERE emp_id= ${qb.emp_id} `,
    [req.params.id],
    (err, results, fields) => {
      if (!err) {
        res.send("The selected quarterback has been successfully deleted.");
      } else {
        console.log(err);
      }
    }
  );
});

//14--------------------------------------------------------------------------------
Router.delete("/delete_menu", (req, res) => {
  let qb = req.body;
  if (qb.branch == 0) {
    mysqlConnection.query(
      `DELETE FROM menu WHERE menu_id= ${qb.menu_id} `,
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
        `DELETE FROM branch_has_menu WHERE menu_id= ${qb.menu_id} and branch_id = ${qb.branch_id} `,
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



module.exports = Router;


