const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// bcrypt setup for password salt/hashing
const bcrypt = require("bcrypt");
const saltRounds = 10;

const port = process.env.PORT || 8080;
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

// JWT setup
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");

const secretKey = process.env.SECRET_KEY;
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

// create MySQL connection and connect
var connection = mysql.createConnection({
  host: "sql9.freemysqlhosting.net",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});
connection.connect();

// endpoint to retrieve a given user's budgets
app.get("/api/budget/:id", jwtMW, async (req, res) => {
  connection.query(
    // use Foreign Key to obtain budgets
    "SELECT * FROM budget WHERE user_FK = ?",
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.json(results);
    }
  );
});

// endpoint to let a user create a new budget
app.post("/api/budget", jwtMW, async (req, res) => {
  // relevant attributes are passed in the request body
  const title = req.body.title;
  const budget = req.body.budget;
  const tags = req.body.tags;
  const dataColor = req.body.dataColor;
  const month = req.body.month;
  const user_FK = req.body.user_FK;
  connection.query(
    // insert a budget using attributes
    `INSERT INTO budget (title, budget, tags, dataColor, month, user_FK) VALUES ('${title}', ${budget}, '${tags}', '${dataColor}', '${month}', '${user_FK}')`,
    function (error, results, fields) {
      if (error) throw error;
      // use status code 201 to indicate new budget created
      res.status(201).json(results);
    }
  );
});

// endpoint to let a user edit a budget item's actual expenses
app.put("/api/budget/:id", jwtMW, async (req, res) => {
  // expect id in params and actualSpent amt in body
  const id = req.params.id;
  const actualSpent = req.body.actualSpent;
  connection.query(
    `UPDATE budget SET actualSpent = '${actualSpent}' WHERE id='${id}'`,
    function (error, results, fields) {
      if (error) throw error;
      // use status code 201 to indicate successfully modified budget
      res.status(201).json(results);
      console.log(results);
    }
  );
});

// endpoint to allow a user to signup
app.post("/api/signup", async (req, res) => {
  // expect email and password in request body
  const { email, password } = req.body;

  // auto-generate a salt to encrypt password
  bcrypt.hash(password, saltRounds, function (err, hash) {
    connection.query(
      // insert username and encrypted password into database
      `INSERT INTO users (email, password) VALUES ('${email}', '${hash}')`,
      function (error, results, fields) {
        if (error) {
          return res.status(401).json({
            success: false,
            err: error,
            msg: "Your account could not be created.",
          });
        }
        // if no error, use status code 201 to indicate account created
        return res.status(201).json({
          results: results,
          success: true,
          err: null,
          msg: "Successfully created your account!",
        });
      }
    );
  });
});

// endpoint to allow user to login
app.post("/api/login", async (req, res) => {
  // expect email and password in request body
  const { email, password } = req.body;

  connection.query(
    // first search for user with this email
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (error, results, fields) {
      // if no results, throw error that credentials are incorrect
      if (error) {
        throw error;
      } else if (!results.length) {
        return res.status(401).json({
          success: false,
          token: null,
          msg: "Username or password is incorrect",
        });
      } else {
        // otherwise, compare entered password to encrypted password in database
        console.log(`Results: ${results[0].password}`);
        bcrypt.compare(
          password,
          results[0].password,
          function (err, bcryptRes) {
            // if successful match made, create a token
            if (bcryptRes) {
              let token = jwt.sign(
                { id: results[0].id, email: results[0].email },
                secretKey,
                {
                  expiresIn: "7d",
                }
              );
              // return token in response with status 201 to indicate successful entry
              return res.status(201).json({
                results: results,
                success: true,
                err: null,
                token,
                msg: "Successfully logged in!",
              });
            } else {
              // otherwise, send 401 error code and appropriate message
              return res.status(401).json({
                success: false,
                token: null,
                msg: "Username or password is incorrect",
              });
            }
          }
        );
      }
    }
  );
});

// serve on port
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
