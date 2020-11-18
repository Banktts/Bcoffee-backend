const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const qbRoutes = require("./routes/qb");

const app = express();

app.use(bodyParser.json());

app.use(qbRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Ahoy!' })
  })

app.listen(4000);