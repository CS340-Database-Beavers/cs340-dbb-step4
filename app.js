/*
    SETUP for a simple webapp
*/
// Express
var fs = require("fs");
var express = require("express"); // We are using the express library for the web server
var exphbs = require("express-handlebars");
var app = express(); // We need to instantiate an express object to interact with the server in our code
PORT = process.env.PORT || 4221; // Set a port number at the top so it's easy to change in the future
require.extensions[".sql"] = async function (module, filename) {
  var rawSQL = fs.readFileSync(filename, "utf8");
  // module.exports = rawSQL;
  // module.exports = rawSQL.replace(/\r|\n/g, '');
  // var dataArr = rawSQL.split('\n');
  module.exports = rawSQL.split(";\n");
};
// Database
var db = require("./db-connector-humberj") || require("./db-connector");
var ddl = require("./DDL.sql");
var dml = require("./DML.sql");
var employeeData = require("./json/employeeData.json");
var roleData = require("./json/roleData.json");
var salaryData = require("./json/salaryData.json");
var projectData = require("./json/projectData.json");
var employeesProjectsData = require("./json/employeesProjectsData.json");
const data = {
  employee: employeeData,
  project: projectData,
  role: roleData,
  salary: salaryData,
};
var mainDir = require("./json/mainDir.json");
//Handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use("/public", express.static("./public/"));
/*
    ROUTES
*/
async function runArrQueries(sqlArr) {
  for (var query of sqlArr) {
    // console.log(query);
    if (query) {
      query += ";";
      try {
        const results = await new Promise((resolve, reject) => {
          db.pool.query(query, function (err, results, fields) {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
        // console.log(results);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function runSingleQueries(query) {
  // console.log(query);
  if (query) {
    try {
      const results = await new Promise((resolve, reject) => {
        db.pool.query(query, function (err, results, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      // console.log(results);
      return results; // Resolve the promise with the query results
    } catch (error) {
      console.log(error);
      throw error; // Re-throw the error to be caught in the calling code
    }
  } else {
    throw new Error("Query is missing."); // Throw an error if query is not provided
  }
}

runArrQueries(ddl);
// runQueries(dml);

app.get("/", function (req, res) {
  res.status(200).render("mainPage", { mainDirData: mainDir });
});

app.get("/readData", function (req, res, next) {
  var readQ = "SELECT * FROM " + req.headers.page;
  runSingleQueries(readQ).then(function(returndata){
    // console.log("results " + returndata)
  try {
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(returndata));
  } catch (err) {
    res.status(500).send("Failed to read data: " + err);
  }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("Failed to read data: " + err);
  });
});

app.post("/addData", function (req, res, next) {
  var createQ = "INSERT INTO " + req.body.page + " VALUES(DEFAULT";
  for(var key in req.body.newData){
    if(key == "ID") {continue}
    createQ += ",'" + req.body.newData[key] + "'"
  }
  createQ += ");"
  runSingleQueries(createQ).then(function(returndata){
    // console.log("results " + returndata)
  try {
    res.status(200).send("New data successfully stored.");
  } catch (err) {
    res.status(500).send("Failed to store data: " + err);
  }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("Failed to store data: " + err);
  });
});

app.post("/removeData", function (req, res, next) {
  data[req.body.page].splice(parseInt(req.body.index), 1);
  var addDataPath = "./json/" + req.body.page + "Data.json";
  fs.writeFile(
    addDataPath,
    JSON.stringify(data[req.body.page], null, 2),
    function (err) {
      if (err) {
        res.status(500).send("Failed to delete data point.");
      } else {
        res.status(200).send("Data successfully deleted.");
      }
    }
  );
});

app.post("/editData", function (req, res, next) {
  var updateQ = "UPDATE " + req.body.page + " SET " + req.body.key + '=' + req.body.newString + " WHERE " + req.body.pageID + '=' + req.body.index + ';';
  runSingleQueries(updateQ).then(function(returndata){
    // console.log("results " + returndata)
  try {
    res.status(200).send("Data successfully updated.");
  } catch (err) {
    res.status(500).send("Failed to update data: " + err);
  }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("Failed to update data: " + err);
  });
});

app.get("/employee*-project*", function (req, res) {
  res.status(200).render("employeesProjects", {
    employeesProjectsData: employeesProjectsData,
    mainDirData: mainDir,
  });
});

app.get("/*employee*", function (req, res) {
  res
    .status(200)
    .render("employees", { employeeData: employeeData, mainDirData: mainDir });
});

app.get("/*project*", function (req, res) {
  res
    .status(200)
    .render("projects", { projectData: projectData, mainDirData: mainDir });
});

app.get("/*salary", function (req, res) {
  res
    .status(200)
    .render("salaries", { salaryData: salaryData, mainDirData: mainDir });
});

app.get("/*salaries", function (req, res) {
  res
    .status(200)
    .render("salaries", { salaryData: salaryData, mainDirData: mainDir });
});

app.get("/*role*", function (req, res) {
  res.status(200).render("roles", { roleData: roleData, mainDirData: mainDir });
});

app.get("*", function (req, res) {
  res.status(404).render("404", { mainDirData: mainDir });
});

app.listen(PORT, function (err) {
  if (err) throw err;
  console.log("== Server is listening on port", PORT);
});
