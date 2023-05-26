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
  module.exports = rawSQL.split(";\r\n");
};
// Database
// var db = require("./db-connector");
var db = require("./db-connector-humberj");
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
const hbs = exphbs.create({
  defaultLayout: "main",
  helpers: {
    hasForeignKey: function (columnName, fkInfo) {
      const matchingForeignKey = fkInfo.find(
        (fk) => fk.COLUMN_NAME === columnName
      );
      return matchingForeignKey ? "FK" : "";
    },
    ifEquals: function (columnName, fkInfo) {
      const matchingForeignKey = fkInfo.find(
        (fk) => fk.COLUMN_NAME === columnName
      );
      return matchingForeignKey ? true : false;
    },
  },
});

// Configure Express to use the custom handlebars instance
app.engine("handlebars", hbs.engine);
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

async function getTableFromFK(fkInfo) {
  var retVal = {};
  for (var i = 0; i < fkInfo.length; i++) {
    var columnsQ = "SHOW COLUMNS FROM " + fkInfo[i].REFERENCED_TABLE_NAME + ";";
    try {
      const results = await new Promise((resolve, reject) => {
        db.pool.query(columnsQ, function (err, results, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      // console.log(results);
      retVal[fkInfo[i].COLUMN_NAME] = results.find((column) =>
        column.Field.includes("name")
      ); // Resolve the promise with the query results
    } catch (error) {
      console.log(error);
      throw error; // Re-throw the error to be caught in the calling code
    }
  }
  return retVal;
}

runArrQueries(ddl);
// runQueries(dml);
app.get("/", function (req, res) {
  res.status(200).render("mainPage", { mainDirData: mainDir });
});

app.get("/custQuery", function (req, res, next) {
  var custQ = req.headers.query;
  runSingleQueries(custQ)
    .then(function (returndata) {
      // console.log("results " + returndata);
      try {
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(returndata));
      } catch (err) {
        res.status(500).send("Failed to read data: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to read data: " + err);
    });
});

app.get("/readData", function (req, res, next) {
  var readQ = "SELECT * FROM " + req.headers.page;
  runSingleQueries(readQ)
    .then(function (returndata) {
      // console.log("results " + returndata)
      try {
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(returndata));
      } catch (err) {
        res.status(500).send("Failed to read data: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to read data: " + err);
    });
});

app.post("/addData", function (req, res, next) {
  console.log(req.body.newData);
  var createQ = "INSERT INTO " + req.body.page + " VALUES(";
  for (var key in req.body.newData) {
    if (key == "ID" || req.body.newData[key] == "DEFAULT") {
      createQ += "DEFAULT,";
      continue;
    }
    createQ += "'" + req.body.newData[key] + "',";
  }
  createQ = createQ.slice(0, -1);
  createQ += ");";
  runSingleQueries(createQ)
    .then(function (returndata) {
      res.status(200).send("New data successfully stored.");
    })
    .catch((err) => {
      next(err); // Pass the error to the error-handling middleware
    });
});

app.post("/removeData", function (req, res, next) {
  var deleteQ =
    "DELETE FROM " +
    req.body.page +
    " WHERE " +
    req.body.pageID +
    "=" +
    req.body.index +
    ";";
  runSingleQueries(deleteQ)
    .then(function (returndata) {
      // console.log("results " + returndata)
      try {
        res.status(200).send("Data successfully deleted.");
      } catch (err) {
        res.status(500).send("Failed to delete data point: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to delete data point: " + err);
    });
});

app.post("/editData", function (req, res, next) {
  var updateQ =
    "UPDATE " +
    req.body.page +
    " SET " +
    req.body.key +
    "='" +
    req.body.newString +
    "' WHERE " +
    req.body.pageID +
    "=" +
    req.body.index +
    ";";
  runSingleQueries(updateQ)
    .then(function (returndata) {
      // console.log("results " + returndata)
      try {
        res.status(200).send("Data successfully updated.");
      } catch (err) {
        res.status(500).send("Failed to update data: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to update data: " + err);
    });
});

app.get("/employee*-project*", function (req, res) {
  var columnsQ = "SHOW COLUMNS FROM employees_projects;";
  var fkQ =
    "SELECT COLUMN_NAME, REFERENCED_TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'employees_projects' AND CONSTRAINT_NAME <> 'PRIMARY' AND REFERENCED_TABLE_NAME IS NOT NULL;";
  runSingleQueries(columnsQ)
    .then(function (returndata) {
      // console.log("results " + returndata);
      try {
        runSingleQueries(fkQ)
          .then(function (fks) {
            // console.log("results " + fks);
            try {
              getTableFromFK(fks)
                .then(function (table) {
                  console.log("results " + table);
                  try {
                    res.status(200).render("employeesProjects", {
                      employeesProjectsData: employeesProjectsData,
                      mainDirData: mainDir,
                      atributeInfo: returndata,
                      fkInfo: fks,
                      fkTable: table,
                    });
                  } catch (err) {
                    res.status(500).send("Server failed to respond: " + err);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send("Server failed to respond: " + err);
                });
            } catch (err) {
              res.status(500).send("Server failed to respond: " + err);
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Server failed to respond: " + err);
          });
      } catch (err) {
        res.status(500).send("Server failed to respond: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server failed to respond: " + err);
    });
});

app.get("/*employee*", function (req, res) {
  var columnsQ = "SHOW COLUMNS FROM employees;";
  var fkQ =
    "SELECT COLUMN_NAME, REFERENCED_TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'employees' AND CONSTRAINT_NAME <> 'PRIMARY' AND REFERENCED_TABLE_NAME IS NOT NULL;";
  runSingleQueries(columnsQ)
    .then(function (returndata) {
      // console.log("results " + returndata);
      try {
        runSingleQueries(fkQ)
          .then(function (fks) {
            // console.log("results " + fks);
            try {
              getTableFromFK(fks)
                .then(function (table) {
                  console.log("results " + table);
                  try {
                    res.status(200).render("employees", {
                      employeeData: employeeData,
                      mainDirData: mainDir,
                      atributeInfo: returndata,
                      fkInfo: fks,
                      fkTable: table,
                    });
                  } catch (err) {
                    res.status(500).send("Server failed to respond: " + err);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send("Server failed to respond: " + err);
                });
            } catch (err) {
              res.status(500).send("Server failed to respond: " + err);
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Server failed to respond: " + err);
          });
      } catch (err) {
        res.status(500).send("Server failed to respond: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server failed to respond: " + err);
    });
});

app.get("/*project*", function (req, res) {
  var columnsQ = "SHOW COLUMNS FROM projects;";
  runSingleQueries(columnsQ)
    .then(function (returndata) {
      console.log("results " + returndata);
      try {
        res.status(200).render("projects", {
          projectData: projectData,
          mainDirData: mainDir,
          atributeInfo: returndata,
        });
      } catch (err) {
        res.status(500).send("Server failed to respond: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server failed to respond: " + err);
    });
});

app.get("/*salary", function (req, res) {
  var columnsQ = "SHOW COLUMNS FROM salaries;";
  var fkQ =
    "SELECT COLUMN_NAME, REFERENCED_TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'salaries' AND CONSTRAINT_NAME <> 'PRIMARY' AND REFERENCED_TABLE_NAME IS NOT NULL;";
  runSingleQueries(columnsQ)
    .then(function (returndata) {
      console.log("results " + returndata);
      try {
        runSingleQueries(fkQ)
          .then(function (fks) {
            // console.log("results " + fks);
            try {
              getTableFromFK(fks)
                .then(function (table) {
                  console.log("results " + table);
                  try {
                    res.status(200).render("salaries", {
                      salaryData: salaryData,
                      mainDirData: mainDir,
                      atributeInfo: returndata,
                      fkInfo: fks,
                      fkTable: table,
                    });
                  } catch (err) {
                    res.status(500).send("Server failed to respond: " + err);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send("Server failed to respond: " + err);
                });
            } catch (err) {
              res.status(500).send("Server failed to respond: " + err);
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Server failed to respond: " + err);
          });
      } catch (err) {
        res.status(500).send("Server failed to respond: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server failed to respond: " + err);
    });
});

app.get("/*salaries", function (req, res) {
  var columnsQ = "SHOW COLUMNS FROM salaries;";
  var fkQ =
    "SELECT COLUMN_NAME, REFERENCED_TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'salaries' AND CONSTRAINT_NAME <> 'PRIMARY' AND REFERENCED_TABLE_NAME IS NOT NULL;";
  runSingleQueries(columnsQ)
    .then(function (returndata) {
      console.log("results " + returndata);
      try {
        runSingleQueries(fkQ)
          .then(function (fks) {
            // console.log("results " + fks);
            try {
              getTableFromFK(fks)
                .then(function (table) {
                  console.log("results " + table);
                  try {
                    res.status(200).render("salaries", {
                      salaryData: salaryData,
                      mainDirData: mainDir,
                      atributeInfo: returndata,
                      fkInfo: fks,
                      fkTable: table,
                    });
                  } catch (err) {
                    res.status(500).send("Server failed to respond: " + err);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send("Server failed to respond: " + err);
                });
            } catch (err) {
              res.status(500).send("Server failed to respond: " + err);
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Server failed to respond: " + err);
          });
      } catch (err) {
        res.status(500).send("Server failed to respond: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server failed to respond: " + err);
    });
});

app.get("/*role*", function (req, res) {
  var columnsQ = "SHOW COLUMNS FROM roles;";
  runSingleQueries(columnsQ)
    .then(function (returndata) {
      console.log("results " + returndata);
      try {
        res.status(200).render("roles", {
          roleData: roleData,
          mainDirData: mainDir,
          atributeInfo: returndata,
        });
      } catch (err) {
        res.status(500).send("Server failed to respond: " + err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server failed to respond: " + err);
    });
});

app.get("*", function (req, res) {
  res.status(404).render("404", { mainDirData: mainDir });
});

// Error-handling middleware
app.use(function (err, req, res, next) {
  console.error(err); // Log the error for debugging purposes

  // Send the error message to the client
  res.status(500).send("Failed to store data: " + err.message);
});

app.listen(PORT, function (err) {
  if (err) throw err;
  console.log("== Server is listening on port", PORT);
});
